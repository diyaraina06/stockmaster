// src/pages/Settings.jsx
import React, { useState } from "react";

const MOCK_WAREHOUSES = [
  { id: "WH-A", name: "Main Warehouse", location: "Bengaluru" },
  { id: "WH-B", name: "Secondary Storage", location: "Delhi" },
  { id: "WH-C", name: "Returns Hub", location: "Mumbai" },
];

export default function Settings() {
  const [warehouses, setWarehouses] = useState(MOCK_WAREHOUSES);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  function addWarehouse() {
    if (!name || !location) {
      alert("Enter both name and location");
      return;
    }
    const newId = `WH-${String(warehouses.length + 1)}`;
    const newWH = { id: newId, name, location };
    setWarehouses([...warehouses, newWH]);
    setName("");
    setLocation("");
    alert(`Added warehouse ${newId}`);
  }

  return (
    <div>
      <h2 style={{ margin: 0 }}>Warehouse Settings</h2>
      <p className="muted" style={{ margin: 0 }}>
        Manage warehouse locations — mock settings page.
      </p>

      <section style={{ marginTop: 16, background: "white", padding: 12, borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Add New Warehouse</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            placeholder="Warehouse name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
          />
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
          />
          <button
            onClick={addWarehouse}
            style={{ padding: "8px 12px", borderRadius: 6, background: "#2563eb", color: "white", border: "none" }}
          >
            Add
          </button>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f3f4f6" }}>
              <th style={{ padding: 10 }}>Warehouse ID</th>
              <th style={{ padding: 10 }}>Name</th>
              <th style={{ padding: 10 }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.id}>
                <td style={{ padding: 10 }}>{w.id}</td>
                <td style={{ padding: 10 }}>{w.name}</td>
                <td style={{ padding: 10 }}>{w.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
