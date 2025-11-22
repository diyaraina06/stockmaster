// src/pages/Receipts.jsx
import React, { useState } from "react";

const MOCK_RECEIPTS = [
    { id: "RC-001", supplier: "Acme Supplies", expectedDate: "2025-11-25", status: "Waiting", items: 3, warehouse: "WH-A" },
    { id: "RC-002", supplier: "Global Parts", expectedDate: "2025-11-23", status: "Draft", items: 1, warehouse: "WH-B" },
    { id: "RC-003", supplier: "CableCo", expectedDate: "2025-11-22", status: "Ready", items: 2, warehouse: "WH-A" },
];

export default function Receipts() {
    const [receipts, setReceipts] = useState(MOCK_RECEIPTS);
    const [filter, setFilter] = useState("");

    function createReceipt() {
        // simple mock creation: push a draft receipt
        const newReceipt = {
            id: `RC-${String(receipts.length + 1).padStart(3, "0")}`,
            supplier: "New Supplier",
            expectedDate: new Date().toISOString().slice(0, 10),
            status: "Draft",
            items: 0,
            warehouse: "WH-A",
        };
        setReceipts([newReceipt, ...receipts]);
        alert(`Created mock receipt ${newReceipt.id}`);
    }

    const visible = receipts.filter(r => !filter || r.status === filter);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Receipts (Incoming Stock)</h2>
                    <p className="muted" style={{ margin: 0 }}>Create and manage incoming receipts — mock placeholders for demo.</p>
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

                    <button onClick={createReceipt} style={{ padding: "8px 12px", borderRadius: 6, background: "#10b981", color: "white", border: "none" }}>
                        New Receipt
                    </button>
                </div>
            </div>

            <section style={{ marginTop: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
                    <thead>
                        <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
                            <th style={{ padding: 10 }}>Receipt ID</th>
                            <th style={{ padding: 10 }}>Supplier</th>
                            <th style={{ padding: 10 }}>Expected</th>
                            <th style={{ padding: 10 }}>Warehouse</th>
                            <th style={{ padding: 10 }}>Items</th>
                            <th style={{ padding: 10 }}>Status</th>
                            <th style={{ padding: 10 }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visible.map(r => (
                            <tr key={r.id}>
                                <td style={{ padding: 10 }}>{r.id}</td>
                                <td style={{ padding: 10 }}>{r.supplier}</td>
                                <td style={{ padding: 10 }}>{r.expectedDate}</td>
                                <td style={{ padding: 10 }}>{r.warehouse}</td>
                                <td style={{ padding: 10 }}>{r.items}</td>
                                <td style={{ padding: 10 }}>{r.status}</td>
                                <td style={{ padding: 10 }}>
                                    <button onClick={() => alert(`Open ${r.id}`)} style={{ marginRight: 8 }} className="link-btn">Open</button>
                                    <button onClick={() => alert(`Receive ${r.id} (mock)`)} className="link-btn">Receive</button>
                                </td>
                            </tr>
                        ))}

                        {visible.length === 0 && (
                            <tr>
                                <td colSpan={7} className="muted" style={{ padding: 12 }}>No receipts match filters</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
