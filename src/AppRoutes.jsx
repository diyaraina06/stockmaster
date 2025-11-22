// src/AppRoutes.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import OtpVerify from "./components/auth/OtpVerify";

import SidebarLayout from "./components/layout/SidebarLayout";
import StockMasterDashboard from "./components/StockMasterDashboard";

// Pages
import Products from "./pages/Products";
import Receipts from "./pages/Receipts";
import Deliveries from "./pages/Deliveries";
import InternalTransfers from "./pages/InternalTransfers"; // ADDED
import Adjustments from "./pages/Adjustments";
import Moves from "./pages/Moves";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import { isAuthenticated, logout } from "./utils/auth";

function Private({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

function LogoutHandler() {
  logout();
  return <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },

  // ---------- AUTH ROUTES ----------
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot", element: <ForgotPassword /> },
  { path: "/otp", element: <OtpVerify /> },

  // ---------- PROTECTED APP ----------
  {
    path: "/",
    element: (
      <Private>
        <SidebarLayout />
      </Private>
    ),
    children: [
      { path: "dashboard", element: <StockMasterDashboard /> },

      // Operations
      { path: "products", element: <Products /> },
      { path: "receipts", element: <Receipts /> },
      { path: "deliveries", element: <Deliveries /> },
      { path: "internal", element: <InternalTransfers /> },  // ⭐ ADDED
      { path: "adjustments", element: <Adjustments /> },
      { path: "moves", element: <Moves /> },

      // Settings & Profile
      { path: "settings", element: <Settings /> },
      { path: "profile", element: <Profile /> },

      // Logout
      { path: "logout", element: <LogoutHandler /> }
    ]
  },

  // ---------- 404 ----------
  { path: "*", element: <div style={{ padding: 20 }}>Not found — <a href="/">Go home</a></div> }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
