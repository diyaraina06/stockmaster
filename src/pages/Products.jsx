// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts, addProduct, updateProduct, findProduct } from "../state/store";

export default function Products() {
    const location = useLocation();

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

    // Search + quick filters
    const [search, setSearch] = useState("");
    const [filterMode, setFilterMode] = useState(""); // "", "low", "out"

    // Load initial data
    useEffect(() => {
        setProducts(getProducts());
    }, []);

    // URL preset (?filter=low)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("filter") === "low") {
            setFilterMode("low");
        }
    }, [location.search]);

    function reload() {
        setProducts(getProducts());
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
        setError("");
        setSuccess("");
    }

    function validate(form) {
        if (!form.name.trim()) return "Name is required";
        if (!form.sku.trim()) return "SKU is required";
        if (!form.uom.trim()) return "Unit of measure required";
        if (form.qty && (!Number.isInteger(Number(form.qty)) || Number(form.qty) < 0))
            return "Initial stock must be a non-negative integer";
        return null;
    }

    function handleCreate(e) {
        e.preventDefault();
        const err = validate(form);
        if (err) return setError(err);

        if (findProduct(form.sku)) {
            return setError("SKU already exists");
        }

        addProduct({
            sku: form.sku.trim(),
            name: form.name.trim(),
            category: form.category.trim() || "Uncategorized",
            uom: form.uom.trim(),
            qty: form.qty ? Number(form.qty) : 0,
            warehouse: form.warehouse,
            reorder: form.reorder ? Number(form.reorder) : 0
        });

        setSuccess("Product created");
        setForm({
            name: "",
            sku: "",
            category: "",
            uom: "",
            qty: "",
            warehouse: "WH-A",
            reorder: ""
        });

        reload();
    }

    function handleAdjust(sku) {
        const p = products.find((x) => x.sku === sku);
        const newQty = prompt(
            `Enter new qty for ${sku} (current: ${p.qty})`,
            p.qty
        );
        if (newQty === null) return;
        if (!Number.isInteger(Number(newQty)) || Number(newQty) < 0)
            return alert("Enter non-negative integer");

        updateProduct(sku, { qty: Number(newQty) });
        reload();
    }

    // Compute visible list
    const visible = products.filter((p) => {
        const q = search.trim().toLowerCase();

        // Smart search
        if (q) {
            const hit =
                p.sku.toLowerCase().includes(q) ||
                p.name.toLowerCase().includes(q) ||
                (p.category || "").toLowerCase().includes(q);

            if (!hit) return false;
        }

        // Quick filter
        if (filterMode === "low") {
            if (!(Number(p.qty) <= Number(p.reorder))) return false;
        }

        if (filterMode === "out") {
            if (Number(p.qty) !== 0) return false;
        }

        return true;
    });

    return (
        <div>
            <h2 style={{ margin: 0 }}>Products</h2>
            <p className="muted" style={{ margin: 0 }}>
                Manage product master, stock per warehouse & reorder rules.
            </p>

            {/* Search + quick filters */}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <input
                    placeholder="Search SKU, name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        flex: 1,
                        minWidth: 260
                    }}
                />

                <button
                    onClick={() => setFilterMode("low")}
                    style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #fca5a5",
                        background: filterMode === "low" ? "#ffe4e6" : "#fff"
                    }}
                >
                    Low stock
                </button>

                <button
                    onClick={() => setFilterMode("out")}
                    style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        background: filterMode === "out" ? "#f1f5f9" : "#fff"
                    }}
                >
                    Out of stock
                </button>

                <button
                    onClick={() => {
                        setSearch("");
                        setFilterMode("");
                    }}
                    style={{
                        padding: "6px 10px",
                        borderRadius: 8
                    }}
                >
                    Clear
                </button>
            </div>

            {/* Create product */}
            <section style={{ marginTop: 20, background: "white", padding: 14, borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Create Product</h3>
                <form
                    onSubmit={handleCreate}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10
                    }}
                >
                    <div>
                        <label>Name *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label>SKU *</label>
                        <input
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label>Category</label>
                        <input
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label>Unit of Measure *</label>
                        <input
                            name="uom"
                            value={form.uom}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label>Initial Stock</label>
                        <input
                            name="qty"
                            value={form.qty}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label>Warehouse</label>
                        <select
                            name="warehouse"
                            value={form.warehouse}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="WH-A">WH-A</option>
                            <option value="WH-B">WH-B</option>
                            <option value="WH-C">WH-C</option>
                        </select>
                    </div>

                    <div>
                        <label>Reorder Qty</label>
                        <input
                            name="reorder"
                            value={form.reorder}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
                        <button
                            type="submit"
                            style={{
                                padding: "8px 12px",
                                background: "#2563eb",
                                color: "white",
                                borderRadius: 6,
                                border: "none"
                            }}
                        >
                            Create
                        </button>
                        {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
                        {success && <div style={{ color: "#16a34a" }}>{success}</div>}
                    </div>
                </form>
            </section>

            {/* Table */}
            <section style={{ marginTop: 20 }} className="table-wrapper">
                <table style={tableStyle}>
                    <thead>
                        <tr style={theadRow}>
                            <th style={th}>SKU</th>
                            <th style={th}>Name</th>
                            <th style={th}>Category</th>
                            <th style={th}>UoM</th>
                            <th style={th}>Warehouse</th>
                            <th style={th}>Qty</th>
                            <th style={th}>Reorder</th>
                            <th style={th}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visible.map((p) => {
                            const low = Number(p.qty) <= Number(p.reorder);
                            const out = Number(p.qty) === 0;

                            return (
                                <tr
                                    key={p.sku}
                                    style={{
                                        background: out
                                            ? "#fff1f2"
                                            : low
                                                ? "#fff7ed"
                                                : "white"
                                    }}
                                >
                                    <td style={td}>{p.sku}</td>
                                    <td style={td}>{p.name}</td>
                                    <td style={td}>{p.category}</td>
                                    <td style={td}>{p.uom}</td>
                                    <td style={td}>{p.warehouse}</td>
                                    <td style={{ ...td, fontWeight: 600 }}>{p.qty}</td>
                                    <td style={td}>{p.reorder}</td>
                                    <td style={td}>
                                        <button
                                            onClick={() => handleAdjust(p.sku)}
                                            className="link-btn"
                                        >
                                            Adjust qty
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {visible.length === 0 && (
                            <tr>
                                <td colSpan="8" style={{ padding: 14, color: "#9ca3af" }}>
                                    No matching products
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd"
};

const tableStyle = {
    width: "100%",
    background: "white",
    borderRadius: 8,
    overflow: "hidden",
    borderCollapse: "collapse"
};

const theadRow = {
    background: "#f3f4f6",
    textAlign: "left"
};

const th = {
    padding: 10,
    fontWeight: 600,
    fontSize: 14
};

const td = {
    padding: 10,
    borderTop: "1px solid #f1f5f9"
};
