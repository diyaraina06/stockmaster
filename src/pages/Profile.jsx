// src/pages/Profile.jsx
import React from "react";

export default function Profile() {
    const email = localStorage.getItem("sm_user_email") || "user@example.com";
    const name = localStorage.getItem("sm_user_name") || "Your name";
    const role = localStorage.getItem("sm_user_role") === "warehouse_staff" ? "Warehouse Staff" : "Inventory Manager";

    function handleLogout() {
        localStorage.removeItem("sm_auth_token");
        localStorage.removeItem("sm_user_email");
        localStorage.removeItem("sm_user_role");
        // redirect to login
        window.location.href = "/login";
    }

    return (
        <div>
            <h2 style={{ margin: 0 }}>My Profile</h2>
            <p className="muted" style={{ margin: 0 }}>View and manage your profile information.</p>

            <section style={{ marginTop: 16, background: "white", padding: 14, borderRadius: 8 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{
                        width: 84, height: 84, borderRadius: 12, background: "#eef2ff",
                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
                    }}>
                        {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{name}</div>
                        <div style={{ color: "#6b7280", marginTop: 6 }}>{email}</div>
                        <div style={{ marginTop: 8 }}><strong>Role:</strong> {role}</div>
                    </div>
                </div>

                <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                    <button onClick={() => alert("Edit profile (mock)")} style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>Edit profile</button>
                    <button onClick={handleLogout} style={{ padding: "8px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: 6 }}>Logout</button>
                </div>
            </section>

            <section style={{ marginTop: 16 }}>
                <h3 style={{ marginTop: 0 }}>Account details</h3>
                <table style={{ width: "100%", background: "white", borderRadius: 8 }}>
                    <tbody>
                        <tr><td style={{ padding: 10, width: 160, color: "#6b7280" }}>Email</td><td style={{ padding: 10 }}>{email}</td></tr>
                        <tr><td style={{ padding: 10, color: "#6b7280" }}>Role</td><td style={{ padding: 10 }}>{role}</td></tr>
                        <tr><td style={{ padding: 10, color: "#6b7280" }}>Joined</td><td style={{ padding: 10 }}>{new Date().toLocaleDateString()}</td></tr>
                    </tbody>
                </table>
            </section>

            <footer style={{ marginTop: 18 }} className="muted">
                Problem statement (for reference): <code>/mnt/data/StockMaster.pdf</code>
            </footer>
        </div>
    );
}
