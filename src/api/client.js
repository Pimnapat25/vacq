import { API_BASE } from "./config.js";
import { getToken } from "./token.js";

/**
 * @param {string} path - path after API_BASE (e.g. "/auth/login")
 * @param {RequestInit & { json?: unknown, auth?: boolean }} options
 */
export async function apiRequest(path, options = {}) {
  const { json, auth = false, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (auth) {
    const t = getToken();
    if (t) headers.set("Authorization", `Bearer ${t}`);
  }
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body
  });

  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const err = new Error(data.message || data.msg || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/** Build query string from plain object (Mongo-style keys like province[in] supported). */
export function toQueryString(params) {
  if (!params || typeof params !== "object") return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, String(x)));
    else sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}
