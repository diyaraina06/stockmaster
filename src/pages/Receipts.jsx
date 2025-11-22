// src/pages/Receipts.jsx
import React, { useEffect, useState } from "react";
import { getDocuments, getProducts, createDocument, validateDocument } from "../state/store";

export default function Receipts() {
  const [documents, setDocuments] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState(false);

  // New receipt form state
  const [newReceipt, setNewReceipt] = useState({
    supplier: "",
    warehouse: "WH-A",
    items: [], // { sku, qty }
  });

  useEffect(() => {
    reload();
    setProducts(getProducts());
  }, []);

  function reload() {
    const docs = getDocuments().filter(d => d.type === "receipts");
    setDocuments(docs);
  }

  function startCreate() {
    setCreating(true);
    setNewReceipt({ supplier: "", warehouse: "WH-A", items: [] });
  }

  function cancelCreate() {
    setCreating(false);
    setNewReceipt({ supplier: "", warehouse: "WH-A", items: [] });
  }

  function addLine() {
    setNewReceipt((s) => ({ ...s, items: [...s.items, { sku: "", qty: 1 }] }));
  }

  function updateLine(index, key, value) {
    setNewReceipt((s) => {
      const items = s.items.slice();
      items[index] = { ...items[index], [key]: key === "qty" ? Number(value) : value };
      return { ...s, items };
    });
  }

  function removeLine(index) {
    setNewReceipt((s) => {
      const items = s.items.slice();
      items.splice(index, 1);
      return { ...s, items };
    });
  }

  function saveReceipt() {
    // validation
    if (!newReceipt.supplier || !newReceipt.supplier.trim()) return alert("Supplier is required");
    if (!newReceipt.items.length) return alert("Add at least one product line");
    for (const it of newReceipt.items) {
      if (!it.sku) return alert("Select SKU for each line");
      if (!Number.isInteger(Number(it.qty)) || Number(it.qty) <= 0) return alert("Qty must be positive integer");
    }

    // create document
    const doc = createDocument({
      type: "receipts",
      status: "Draft",
      items: newReceipt.items.map((it) => ({ sku: it.sku, qty: Number(it.qty) })),
      warehouse: newReceipt.warehouse,
      meta: { supplier: newReceipt.supplier },
    });

    alert(`Created receipt ${doc.id} (Draft). You can now Validate it to increase stock.`);
    setCreating(false);
    reload();
  }

  function handleValidate(id) {
    try {
      validateDocument(id);
      alert(`Document ${id} validated — stock updated.`);
      reload();
      setProducts(getProducts()); // refresh products list/qty shown elsewhere
    } catch (e) {
      alert("Validation failed: " + (e.message || e));
    }
  }

  const visible = documents.filter((r) => !filter || r.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Receipts (Incoming Stock)</h2>
          <p className="muted" style={{ margin: 0 }}>Create and validate incoming receipts. Validating increases stock automatically.</p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
            <option value="">All status</option>
            <option value="Draft">Draft</option>
            <option value="Waiting">Waiting</option>
            <option value="Ready">Ready</option>
            <option value="Done">Done</option>
            <option value="Canceled">Canceled</option>
          </select>

          <button onClick={startCreate} style={{ padding: "8px 12px", borderRadius: 6, background: "#10b981", color: "white", border: "none" }}>
            New Receipt
          </button>
        </div>
      </div>

      {/* Create form */}
      {creating && (
        <section style={{ marginTop: 12, background: "white", padding: 12, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Create Receipt</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 10, marginBottom: 8 }}>
            <div>
              <label style={{ display: "block", fontSize: 13 }}>Supplier *</label>
              <input value={newReceipt.supplier} onChange={(e) => setNewReceipt((s) => ({ ...s, supplier: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13 }}>Warehouse</label>
              <select value={newReceipt.warehouse} onChange={(e) => setNewReceipt((s) => ({ ...s, warehouse: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
                <option value="WH-A">WH-A</option>
                <option value="WH-B">WH-B</option>
                <option value="WH-C">WH-C</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <h4 style={{ margin: "6px 0" }}>Items</h4>
            {newReceipt.items.map((line, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <select value={line.sku} onChange={(e) => updateLine(idx, "sku", e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
                  <option value="">Select product SKU</option>
                  {products.map((p) => <option key={p.sku} value={p.sku}>{p.sku} — {p.name}</option>)}
                </select>
                <input value={line.qty} type="number" min="1" onChange={(e) => updateLine(idx, "qty", e.target.value)} style={{ width: 100, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
                <button type="button" onClick={() => removeLine(idx)} className="link-btn">Remove</button>
              </div>
            ))}

            <div>
              <button onClick={addLine} style={{ padding: "6px 10px", borderRadius: 6 }}>Add line</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={saveReceipt} style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>Save receipt</button>
            <button onClick={cancelCreate} style={{ padding: "8px 12px" }}>Cancel</button>
          </div>
        </section>
      )}

      <section style={{ marginTop: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
              <th style={{ padding: 10 }}>Receipt ID</th>
              <th style={{ padding: 10 }}>Supplier</th>
              <th style={{ padding: 10 }}>Expected / Warehouse</th>
              <th style={{ padding: 10 }}>Items</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 10 }}>{r.id}</td>
                <td style={{ padding: 10 }}>{r.meta?.supplier || "—"}</td>
                <td style={{ padding: 10 }}>{r.warehouse || "—"}</td>
                <td style={{ padding: 10 }}>{r.items?.reduce((s, it) => s + Number(it.qty || 0), 0)}</td>
                <td style={{ padding: 10 }}>{r.status}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => alert(JSON.stringify(r, null, 2))} className="link-btn" style={{ marginRight: 8 }}>Open</button>
                  {r.status !== "Done" && (
                    <button onClick={() => { if (confirm(`Validate ${r.id}? This will update stock.`)) handleValidate(r.id); }} className="link-btn">Validate</button>
                  )}
                </td>
              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="muted" style={{ padding: 12 }}>No receipts match filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
