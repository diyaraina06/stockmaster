// src/state/store.js
// Simple localStorage-backed store for StockMaster
// Exposes functions to manage products and documents (receipts, deliveries, adjustments, moves).
// This is synchronous and tiny — good for prototyping / hackathon demos.
// Data keys used in localStorage:
//  - sm_products
//  - sm_documents
//
// Document schema example:
// { id: 'R-001', type: 'receipts'|'deliveries'|'internal'|'adjustments', status: 'Draft'|'Waiting'|'Ready'|'Done'|'Canceled', items: [ { sku, qty } ], warehouse: 'WH-A', meta: { supplier/customer } }

const LS_PRODUCTS = "sm_products";
const LS_DOCUMENTS = "sm_documents";

function read(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        console.error("store read error", e);
        return fallback;
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error("store write error", e);
    }
}

/* ---------- Products API ---------- */

export function getProducts() {
    return read(LS_PRODUCTS, [
        // initial demo seed (only used first time)
        { sku: "PRD-001", name: "Blue Widget", category: "Widgets", uom: "pcs", qty: 120, warehouse: "WH-A", reorder: 50 },
        { sku: "PRD-002", name: "Red Widget", category: "Widgets", uom: "pcs", qty: 4, warehouse: "WH-B", reorder: 20 },
        { sku: "PRD-003", name: "Green Cable", category: "Cables", uom: "pcs", qty: 0, warehouse: "WH-A", reorder: 10 },
        { sku: "PRD-004", name: "Power Adapter", category: "Accessories", uom: "pcs", qty: 32, warehouse: "WH-C", reorder: 15 },
    ]);
}

/**
 * Add a product.
 * product = { sku, name, category, uom, qty (optional), warehouse(optional), reorder(optional) }
 * throws Error if SKU already exists
 */
export function addProduct(product) {
    const products = getProducts();
    const exists = products.find((p) => p.sku === product.sku);
    if (exists) throw new Error("SKU already exists");
    const p = {
        sku: product.sku,
        name: product.name,
        category: product.category || "Uncategorized",
        uom: product.uom || "pcs",
        qty: Number.isFinite(Number(product.qty)) ? Number(product.qty) : 0,
        warehouse: product.warehouse || "WH-A",
        reorder: product.reorder || 0,
    };
    products.unshift(p);
    write(LS_PRODUCTS, products);
    return p;
}

/**
 * Update existing product by sku (partial update)
 */
export function updateProduct(sku, patch) {
    const products = getProducts();
    const idx = products.findIndex((p) => p.sku === sku);
    if (idx === -1) throw new Error("Product not found");
    products[idx] = { ...products[idx], ...patch };
    // ensure qty numeric
    products[idx].qty = Number.isFinite(Number(products[idx].qty)) ? Number(products[idx].qty) : 0;
    write(LS_PRODUCTS, products);
    return products[idx];
}

/* change stock for a SKU in a warehouse (positive = increase, negative = decrease)
   returns updated product or throws error if insufficient stock for decrease
*/
export function changeStock(sku, delta, warehouse = null) {
    // Note: product model here holds a single warehouse field. For simplicity we mutate qty on product.
    const products = getProducts();
    const idx = products.findIndex((p) => p.sku === sku && (!warehouse || p.warehouse === warehouse));
    if (idx === -1) throw new Error("Product not found for SKU/warehouse");
    const newQty = Number(products[idx].qty || 0) + Number(delta);
    if (newQty < 0) throw new Error("Insufficient stock");
    products[idx].qty = newQty;
    write(LS_PRODUCTS, products);
    return products[idx];
}

/* ---------- Documents API (receipts/deliveries/internal/adjustments) ---------- */

export function getDocuments() {
    return read(LS_DOCUMENTS, [
        // seed documents for demo
        { id: "R-001", type: "receipts", status: "Waiting", items: [{ sku: "PRD-001", qty: 10 }], warehouse: "WH-A", meta: { supplier: "Acme" } },
        { id: "D-001", type: "deliveries", status: "Draft", items: [{ sku: "PRD-002", qty: 2 }], warehouse: "WH-B", meta: { customer: "Beta" } },
    ]);
}

