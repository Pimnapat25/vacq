import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/index.js";
import PatientAppShell from "../../layouts/PatientAppShell";
import { formatIsoDate, isFuture } from "../../utils/date";

function namePart(x) {
  if (!x) return "—";
  if (typeof x === "object" && x.name) return x.name;
  return "—";
}

function PatientAppointments() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editDentist, setEditDentist] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setErr("");
    try {
      const res = await api.listAppointments();
      setRows(res.data ?? []);
    } catch (e) {
      setErr(e.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upcoming = rows.filter((a) => isFuture(a.apptDate));
  const past = rows.filter((a) => !isFuture(a.apptDate));

  async function handleDelete(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.deleteAppointment(id);
      await load();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  function startEdit(a) {
    const hid = typeof a.hospital === "object" ? a.hospital?._id : a.hospital;
    const did = typeof a.dentist === "object" ? a.dentist?._id : a.dentist;
    setEditId(a._id);
    const d = new Date(a.apptDate);
    const pad = (n) => String(n).padStart(2, "0");
    setEditDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    setEditDentist(did || "");
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editId || !editDate) return;
    setSaving(true);
    try {
      const body = { apptDate: new Date(editDate).toISOString() };
      if (editDentist) body.dentist = editDentist;
      await api.updateAppointment(editId, body);
      setEditId(null);
      await load();
    } catch (e) {
      alert(e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PatientAppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-3 font-headline text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">Your Schedule</h1>
            <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
              Manage your clinical visits.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link 
              to="/patient/hospitals" 
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-md hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Create Appointment
            </Link>
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
              <span className="font-label text-xs font-semibold uppercase tracking-wider">Only 1 appointment allowed</span>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-on-surface-variant">Loading…</p>
        ) : err ? (
          <div className="rounded-xl border border-error/30 bg-error/5 p-4 text-error">{err}</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <h3 className="font-headline text-xl font-bold text-on-surface">Upcoming</h3>
              {upcoming.length === 0 ? (
                <p className="text-on-surface-variant">No upcoming visits. Book from a hospital page.</p>
              ) : null}
              {upcoming.map((a) => (
                <div key={a._id} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                  <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h4 className="font-headline text-xl font-bold text-primary">{namePart(a.hospital)}</h4>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined align-middle text-sm">calendar_today</span>{" "}
                        {formatIsoDate(a.apptDate)}
                      </p>
                      <p className="mt-2 text-sm text-on-surface-variant">Dentist: {namePart(a.dentist)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
                        onClick={() => startEdit(a)}
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest text-error hover:bg-error/10"
                        onClick={() => handleDelete(a._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <h3 className="pt-8 font-headline text-xl font-bold text-on-surface">Past</h3>
              {past.length === 0 ? <p className="text-sm text-on-surface-variant">No past visits.</p> : null}
              <ul className="space-y-3">
                {past.map((a) => (
                  <li key={a._id} className="rounded-lg border border-outline-variant/10 bg-surface-container-high/50 px-4 py-3 text-sm">
                    <span className="font-semibold">{namePart(a.hospital)}</span> · {formatIsoDate(a.apptDate)} · {namePart(a.dentist)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1 lg:pt-12">
              {editId ? (
                <form className="rounded-xl border border-primary/20 bg-surface-container-low p-6" onSubmit={saveEdit}>
                  <h3 className="mb-4 font-headline text-lg font-bold">Reschedule</h3>
                  <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant">New date &amp; time</label>
                  <input
                    type="datetime-local"
                    className="mb-4 w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                  />
                  <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant">Dentist ID (optional)</label>
                  <input
                    className="mb-4 w-full rounded-lg border border-outline-variant/20 px-3 py-2 font-mono text-xs"
                    value={editDentist}
                    onChange={(e) => setEditDentist(e.target.value)}
                    placeholder="Leave to keep current"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 rounded-lg bg-primary py-2 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => setEditId(null)}>
                      Close
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-xl bg-surface-container-low p-8 text-sm text-on-surface-variant">
                  Select <strong className="text-on-surface">Reschedule</strong> on an upcoming visit to change time or dentist.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PatientAppShell>
  );
}

export default PatientAppointments;
