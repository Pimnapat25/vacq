import { apiRequest } from "./client.js";

export function listAppointments() {
  return apiRequest("/appointments", { method: "GET", auth: true });
}

export function getAppointment(id) {
  return apiRequest(`/appointments/${encodeURIComponent(id)}`, { method: "GET", auth: true });
}

export function createAppointment(hospitalId, body) {
  return apiRequest(`/hospitals/${encodeURIComponent(hospitalId)}/appointments`, { method: "POST", json: body, auth: true });
}

export function updateAppointment(id, body) {
  return apiRequest(`/appointments/${encodeURIComponent(id)}`, { method: "PUT", json: body, auth: true });
}

export function deleteAppointment(id) {
  return apiRequest(`/appointments/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
}
