import { apiRequest } from "./client.js";
import { setToken } from "./token.js";

export async function register(body) {
  const data = await apiRequest("/auth/register", { method: "POST", json: body });
  if (data.token) setToken(data.token);
  return data;
}

export async function login(body) {
  const data = await apiRequest("/auth/login", { method: "POST", json: body });
  if (data.token) setToken(data.token);
  return data;
}

export async function me() {
  return apiRequest("/auth/me", { method: "GET", auth: true });
}

export async function logout() {
  return apiRequest("/auth/logout", { method: "GET" });
}
