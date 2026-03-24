import { useCallback, useEffect, useMemo, useState } from "react";
import * as api from "../../api/index.js";
import AdminAppShell from "../../layouts/AdminAppShell";
import { formatIsoDate } from "../../utils/date";

const emptyForm = {
  hospitalId: "",
  dentistId: "",
  apptLocal: ""
};

function idPart(value) {
  if (!value) return "—";
  if (typeof value === "object") return value._id || "—";
  return String(value);
}

function namePart(value) {
  if (!value) return "—";
  if (typeof value === "object") return value.name || value.email || value._id || "—";
  return String(value);
}

function toDatetimeLocal(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterHospitalId, setFilterHospitalId] = useState("");

  const loadAll = useCallback(async () => {
    setErr("");
    try {
      const [appointmentsRes, hospitalsRes] = await Promise.all([api.listAppointments(), api.listHospitals({ limit: 200, sort: "name" })]);
      const hospitalRows = hospitalsRes.data ?? [];
      setRows(appointmentsRes.data ?? []);
      setHospitals(hospitalRows);
      setForm((prev) => ({ ...prev, hospitalId: prev.hospitalId || hospitalRows[0]?._id || "" }));
    } catch (error) {
      setErr(error.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    let cancelled = false;
    async function loadDentistsForHospital() {
      if (!form.hospitalId) {
        setDentists([]);
        return;
      }
      try {
        const res = await api.listHospitalDentists(form.hospitalId);
        if (cancelled) return;
        const dentistRows = res.data ?? [];
        setDentists(dentistRows);
        setForm((prev) => ({ ...prev, dentistId: prev.dentistId || dentistRows[0]?._id || "" }));
      } catch {
        if (cancelled) return;
        setDentists([]);
      }
    }
    loadDentistsForHospital();
    return () => {
      cancelled = true;
    };
  }, [form.hospitalId]);

  const visibleRows = useMemo(() => {
    if (!filterHospitalId) return rows;
    return rows.filter((row) => idPart(row.hospital) === filterHospitalId);
  }, [rows, filterHospitalId]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.hospitalId || !form.dentistId || !form.apptLocal) return;
    setSaving(true);
    try {
      await api.createAppointment(form.hospitalId, {
        apptDate: new Date(form.apptLocal).toISOString(),
        dentist: form.dentistId
      });
      setForm((prev) => ({ ...prev, apptLocal: "" }));
      await loadAll();
    } catch (error) {
      alert(error.message || "Create failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(appointment) {
    setEditingId(appointment._id);
    const hospitalId = idPart(appointment.hospital);
    const dentistId = idPart(appointment.dentist);
    setForm({
      hospitalId,
      dentistId,
      apptLocal: toDatetimeLocal(appointment.apptDate)
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingId || !form.apptLocal) return;
    setSaving(true);
    try {
      await api.updateAppointment(editingId, {
        apptDate: new Date(form.apptLocal).toISOString(),
        dentist: form.dentistId || undefined
      });
      setEditingId(null);
      setForm((prev) => ({ ...prev, apptLocal: "" }));
      await loadAll();
    } catch (error) {
      alert(error.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await api.deleteAppointment(id);
      await loadAll();
    } catch (error) {
      alert(error.message || "Delete failed");
    }
  }

  async function applyHospitalApiFilter() {
    if (!filterHospitalId) {
      await loadAll();
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await api.listHospitalAppointments(filterHospitalId);
      setRows(res.data ?? []);
    } catch (error) {
      setErr(error.message || "Could not load appointments by hospital");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminAppShell>
      <header className="mb-8">
        <h1 className="font-headline text-3xl font-extrabold text-on-surface">Appointments registry</h1>
        <p className="mt-2 text-on-surface-variant">View, create, update, and manage appointments in one place.</p>
      </header>

      {loading ? <p>Loading…</p> : null}
      {!loading && err ? <div className="mb-6 text-error">{err}</div> : null}

      <section className="mb-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
        <h2 className="mb-4 text-lg font-bold">{editingId ? "Update appointment" : "Create appointment"}</h2>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-3" onSubmit={editingId ? handleUpdate : handleCreate}>
          <label className="text-sm">
            <span className="mb-1 block font-bold text-on-surface-variant">Hospital</span>
            <select
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
              value={form.hospitalId}
              onChange={(e) => setForm((prev) => ({ ...prev, hospitalId: e.target.value, dentistId: "" }))}
              disabled={Boolean(editingId)}
              required
            >
              {hospitals.map((hospital) => (
                <option key={hospital._id} value={hospital._id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-bold text-on-surface-variant">Dentist</span>
            <select
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
              value={form.dentistId}
              onChange={(e) => setForm((prev) => ({ ...prev, dentistId: e.target.value }))}
              required
            >
              {dentists.length === 0 ? <option value="">No dentists in hospital</option> : null}
              {dentists.map((dentist) => (
                <option key={dentist._id} value={dentist._id}>
                  {dentist.name} - {dentist.areaOfExpertise}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-bold text-on-surface-variant">Date &amp; time</span>
            <input
              type="datetime-local"
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
              value={form.apptLocal}
              onChange={(e) => setForm((prev) => ({ ...prev, apptLocal: e.target.value }))}
              required
            />
          </label>
          <div className="flex gap-2 md:col-span-3">
            <button
              type="submit"
              disabled={saving || !hospitals.length}
              className="rounded-xl bg-primary px-6 py-2.5 font-bold text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Save changes" : "Create appointment"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="rounded-xl border border-outline-variant/20 px-4 py-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mb-4 flex flex-col gap-3 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-4 md:flex-row md:items-end">
        <label className="text-sm">
          <span className="mb-1 block font-bold text-on-surface-variant">Filter by hospital</span>
          <select
            className="w-full min-w-72 rounded-lg border border-outline-variant/20 bg-surface px-3 py-2"
            value={filterHospitalId}
            onChange={(e) => setFilterHospitalId(e.target.value)}
          >
            <option value="">All hospitals</option>
            {hospitals.map((hospital) => (
              <option key={hospital._id} value={hospital._id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={applyHospitalApiFilter}
          className="rounded-xl border border-outline-variant/20 px-4 py-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          {filterHospitalId ? "Show selected hospital appointments" : "Show appointments from all hospitals"}
        </button>
      </section>

      <div className="overflow-x-auto rounded-2xl border border-outline-variant/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-high/40 text-xs uppercase tracking-wider text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">Dentist</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {visibleRows.map((row) => (
              <tr key={row._id}>
                <td className="px-4 py-3">{formatIsoDate(row.apptDate)}</td>
                <td className="px-4 py-3">{namePart(row.user)}</td>
                <td className="px-4 py-3">{namePart(row.hospital)}</td>
                <td className="px-4 py-3">{namePart(row.dentist)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                      onClick={() => startEdit(row)}
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-error/30 bg-error/5 px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10"
                      onClick={() => handleDelete(row._id)}
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminAppShell>
  );
}

export default AdminAppointments;
