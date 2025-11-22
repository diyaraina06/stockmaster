// src/pages/Deliveries.jsx
import React, { useEffect, useState } from "react";
import { getDocuments, getProducts, createDocument, validateDocument } from "../state/store";

export default function Deliveries() {
  const [documents, setDocuments] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState(false);

  const [newDelivery, setNewDelivery] = useState({
    customer: "",
    warehouse: "WH-A",
    items: [], // { sku, qty }
  });

  useEffect(() => {
    reload();
    setProducts(getProducts());
  }, []);

  function reload() {
    const docs = getDocuments().filter(d => d.type === "deliveries");
    setDocuments(docs);
  }

  function startCreate() {
    setCreating(true);
    setNewDelivery({ customer: "", warehouse: "WH-A", items: [] });
  }

  function cancelCreate() {
    setCreating(false);
    setNewDelivery({ customer: "", warehouse: "WH-A", items: [] });
  }

  function addLine() {
    setNewDelivery(s => ({ ...s, items: [...s.items, { sku: "", qty: 1 }] }));
  }

  function updateLine(index, key, value) {
    setNewDelivery(s => {
      const items = s.items.slice();
      items[index] = { ...items[index], [key]: key === "qty" ? Number(value) : value };
      return { ...s, items };
    });
  }

  function removeLine(index) {
    setNewDelivery(s => {
      const items = s.items.slice();
      items.splice(index, 1);
      return { ...s, items };
    });
  }

  function saveDelivery() {
    if (!newDelivery.customer || !newDelivery.customer.trim()) return alert("Customer is required");
    if (!newDelivery.items.length) return alert("Add at least one product line");
    for (const it of newDelivery.items) {
      if (!it.sku) return alert("Select SKU for each line");
      if (!Number.isInteger(Number(it.qty)) || Number(it.qty) <= 0) return alert("Qty must be positive integer");
      // check available stock locally to give friendly error before creating
      const p = products.find(pp => pp.sku === it.sku && pp.warehouse === newDelivery.warehouse);
      const available = p ? Number(p.qty || 0) : 0;
      if (it.qty > available) return alert(`Insufficient stock for ${it.sku} in ${newDelivery.warehouse} (available ${available})`);
    }

    const doc = createDocument({
      type: "deliveries",
      status: "Draft",
      items: newDelivery.items.map(it => ({ sku: it.sku, qty: Number(it.qty) })),
      warehouse: newDelivery.warehouse,
      meta: { customer: newDelivery.customer },
    });

    alert(`Created delivery ${doc.id} (Draft). Validate to reduce stock.`);
    setCreating(false);
    reload();
  }

  function handleValidate(id) {
    try {
      validateDocument(id);
      alert(`Document ${id} validated — stock reduced.`);
      reload();
      setProducts(getProducts());
    } catch (e) {
      alert("Validation failed: " + (e.message || e));
    }
  }

  const visible = documents.filter(d => !filter || d.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Delivery Orders (Outgoing Stock)</h2>
          <p className="muted" style={{ margin: 0 }}>Create and validate deliveries. Validating decreases stock automatically (checks insufficiency).</p>
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

          <button onClick={startCreate} style={{ padding: "8px 12px", borderRadius: 6, background: "#ef4444", color: "white", border: "none" }}>
            New Delivery
          </button>
        </div>
      </div>

      {creating && (
        <section style={{ marginTop: 12, background: "white", padding: 12, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Create Delivery</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 10, marginBottom: 8 }}>
            <div>
              <label style={{ display: "block", fontSize: 13 }}>Customer *</label>
              <input value={newDelivery.customer} onChange={(e) => setNewDelivery(s => ({ ...s, customer: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13 }}>Warehouse</label>
              <select value={newDelivery.warehouse} onChange={(e) => setNewDelivery(s => ({ ...s, warehouse: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
                <option value="WH-A">WH-A</option>
                <option value="WH-B">WH-B</option>
                <option value="WH-C">WH-C</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <h4 style={{ margin: "6px 0" }}>Items</h4>
            {newDelivery.items.map((line, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <select value={line.sku} onChange={(e) => updateLine(idx, "sku", e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
                  <option value="">Select product SKU</option>
                  {products.map(p => <option key={p.sku} value={p.sku}>{p.sku} — {p.name} — ({p.warehouse})</option>)}
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
            <button onClick={saveDelivery} style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>Save delivery</button>
            <button onClick={cancelCreate} style={{ padding: "8px 12px" }}>Cancel</button>
          </div>
        </section>
      )}

      <section style={{ marginTop: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
              <th style={{ padding: 10 }}>Delivery ID</th>
              <th style={{ padding: 10 }}>Customer</th>
              <th style={{ padding: 10 }}>Warehouse</th>
              <th style={{ padding: 10 }}>Items</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {visible.map(d => (
              <tr key={d.id}>
                <td style={{ padding: 10 }}>{d.id}</td>
                <td style={{ padding: 10 }}>{d.meta?.customer || "—"}</td>
                <td style={{ padding: 10 }}>{d.warehouse || "—"}</td>
                <td style={{ padding: 10 }}>{d.items?.reduce((s, it) => s + Number(it.qty || 0), 0)}</td>
                <td style={{ padding: 10 }}>{d.status}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => alert(JSON.stringify(d, null, 2))} className="link-btn" style={{ marginRight: 8 }}>Open</button>
                  {d.status !== "Done" && (
                    <button onClick={() => { if (confirm(`Validate ${d.id}? This will decrease stock.`)) handleValidate(d.id); }} className="link-btn">Validate</button>
                  )}
                </td>
              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="muted" style={{ padding: 12 }}>No deliveries match filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
