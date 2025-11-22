// src/AppRoutes.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import OtpVerify from "./components/auth/OtpVerify";
import StockMasterDashboard from "./components/StockMasterDashboard";
import { isAuthenticated, logout } from "./utils/auth";

function Private({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot", element: <ForgotPassword /> },
  { path: "/otp", element: <OtpVerify /> },
  {
    path: "/dashboard",
    element: (
      <Private>
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: 12 }}>
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              style={{ padding: "8px 12px" }}
            >
              Logout
            </button>
          </div>
          <StockMasterDashboard />
        </div>
      </Private>
    ),
  },
  { path: "*", element: <div style={{ padding: 20 }}>Not found — <a href="/">Go home</a></div> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
