import { useEffect, useState } from "react";
import * as api from "../../api/index.js";
import AdminAppShell from "../../layouts/AdminAppShell";
import { formatIsoDate } from "../../utils/date";

function userLabel(u) {
  if (!u) return "—";
  if (typeof u === "object") return u.name || u.email || u._id;
  return String(u);
}

function hospLabel(h) {
  if (!h) return "—";
  if (typeof h === "object") return h.name || h._id;
  return String(h);
}

function dentistLabel(d) {
  if (!d) return "—";
  if (typeof d === "object") return d.name || d._id;
  return String(d);
}

function AdminRegistry() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.listAppointments();
        if (!cancelled) setRows(res.data ?? []);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load appointments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalRegistered = rows.length;
  const future = rows.filter((a) => new Date(a.apptDate) > Date.now()).length;

  return (
    <AdminAppShell>
      <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Appointments registry</h1>
          <p className="mt-2 max-w-lg text-on-surface-variant">
            All appointments from the system.
          </p>
        </div>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex h-40 flex-col justify-between rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
          <span className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Total appointments</span>
          <h2 className="font-headline text-3xl font-black text-on-surface">{loading ? "…" : totalRegistered}</h2>
        </div>
        <div className="flex h-40 flex-col justify-between rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
          <span className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Future-dated</span>
          <h2 className="font-headline text-3xl font-black text-on-surface">{loading ? "…" : future}</h2>
        </div>
      </section>

      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <div className="text-error">{err}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-high/30">
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-on-surface-variant">Patient / User</th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-on-surface-variant">Hospital</th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-on-surface-variant">Dentist</th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-on-surface-variant">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-on-surface-variant">Appointment ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {rows.map((row) => (
                  <tr key={row._id} className="group transition-colors hover:bg-surface-container-lowest">
                    <td className="px-6 py-4 text-center">
                      <p className="font-bold text-on-surface">{userLabel(row.user)}</p>
                      {typeof row.user === "object" && row.user?.email ? (
                        <p className="text-xs text-on-surface-variant">{row.user.email}</p>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">{hospLabel(row.hospital)}</td>
                    <td className="px-6 py-4 text-center text-sm">{dentistLabel(row.dentist)}</td>
                    <td className="px-6 py-4 text-center text-sm">{formatIsoDate(row.apptDate)}</td>
                    <td className="px-6 py-4 text-center font-mono text-xs text-on-surface-variant">{row._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !err && rows.length === 0 ? <p className="text-on-surface-variant">No appointments in the system yet.</p> : null}
    </AdminAppShell>
  );
}

export default AdminRegistry;
