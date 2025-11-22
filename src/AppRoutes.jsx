// src/AppRoutes.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import OtpVerify from "./components/auth/OtpVerify";

import SidebarLayout from "./components/layout/SidebarLayout";
import StockMasterDashboard from "./components/StockMasterDashboard";

// pages wired to sidebar
import Products from "./pages/Products";
import Receipts from "./pages/Receipts";
import Deliveries from "./pages/Deliveries";
import Adjustments from "./pages/Adjustments";
import Moves from "./pages/Moves";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import { isAuthenticated, logout } from "./utils/auth";

function Private({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

// Routes: public auth pages; protected app pages wrapped by SidebarLayout
const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },

  // auth
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot", element: <ForgotPassword /> },
  { path: "/otp", element: <OtpVerify /> },

  // protected app area (uses SidebarLayout with nested routes)
  {
    path: "/",
    element: (
      <Private>
        <SidebarLayout />
      </Private>
    ),
    children: [
      { index: false, path: "dashboard", element: <StockMasterDashboard /> },
      { path: "products", element: <Products /> },
      { path: "receipts", element: <Receipts /> },
      { path: "deliveries", element: <Deliveries /> },
      { path: "adjustments", element: <Adjustments /> },
      { path: "moves", element: <Moves /> },
      { path: "settings", element: <Settings /> },
      { path: "profile", element: <Profile /> },
      // logout route just clears auth and returns to login
      {
        path: "logout",
        element: <LogoutHandler />
      }
    ]
  },

  // fallback
  { path: "*", element: <div style={{ padding: 20 }}>Not found — <a href="/">Go home</a></div> }
]);

// small logout handler component
function LogoutHandler() {
  logout();
  // redirect to login
  return <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

