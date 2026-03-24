import { apiRequest } from "./client.js";

export function listDentists() {
  return apiRequest("/dentists", { method: "GET" });
}

export function getDentist(id) {
  return apiRequest(`/dentists/${encodeURIComponent(id)}`, { method: "GET" });
}

export function createDentist(hospitalId, body) {
  return apiRequest(`/hospitals/${encodeURIComponent(hospitalId)}/dentists`, { method: "POST", json: body, auth: true });
}

export function updateDentist(id, body) {
  return apiRequest(`/dentists/${encodeURIComponent(id)}`, { method: "PUT", json: body, auth: true });
}

export function deleteDentist(id) {
  return apiRequest(`/dentists/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
}
