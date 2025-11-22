import React, { useMemo, useState } from "react";
import "./dashboard.css";

// Mock data
const MOCK_PRODUCTS = [
  { sku: "PRD-001", name: "Blue Widget", category: "Widgets", warehouse: "WH-A", qty: 120, status: "Ready" },
  { sku: "PRD-002", name: "Red Widget", category: "Widgets", warehouse: "WH-B", qty: 4, status: "Low Stock" },
  { sku: "PRD-003", name: "Green Cable", category: "Cables", warehouse: "WH-A", qty: 0, status: "Out of Stock" },
  { sku: "PRD-004", name: "Power Adapter", category: "Accessories", warehouse: "WH-C", qty: 32, status: "Ready" },
];

const MOCK_DOCUMENTS = [
  { id: "R-001", type: "receipts", status: "Waiting", warehouse: "WH-A" },
  { id: "R-002", type: "receipts", status: "Ready", warehouse: "WH-B" },
  { id: "D-001", type: "deliveries", status: "Waiting", warehouse: "WH-A" },
  { id: "T-001", type: "internal", status: "Draft", warehouse: "WH-C" },
  { id: "A-001", type: "adjustments", status: "Done", warehouse: "WH-B" },
];

export default function StockMasterDashboard() {
  // Product filters
  const [query, setQuery] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [category, setCategory] = useState("");
  const [productStatus, setProductStatus] = useState("");

  // Document filters
  const [docType, setDocType] = useState("");
  const [docStatus, setDocStatus] = useState("");

  // Filtered products (applies product-related filters)
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      if (query && !(`${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()))) return false;
      if (warehouse && p.warehouse !== warehouse) return false;
      if (category && p.category !== category) return false;
      if (productStatus && p.status !== productStatus) return false;
      return true;
    });
  }, [query, warehouse, category, productStatus]);

  // Filtered documents (applies doc-type and doc-status)
  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter((d) => {
      if (docType && d.type !== docType) return false;
      if (docStatus && d.status !== docStatus) return false;
      if (warehouse && d.warehouse !== warehouse) return false; // filter documents by warehouse if selected
      return true;
    });
  }, [docType, docStatus, warehouse]);

  // Dynamic KPI calculations from mock data
  const totalProductsInStock = MOCK_PRODUCTS.reduce((s, p) => s + (Number(p.qty) || 0), 0);
  const totalSKUs = MOCK_PRODUCTS.length;
  const lowStockCount = MOCK_PRODUCTS.filter((p) => p.qty <= 5).length;
  const pendingReceipts = MOCK_DOCUMENTS.filter((d) => d.type === "receipts" && (d.status === "Waiting" || d.status === "Draft")).length;
  const pendingDeliveries = MOCK_DOCUMENTS.filter((d) => d.type === "deliveries" && d.status !== "Done").length;
  const internalTransfers = MOCK_DOCUMENTS.filter((d) => d.type === "internal").length;

  // CSV export utility uses currently filtered products
  function exportCSV() {
    const header = ["SKU", "Name", "Category", "Warehouse", "Qty", "Status"];
    const rows = filteredProducts.map((r) => [r.sku, r.name, r.category, r.warehouse, r.qty, r.status]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="dashboard-root">
      <header className="dash-header">
        <div>
          <h1>StockMaster</h1>
          <p className="muted">Inventory dashboard — mock data</p>
        </div>

        <div className="header-actions">
          <input
            aria-label="Search products"
            className="search"
            placeholder="Search product or SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button className="btn" onClick={exportCSV} title="Export filtered products as CSV">
            Export CSV
          </button>
        </div>
      </header>

      <section className="kpi-row">
        <div className="kpi">
          <div className="kpi-title">Total Products (qty)</div>
          <div className="kpi-value">{totalProductsInStock}</div>
        </div>

        <div className="kpi">
          <div className="kpi-title">Low / Out</div>
          <div className="kpi-value">{lowStockCount}</div>
        </div>

        <div className="kpi">
          <div className="kpi-title">Pending Receipts</div>
          <div className="kpi-value">{pendingReceipts}</div>
        </div>

        <div className="kpi">
          <div className="kpi-title">Pending Deliveries</div>
          <div className="kpi-value">{pendingDeliveries}</div>
        </div>

        <div className="kpi">
          <div className="kpi-title">Internal Transfers</div>
          <div className="kpi-value">{internalTransfers}</div>
        </div>
      </section>

      <section className="controls">
        <select aria-label="Filter by document type" value={docType} onChange={(e) => setDocType(e.target.value)}>
          <option value="">All document types</option>
          <option value="receipts">Receipts</option>
          <option value="deliveries">Deliveries</option>
          <option value="internal">Internal Transfer</option>
          <option value="adjustments">Adjustments</option>
        </select>

        <select aria-label="Filter by document status" value={docStatus} onChange={(e) => setDocStatus(e.target.value)}>
          <option value="">All document status</option>
          <option value="Draft">Draft</option>
          <option value="Waiting">Waiting</option>
          <option value="Ready">Ready</option>
          <option value="Done">Done</option>
          <option value="Canceled">Canceled</option>
        </select>

        <select aria-label="Filter by warehouse" value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
          <option value="">All warehouses</option>
          <option value="WH-A">WH-A</option>
          <option value="WH-B">WH-B</option>
          <option value="WH-C">WH-C</option>
        </select>

        <select aria-label="Filter by product status" value={productStatus} onChange={(e) => setProductStatus(e.target.value)}>
          <option value="">All product status</option>
          <option value="Ready">Ready</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="Widgets">Widgets</option>
          <option value="Cables">Cables</option>
          <option value="Accessories">Accessories</option>
        </select>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, marginTop: 12 }}>
        <section className="table-section">
          <table className="product-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.sku}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.warehouse}</td>
                  <td className="qty">{p.qty}</td>
                  <td>{p.status}</td>
                  <td>
                    <button className="link-btn" onClick={() => alert(`Open product ${p.sku}`)}>
                      Open
                    </button>
                    <button className="link-btn" onClick={() => alert(`Transfer ${p.sku}`)}>
                      Transfer
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted">
                    No products match filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <aside style={{ alignSelf: "start" }}>
          <div className="kpi" style={{ marginBottom: 12 }}>
            <div className="kpi-title">Documents</div>
            <div style={{ marginTop: 8 }}>
              {filteredDocuments.length === 0 && <div className="muted">No documents</div>}
              <ul style={{ paddingLeft: 14, margin: 0 }}>
                {filteredDocuments.slice(0, 10).map((d) => (
                  <li key={d.id} style={{ marginBottom: 6 }}>
                    <strong>{d.id}</strong> — {d.type} — <em>{d.status}</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="kpi">
            <div className="kpi-title">Quick counts</div>
            <div style={{ marginTop: 8 }}>
              <div>Receipts: {MOCK_DOCUMENTS.filter((d) => d.type === "receipts").length}</div>
              <div>Deliveries: {MOCK_DOCUMENTS.filter((d) => d.type === "deliveries").length}</div>
              <div>Internal: {MOCK_DOCUMENTS.filter((d) => d.type === "internal").length}</div>
              <div>Adjustments: {MOCK_DOCUMENTS.filter((d) => d.type === "adjustments").length}</div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="dash-footer">Tip: replace mock data with API calls (GET /api/inventory/products, GET /api/documents).</footer>
    </div>
  );
}
