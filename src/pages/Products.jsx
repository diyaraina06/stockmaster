// src/pages/Products.jsx
import React from "react";

export default function Products() {
    return (
        <div>
            <h2>Products</h2>
            <p className="muted">Create/update products, view stock per warehouse, categories, reordering rules (placeholders).</p>

            <section style={{ marginTop: 16, background: "white", padding: 12, borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>Quick actions</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={{ padding: "8px 12px", borderRadius: 6 }}>New product</button>
                    <button style={{ padding: "8px 12px", borderRadius: 6 }}>Import CSV</button>
                    <button style={{ padding: "8px 12px", borderRadius: 6 }}>Manage categories</button>
                </div>
            </section>

            <section style={{ marginTop: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
                    <thead>
                        <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
                            <th style={{ padding: 10 }}>SKU</th>
                            <th style={{ padding: 10 }}>Name</th>
                            <th style={{ padding: 10 }}>Category</th>
                            <th style={{ padding: 10 }}>Warehouse</th>
                            <th style={{ padding: 10 }}>Qty</th>
                            <th style={{ padding: 10 }}>Reorder</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: 10 }}>PRD-001</td>
                            <td style={{ padding: 10 }}>Blue Widget</td>
                            <td style={{ padding: 10 }}>Widgets</td>
                            <td style={{ padding: 10 }}>WH-A</td>
                            <td style={{ padding: 10 }}>120</td>
                            <td style={{ padding: 10 }}>50</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 10 }}>PRD-002</td>
                            <td style={{ padding: 10 }}>Red Widget</td>
                            <td style={{ padding: 10 }}>Widgets</td>
                            <td style={{ padding: 10 }}>WH-B</td>
                            <td style={{ padding: 10 }}>4</td>
                            <td style={{ padding: 10 }}>20</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}
