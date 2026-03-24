import { apiRequest, toQueryString } from "./client.js";

export function listHospitals(query = {}) {
  return apiRequest(`/hospitals${toQueryString(query)}`, { method: "GET" });
}

export function getHospital(id) {
  return apiRequest(`/hospitals/${encodeURIComponent(id)}`, { method: "GET" });
}

export function createHospital(body) {
  return apiRequest("/hospitals", { method: "POST", json: body, auth: true });
}

export function updateHospital(id, body) {
  return apiRequest(`/hospitals/${encodeURIComponent(id)}`, { method: "PUT", json: body, auth: true });
}

export function deleteHospital(id) {
  return apiRequest(`/hospitals/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
}

export function listHospitalDentists(hospitalId) {
  return apiRequest(`/hospitals/${encodeURIComponent(hospitalId)}/dentists`, { method: "GET" });
}

export function listHospitalAppointments(hospitalId) {
  return apiRequest(`/hospitals/${encodeURIComponent(hospitalId)}/appointments`, { method: "GET", auth: true });
}
