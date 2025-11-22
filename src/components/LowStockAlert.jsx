// src/components/LowStockAlert.jsx
import React from "react";
import { getProducts } from "../state/store";

export default function LowStockAlert({ onOpen }) {
  const products = getProducts();
  const low = products.filter(p => Number(p.qty || 0) <= Number(p.reorder || 0));
  if (low.length === 0) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={() => onOpen && onOpen()}
        title="Low stock items"
        style={{
          display: "inline-flex",
          gap: 8,
          alignItems: "center",
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#fff",
          cursor: "pointer"
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zM18.7 16l-1.2-1.2C17 13.7 17 12.9 17 12V9c0-3.9-2.4-7.2-6-8V0H9v1c-3.6.8-6 4.1-6 8v3c0 .9 0 1.7.5 2.8L2 16v1h20v-1z" fill="#f59e0b"/></svg>
        <strong style={{ color: "#b91c1c" }}>{low.length}</strong>
        <span style={{ fontSize: 13, color: "#374151" }}>low</span>
      </button>
    </div>
  );
}
