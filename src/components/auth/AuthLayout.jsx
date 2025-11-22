// src/components/auth/AuthLayout.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children, title }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f4f6f8",
      padding: 20
    }}>
      <div style={{
        width: 420,
        background: "white",
        padding: 24,
        borderRadius: 10,
        boxShadow: "0 6px 20px rgba(16,24,40,.08)"
      }}>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>StockMaster</h2>
          <p style={{ margin: 0, color: "#666", fontSize: 13 }}>{title || "Sign in to your account"}</p>
        </div>

        <div>{children}</div>

        <div style={{ marginTop: 12, fontSize: 13 }}>
          <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
