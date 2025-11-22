// src/components/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return alert("Enter your email");

    // Mock: generate OTP and save it to localStorage for demo
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("sm_otp", fakeOtp);
    localStorage.setItem("sm_otp_email", email);

    // For demo we show the OTP in an alert so evaluators can test the flow.
    alert(`Mock OTP generated: ${fakeOtp} (use it on the OTP page)`);

    // Navigate to OTP verification page
    navigate("/otp", { replace: true });
  }

  return (
    <AuthLayout title="Reset password">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 13 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <button type="submit" style={{ padding: "8px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>
            Send OTP
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
