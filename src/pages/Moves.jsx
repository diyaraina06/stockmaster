// src/pages/Moves.jsx
import React, { useState } from "react";

const MOCK_MOVES = [
    { id: "MV-001", product: "Blue Widget (PRD-001)", from: "WH-A", to: "WH-B", qty: 20, date: "2025-11-18", user: "Sahil" },
    { id: "MV-002", product: "Power Adapter (PRD-004)", from: "WH-C", to: "WH-A", qty: 5, date: "2025-11-19", user: "Asha" },
    { id: "MV-003", product: "Red Widget (PRD-002)", from: "WH-B", to: "WH-A", qty: 2, date: "2025-11-20", user: "Ravi" },
];

export default function Moves() {
    const [moves] = useState(MOCK_MOVES);
    const [q, setQ] = useState("");
    const [warehouseFilter, setWarehouseFilter] = useState("");

    const visible = moves.filter(m => {
        if (q && !(m.id.toLowerCase().includes(q.toLowerCase()) || m.product.toLowerCase().includes(q.toLowerCase()))) return false;
        if (warehouseFilter && !(m.from === warehouseFilter || m.to === warehouseFilter)) return false;
        return true;
    });

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Move History</h2>
                    <p className="muted" style={{ margin: 0 }}>Track internal transfers and move history (mock data).</p>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                        placeholder="Search by id or product..."
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", minWidth: 220 }}
                    />
                    <select value={warehouseFilter} onChange={e => setWarehouseFilter(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
                        <option value="">All warehouses</option>
                        <option value="WH-A">WH-A</option>
                        <option value="WH-B">WH-B</option>
                        <option value="WH-C">WH-C</option>
                    </select>
                </div>
            </div>

            <section style={{ marginTop: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
                    <thead>
                        <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
                            <th style={{ padding: 10 }}>Move ID</th>
                            <th style={{ padding: 10 }}>Product</th>
                            <th style={{ padding: 10 }}>From</th>
                            <th style={{ padding: 10 }}>To</th>
                            <th style={{ padding: 10 }}>Qty</th>
                            <th style={{ padding: 10 }}>Date</th>
                            <th style={{ padding: 10 }}>By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map(m => (
                            <tr key={m.id}>
                                <td style={{ padding: 10 }}>{m.id}</td>
                                <td style={{ padding: 10 }}>{m.product}</td>
                                <td style={{ padding: 10 }}>{m.from}</td>
                                <td style={{ padding: 10 }}>{m.to}</td>
                                <td style={{ padding: 10 }}>{m.qty}</td>
                                <td style={{ padding: 10 }}>{m.date}</td>
                                <td style={{ padding: 10 }}>{m.user}</td>
                            </tr>
                        ))}

                        {visible.length === 0 && (
                            <tr>
                                <td colSpan={7} className="muted" style={{ padding: 12 }}>No moves match filters</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
