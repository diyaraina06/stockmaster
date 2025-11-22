// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { getProducts, addProduct, updateProduct, findProduct } from "../state/store";

function validateProductInput({ name, sku, uom, qty }) {
  if (!name || !name.trim()) return "Name is required";
  if (!sku || !sku.trim()) return "SKU / Code is required";
  if (!uom || !uom.trim()) return "Unit of Measure is required";
  if (qty === "" || qty === null || qty === undefined) return null; // qty optional
  if (!Number.isInteger(Number(qty)) || Number(qty) < 0) return "Initial stock must be a non-negative integer";
  return null;
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    uom: "",
    qty: "",
    warehouse: "WH-A",
    reorder: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // load products from store on mount
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  function reload() {
    setProducts(getProducts());
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setError("");
    setSuccess("");
  }

  function handleCreate(e) {
    e.preventDefault();
    const err = validateProductInput(form);
    if (err) {
      setError(err);
      return;
    }

    // check SKU uniqueness
    try {
      if (findProduct(form.sku)) {
        setError("SKU already exists. Use a unique SKU.");
        return;
      }
    } catch (e) {
      // continue
    }

    try {
      addProduct({
        sku: form.sku.trim(),
        name: form.name.trim(),
        category: form.category.trim() || "Uncategorized",
        uom: form.uom.trim(),
        qty: form.qty === "" ? 0 : Number(form.qty),
        warehouse: form.warehouse || "WH-A",
        reorder: form.reorder ? Number(form.reorder) : 0
      });
      setSuccess("Product created");
      setForm({ name: "", sku: "", category: "", uom: "", qty: "", warehouse: "WH-A", reorder: "" });
      reload();
    } catch (err) {
      setError(err.message || "Failed to create product");
    }
  }

  function handleAdjust(sku) {
    const current = products.find(p => p.sku === sku);
    const val = prompt(`Enter new qty for ${sku} (current ${current.qty}):`, String(current.qty));
    if (val === null) return;
    if (!Number.isInteger(Number(val)) || Number(val) < 0) {
      alert("Quantity must be a non-negative integer");
      return;
    }
    try {
      updateProduct(sku, { qty: Number(val) });
      reload();
    } catch (e) {
      alert(e.message || "Could not update");
    }
  }

  return (
    <div>
      <h2 style={{ margin: 0 }}>Products</h2>
      <p className="muted" style={{ margin: 0 }}>
        Create/update products, view stock per warehouse, categories, and reordering rules.
      </p>

      <section style={{ marginTop: 16, background: "white", padding: 12, borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Create product</h3>
        <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontSize: 13 }}>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13 }}>SKU / Code *</label>
            <input name="sku" value={form.sku} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13 }}>Category</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="e.g., Widgets" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13 }}>Unit of Measure *</label>
            <input name="uom" value={form.uom} onChange={handleChange} placeholder="pcs, kg, m" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13 }}>Initial stock (optional)</label>
            <input name="qty" value={form.qty} onChange={handleChange} placeholder="0" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13 }}>Warehouse</label>
            <select name="warehouse" value={form.warehouse} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
              <option value="WH-A">WH-A</option>
              <option value="WH-B">WH-B</option>
              <option value="WH-C">WH-C</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13 }}>Reorder Qty</label>
            <input name="reorder" value={form.reorder} onChange={handleChange} placeholder="e.g., 10" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "center" }}>
            <button type="submit" style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>Create product</button>
            <button type="button" onClick={() => { setForm({ name: "", sku: "", category: "", uom: "", qty: "", warehouse: "WH-A", reorder: "" }); setError(""); setSuccess(""); }} style={{ padding: "8px 12px" }}>Reset</button>
            {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
            {success && <div style={{ color: "#16a34a" }}>{success}</div>}
          </div>
        </form>
      </section>

      <section style={{ marginTop: 16 }} className="table-wrapper">
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
              <th style={{ padding: 10 }}>SKU</th>
              <th style={{ padding: 10 }}>Name</th>
              <th style={{ padding: 10 }}>Category</th>
              <th style={{ padding: 10 }}>UoM</th>
              <th style={{ padding: 10 }}>Warehouse</th>
              <th style={{ padding: 10 }}>Qty</th>
              <th style={{ padding: 10 }}>Reorder</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.sku}>
                <td style={{ padding: 10 }}>{p.sku}</td>
                <td style={{ padding: 10 }}>{p.name}</td>
                <td style={{ padding: 10 }}>{p.category}</td>
                <td style={{ padding: 10 }}>{p.uom}</td>
                <td style={{ padding: 10 }}>{p.warehouse}</td>
                <td style={{ padding: 10, fontWeight: 700 }}>{p.qty}</td>
                <td style={{ padding: 10 }}>{p.reorder}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => handleAdjust(p.sku)} className="link-btn" style={{ marginRight: 8 }}>Adjust qty</button>
                  <button onClick={() => { const newName = prompt('New name', p.name); if (newName) { try { updateProduct(p.sku, { name: newName }); reload(); } catch(e){ alert(e.message) } } }} className="link-btn">Rename</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="muted" style={{ padding: 12 }}>No products</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
