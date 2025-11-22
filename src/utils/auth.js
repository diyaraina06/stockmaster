// src/utils/auth.js
// Simple mock auth helpers used by the auth pages (stores token + role in localStorage)

export function isAuthenticated() {
  return !!localStorage.getItem("sm_auth_token");
}

export function getUserEmail() {
  return localStorage.getItem("sm_user_email") || null;
}

export function getUserRole() {
  return localStorage.getItem("sm_user_role") || null;
}

export function loginMock(email, role = "inventory_manager") {
  // create a fake token and save user email + role
  const token = btoa(`${email}:token:${Date.now()}`);
  localStorage.setItem("sm_auth_token", token);
  localStorage.setItem("sm_user_email", email);
  localStorage.setItem("sm_user_role", role); // e.g., "inventory_manager" or "warehouse_staff"
}

export function logout() {
  localStorage.removeItem("sm_auth_token");
  localStorage.removeItem("sm_user_email");
  localStorage.removeItem("sm_user_role");
}
