// src/components/auth/OtpVerify.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { loginMock } from "../../utils/auth";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const savedOtp = localStorage.getItem("sm_otp");
    const email = localStorage.getItem("sm_otp_email");

    if (!savedOtp) {
      alert("No OTP found — please request a new one from the Forgot Password page.");
      navigate("/forgot", { replace: true });
      return;
    }

    if (otp === savedOtp) {
      // Mock: treat OTP verify as password reset success — log user in
      loginMock(email || "user@example.com");
      // cleanup
      localStorage.removeItem("sm_otp");
      localStorage.removeItem("sm_otp_email");
      alert("OTP verified — (mock) password reset complete. You are now logged in.");
      navigate("/dashboard", { replace: true });
    } else {
      alert("Invalid OTP — please try again.");
    }
  }

  return (
    <AuthLayout title="Enter OTP">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 13 }}>OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            placeholder="Enter the OTP you received (mock)"
          />
        </div>

        <div>
          <button type="submit" style={{ padding: "8px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>
            Verify OTP
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