function nextId(prefix) {
    const docs = getDocuments();
    const last = docs.slice().reverse().find((d) => d.id.startsWith(prefix));
    if (!last) return `${prefix}-001`;
    const num = (Number(last.id.split("-").pop()) || 0) + 1;
    return `${prefix}-${String(num).padStart(3, "0")}`;
}

/**
 * Create a document (receipt,delivery,internal,adjustment)
 * doc = { type, status, items: [{sku, qty}], warehouse, meta }
 */
export function createDocument(doc) {
    const docs = getDocuments();
    const prefix = doc.type === "receipts" ? "R" : doc.type === "deliveries" ? "D" : doc.type === "internal" ? "T" : "A";
    const id = nextId(prefix);
    const d = { id, type: doc.type, status: doc.status || "Draft", items: doc.items || [], warehouse: doc.warehouse || null, meta: doc.meta || {} };
    docs.unshift(d);
    write(LS_DOCUMENTS, docs);
    return d;
}

/**
 * Validate (confirm) a document:
 *  - For receipts: increase stock by each item.qty
 *  - For deliveries: decrease stock (throws if insufficient)
 *  - For internal: decrease from source and (optionally) increase to destination (document should include meta.toWarehouse)
 *  - For adjustments: set product qty to counted amount (items: [{sku, qty_counted}])
 *
 * On success, document.status becomes 'Done' and saved.
 */
export function validateDocument(id) {
    const docs = getDocuments();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Document not found");
    const doc = docs[idx];

    // Apply changes
    if (doc.type === "receipts") {
        doc.items.forEach((it) => {
            changeStock(it.sku, Number(it.qty || 0), doc.warehouse);
        });
    } else if (doc.type === "deliveries") {
        doc.items.forEach((it) => {
            changeStock(it.sku, -Number(it.qty || 0), doc.warehouse);
        });
    } else if (doc.type === "internal") {
        // meta should contain toWarehouse
        const toWh = doc.meta && doc.meta.toWarehouse;
        if (!toWh) throw new Error("internal transfer missing destination warehouse (meta.toWarehouse)");
        doc.items.forEach((it) => {
            // subtract from source warehouse (doc.warehouse) then add to toWh
            changeStock(it.sku, -Number(it.qty || 0), doc.warehouse);
            // attempt to find product, if SKU exists but different warehouse, we'll duplicate product entry for destination
            try {
                changeStock(it.sku, Number(it.qty || 0), toWh);
            } catch (e) {
                // if no product row exists for destination, clone product record into new warehouse
                const products = getProducts();
                const base = products.find(p => p.sku === it.sku);
                if (base) {
                    const clone = { ...base, warehouse: toWh, qty: Number(it.qty || 0) };
                    products.unshift(clone);
                    write(LS_PRODUCTS, products);
                }
            }
        });
    } else if (doc.type === "adjustments") {
        // items expected to have qty_counted
        doc.items.forEach((it) => {
            // set qty to counted
            const products = getProducts();
            const idxP = products.findIndex(p => p.sku === it.sku && (!doc.warehouse || p.warehouse === doc.warehouse));
            if (idxP === -1) {
                // create new product row with counted qty
                const newP = { sku: it.sku, name: it.sku, category: "Uncategorized", uom: "pcs", qty: Number(it.qty_counted || 0), warehouse: doc.warehouse || "WH-A", reorder: 0 };
                products.unshift(newP);
            } else {
                products[idxP].qty = Number(it.qty_counted || 0);
            }
            write(LS_PRODUCTS, products);
        });
    }

    doc.status = "Done";
    docs[idx] = doc;
    write(LS_DOCUMENTS, docs);
    return doc;
}

/* ---------- Utility helpers ---------- */

export function findProduct(sku) {
    const products = getProducts();
    return products.find((p) => p.sku === sku) || null;
}

export function resetDemoData() {
    localStorage.removeItem(LS_PRODUCTS);
    localStorage.removeItem(LS_DOCUMENTS);
}
