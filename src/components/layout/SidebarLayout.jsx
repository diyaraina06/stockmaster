// src/components/layout/SidebarLayout.jsx
// Sidebar layout + placeholder routes for StockMaster navigation
// Reference spec: /mnt/data/StockMaster.pdf

// src/components/layout/SidebarLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import LowStockAlert from "../LowStockAlert";
import { getUserRole } from "../../utils/auth"; // returns stored role or null

const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/products", label: "Products" },
    { to: "/receipts", label: "Receipts" },
    { to: "/deliveries", label: "Delivery Orders" },
    { to: "/internal", label: "Internal Transfers" },
    { to: "/adjustments", label: "Inventory Adjustment" },
    { to: "/moves", label: "Move History" },
    { to: "/settings", label: "Settings" },
    { to: "/profile", label: "My Profile" },
    { to: "/logout", label: "Logout" },
];

function SidebarLink({ to, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
            }
        >
            {label}
        </NavLink>
    );
}

export default function SidebarLayout() {
    const rawRole = getUserRole();
    const roleLabel =
        rawRole === "warehouse_staff" ? "Warehouse Staff" : "Inventory Manager";

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <aside style={styles.sidebar}>
                <div style={styles.brand}>
                    <h3 style={{ margin: 0 }}>StockMaster</h3>
                </div>

                <nav style={{ padding: "8px 12px" }} aria-label="Primary">
                    <div style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>
                        Main
                    </div>
                    <SidebarLink to="/dashboard" label="Dashboard" />

                    <div style={{ margin: "12px 0 8px", fontSize: 12, color: "#6b7280" }}>
                        Products
                    </div>
                    <SidebarLink to="/products" label="Products" />

                    <div style={{ margin: "12px 0 8px", fontSize: 12, color: "#6b7280" }}>
                        Operations
                    </div>
                    <SidebarLink to="/receipts" label="Receipts" />
                    <SidebarLink to="/deliveries" label="Delivery Orders" />
                    <SidebarLink to="/internal" label="Internal Transfers" />
                    <SidebarLink to="/adjustments" label="Inventory Adjustment" />
                    <SidebarLink to="/moves" label="Move History" />

                    <div style={{ margin: "12px 0 8px", fontSize: 12, color: "#6b7280" }}>
                        Settings
                    </div>
                    <SidebarLink to="/settings" label="Warehouse" />

                    <div style={{ margin: "18px 0 6px", fontSize: 12, color: "#6b7280" }}>
                        Profile
                    </div>
                    <SidebarLink to="/profile" label="My Profile" />
                    <SidebarLink to="/logout" label="Logout" />
                </nav>

                <div style={{ marginTop: "auto", padding: 12, fontSize: 12, color: "#9ca3af" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div>Role: <strong>{roleLabel}</strong></div>
                    </div>
                </div>
            </aside>

            <main style={styles.main}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                        {/* Optionally show a page title or breadcrumb here */}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Low stock alert button — opens products/filters when clicked */}
                        <LowStockAlert onOpen={() => { window.location.href = "/products?filter=low"; }} />

                        {/* Small role display for quick access on wide screens */}
                        <div style={{ fontSize: 13, color: "#374151" }}>
                            <span style={{ color: "#6b7280", marginRight: 6 }}>Signed in as</span>
                            <strong>{roleLabel}</strong>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1100, margin: "18px auto", width: "100%" }}>
                    {/* Outlet will render nested routes (dashboard, products, operations pages) */}
                    <Outlet />
                </div>
            </main>

            <style>{`
        .sidebar-link {
          display: block;
          padding: 8px 10px;
          border-radius: 8px;
          color: #1f2937;
          text-decoration: none;
          margin-bottom: 6px;
          font-size: 14px;
        }
        .sidebar-link.active {
          background: #e6f0ff;
          color: #0f172a;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          aside { display: none; }
        }
      `}</style>
        </div>
    );
}

const styles = {
    sidebar: {
        width: 240,
        background: "#fff",
        borderRight: "1px solid #eef2f7",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
    brand: {
        padding: "18px 14px",
        borderBottom: "1px solid #f1f5f9",
    },
    main: {
        flex: 1,
        background: "#f8fafc",
        padding: "18px",
    },
};
