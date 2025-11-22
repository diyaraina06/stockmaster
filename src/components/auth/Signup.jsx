// src/components/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { loginMock } from "../../utils/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("inventory_manager"); // default role
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return alert("Please enter an email");
    // Mock: create account and log in immediately
    // store role so dashboard can later show role-specific UI
    loginMock(email, role);
    // Optionally store name
    localStorage.setItem("sm_user_name", name || "");
    navigate("/dashboard", { replace: true });
  }

  return (
    <AuthLayout title="Create an account">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 13 }}>Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            placeholder="Your full name"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 13 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 13 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            placeholder="Choose a password"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
            <option value="inventory_manager">Inventory Manager</option>
            <option value="warehouse_staff">Warehouse Staff</option>
          </select>
        </div>

        <div>
          <button type="submit" style={{ padding: "8px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>
            Create account
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
