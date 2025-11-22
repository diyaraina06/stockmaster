// src/pages/Adjustments.jsx
import React, { useState } from "react";

const MOCK_ADJUSTMENTS = [
  { id: "ADJ-001", reason: "Count variance", date: "2025-11-20", warehouse: "WH-A", itemsChanged: 2, status: "Done" },
  { id: "ADJ-002", reason: "Damage", date: "2025-11-21", warehouse: "WH-B", itemsChanged: 1, status: "Draft" },
];

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState(MOCK_ADJUSTMENTS);
  const [filter, setFilter] = useState("");

  function createAdjustment() {
    const newAdj = {
      id: `ADJ-${String(adjustments.length + 1).padStart(3, "0")}`,
      reason: "New adjustment",
      date: new Date().toISOString().slice(0, 10),
      warehouse: "WH-A",
      itemsChanged: 0,
      status: "Draft",
    };
    setAdjustments([newAdj, ...adjustments]);
    alert(`Created mock adjustment ${newAdj.id}`);
  }

  const visible = adjustments.filter(a => !filter || a.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Inventory Adjustment</h2>
          <p className="muted" style={{ margin: 0 }}>Record manual corrections to stock (placeholders for demo).</p>
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

          <button onClick={createAdjustment} style={{ padding: "8px 12px", borderRadius: 6, background: "#f59e0b", color: "white", border: "none" }}>
            New Adjustment
          </button>
        </div>
      </div>

      <section style={{ marginTop: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
              <th style={{ padding: 10 }}>Adjustment ID</th>
              <th style={{ padding: 10 }}>Reason</th>
              <th style={{ padding: 10 }}>Date</th>
              <th style={{ padding: 10 }}>Warehouse</th>
              <th style={{ padding: 10 }}>Items Changed</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(a => (
              <tr key={a.id}>
                <td style={{ padding: 10 }}>{a.id}</td>
                <td style={{ padding: 10 }}>{a.reason}</td>
                <td style={{ padding: 10 }}>{a.date}</td>
                <td style={{ padding: 10 }}>{a.warehouse}</td>
                <td style={{ padding: 10 }}>{a.itemsChanged}</td>
                <td style={{ padding: 10 }}>{a.status}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => alert(`Open ${a.id}`)} className="link-btn" style={{ marginRight: 8 }}>Open</button>
                  <button onClick={() => alert(`Apply ${a.id} (mock)`)} className="link-btn">Apply</button>
                </td>
              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="muted" style={{ padding: 12 }}>No adjustments match filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
