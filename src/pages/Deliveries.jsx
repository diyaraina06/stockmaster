// src/pages/Deliveries.jsx
import React, { useState } from "react";

const MOCK_DELIVERIES = [
    { id: "DL-001", customer: "Beta Retail", date: "2025-11-24", status: "Waiting", items: 2, warehouse: "WH-A" },
    { id: "DL-002", customer: "ShopPlus", date: "2025-11-23", status: "Draft", items: 1, warehouse: "WH-B" },
    { id: "DL-003", customer: "ElectroMart", date: "2025-11-22", status: "Ready", items: 4, warehouse: "WH-C" },
];

export default function Deliveries() {
    const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);
    const [filter, setFilter] = useState("");

    function createDelivery() {
        const newDelivery = {
            id: `DL-${String(deliveries.length + 1).padStart(3, "0")}`,
            customer: "New Customer",
            date: new Date().toISOString().slice(0, 10),
            status: "Draft",
            items: 0,
            warehouse: "WH-A",
        };
        setDeliveries([newDelivery, ...deliveries]);
        alert(`Created mock delivery ${newDelivery.id}`);
    }

    const visible = deliveries.filter(d => !filter || d.status === filter);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Delivery Orders (Outgoing Stock)</h2>
                    <p className="muted" style={{ margin: 0 }}>Create and manage outgoing deliveries — placeholders for demo.</p>
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

                    <button onClick={createDelivery} style={{ padding: "8px 12px", borderRadius: 6, background: "#ef4444", color: "white", border: "none" }}>
                        New Delivery
                    </button>
                </div>
            </div>

            <section style={{ marginTop: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
                    <thead>
                        <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
                            <th style={{ padding: 10 }}>Delivery ID</th>
                            <th style={{ padding: 10 }}>Customer</th>
                            <th style={{ padding: 10 }}>Date</th>
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
                                <td style={{ padding: 10 }}>{d.customer}</td>
                                <td style={{ padding: 10 }}>{d.date}</td>
                                <td style={{ padding: 10 }}>{d.warehouse}</td>
                                <td style={{ padding: 10 }}>{d.items}</td>
                                <td style={{ padding: 10 }}>{d.status}</td>
                                <td style={{ padding: 10 }}>
                                    <button onClick={() => alert(`Open ${d.id}`)} style={{ marginRight: 8 }} className="link-btn">Open</button>
                                    <button onClick={() => alert(`Ship ${d.id} (mock)`)} className="link-btn">Ship</button>
                                </td>
                            </tr>
                        ))}

                        {visible.length === 0 && (
                            <tr>
                                <td colSpan={7} className="muted" style={{ padding: 12 }}>No deliveries match filters</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
