// src/pages/InternalTransfers.jsx
import React, { useEffect, useState } from "react";
import { getDocuments, getProducts, createDocument, validateDocument } from "../state/store";

export default function InternalTransfers() {
  const [documents, setDocuments] = useState([]);
  const [products, setProducts] = useState([]);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState("");

  const [form, setForm] = useState({
    fromWarehouse: "WH-A",
    toWarehouse: "WH-B",
    items: [], // { sku, qty }
  });

  useEffect(() => {
    reload();
    setProducts(getProducts());
  }, []);

  function reload() {
    const docs = getDocuments().filter(d => d.type === "internal");
    setDocuments(docs);
  }

  function startCreate() {
    setCreating(true);
    setForm({ fromWarehouse: "WH-A", toWarehouse: "WH-B", items: [] });
  }

  function cancelCreate() {
    setCreating(false);
    setForm({ fromWarehouse: "WH-A", toWarehouse: "WH-B", items: [] });
  }

  function addLine() {
    setForm(f => ({ ...f, items: [...f.items, { sku: "", qty: 1 }] }));
  }

  function updateLine(idx, key, val) {
    setForm(f => {
      const items = f.items.slice();
      items[idx] = { ...items[idx], [key]: key === "qty" ? Number(val) : val };
      return { ...f, items };
    });
  }

  function removeLine(idx) {
    setForm(f => {
      const items = f.items.slice();
      items.splice(idx, 1);
      return { ...f, items };
    });
  }

  function saveTransfer() {
    if (form.fromWarehouse === form.toWarehouse) return alert("Source and destination warehouses must differ");
    if (!form.items.length) return alert("Add at least one product line");
    for (const it of form.items) {
      if (!it.sku) return alert("Select SKU for each line");
      if (!Number.isInteger(Number(it.qty)) || Number(it.qty) <= 0) return alert("Qty must be positive integer");
      // check stock in source
      const p = products.find(pp => pp.sku === it.sku && pp.warehouse === form.fromWarehouse);
      const avail = p ? Number(p.qty || 0) : 0;
      if (it.qty > avail) return alert(`Insufficient stock for ${it.sku} in ${form.fromWarehouse} (available ${avail})`);
    }

    const doc = createDocument({
      type: "internal",
      status: "Draft",
      items: form.items.map(it => ({ sku: it.sku, qty: Number(it.qty) })),
      warehouse: form.fromWarehouse,
      meta: { toWarehouse: form.toWarehouse }
    });

    alert(`Created internal transfer ${doc.id} (Draft). Validate to move stock.`);
    setCreating(false);
    reload();
  }

  function handleValidate(id) {
    try {
      validateDocument(id);
      alert(`Transfer ${id} validated — stock moved.`);
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
          <h2 style={{ margin: 0 }}>Internal Transfers</h2>
          <p className="muted" style={{ margin: 0 }}>Move stock between warehouses. Validating will decrease source and increase destination.</p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
            <option value="">All status</option>
            <option value="Draft">Draft</option>
            <option value="Waiting">Waiting</option>
            <option value="Ready">Ready</option>
            <option value="Done">Done</option>
            <option value="Canceled">Canceled</option>
          </select>

          <button onClick={startCreate} style={{ padding: "8px 12px", borderRadius: 6, background: "#8b5cf6", color: "white", border: "none" }}>
            New Transfer
          </button>
        </div>
      </div>

      {creating && (
        <section style={{ marginTop: 12, background: "white", padding: 12, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Create Internal Transfer</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
            <div>
              <label style={{ display: "block", fontSize: 13 }}>From (warehouse)</label>
              <select value={form.fromWarehouse} onChange={e => setForm(f => ({ ...f, fromWarehouse: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
                <option value="WH-A">WH-A</option>
                <option value="WH-B">WH-B</option>
                <option value="WH-C">WH-C</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13 }}>To (warehouse)</label>
              <select value={form.toWarehouse} onChange={e => setForm(f => ({ ...f, toWarehouse: e.target.value }))} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
                <option value="WH-A">WH-A</option>
                <option value="WH-B">WH-B</option>
                <option value="WH-C">WH-C</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <h4 style={{ margin: "6px 0" }}>Items</h4>
            {form.items.map((line, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <select value={line.sku} onChange={e => updateLine(idx, "sku", e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
                  <option value="">Select product SKU</option>
                  {products.map(p => <option key={p.sku} value={p.sku}>{p.sku} — {p.name} — ({p.warehouse})</option>)}
                </select>
                <input value={line.qty} type="number" min="1" onChange={e => updateLine(idx, "qty", e.target.value)} style={{ width: 100, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
                <button type="button" onClick={() => removeLine(idx)} className="link-btn">Remove</button>
              </div>
            ))}

            <div>
              <button onClick={addLine} style={{ padding: "6px 10px", borderRadius: 6 }}>Add line</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={saveTransfer} style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>Save transfer</button>
            <button onClick={cancelCreate} style={{ padding: "8px 12px" }}>Cancel</button>
          </div>
        </section>
      )}

      <section style={{ marginTop: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
              <th style={{ padding: 10 }}>Transfer ID</th>
              <th style={{ padding: 10 }}>From → To</th>
              <th style={{ padding: 10 }}>Items</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {visible.map(d => (
              <tr key={d.id}>
                <td style={{ padding: 10 }}>{d.id}</td>
                <td style={{ padding: 10 }}>{d.warehouse} → {d.meta?.toWarehouse || "—"}</td>
                <td style={{ padding: 10 }}>{d.items?.reduce((s, it) => s + Number(it.qty || 0), 0)}</td>
                <td style={{ padding: 10 }}>{d.status}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => alert(JSON.stringify(d, null, 2))} className="link-btn" style={{ marginRight: 8 }}>Open</button>
                  {d.status !== "Done" && (
                    <button onClick={() => { if (confirm(`Validate ${d.id}? This will move stock.`)) handleValidate(d.id); }} className="link-btn">Validate</button>
                  )}
                </td>
              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="muted" style={{ padding: 12 }}>No transfers match filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
