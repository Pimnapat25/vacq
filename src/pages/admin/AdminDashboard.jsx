import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/index.js";
import AdminAppShell from "../../layouts/AdminAppShell";
import { adminDashboard as d } from "../../data/mockData";

function AdminDashboard() {
  const [hospitalCount, setHospitalCount] = useState(null);
  const [apptCount, setApptCount] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [hRes, aRes] = await Promise.all([api.listHospitals({ limit: 100 }), api.listAppointments()]);
        if (cancelled) return;
        setHospitals(hRes.data ?? []);
        setHospitalCount(hRes.count ?? hRes.data?.length ?? 0);
        setApptCount(aRes.count ?? aRes.data?.length ?? 0);
      } catch (e) {
        if (!cancelled) setLoadErr(e.message || "Could not load dashboard statistics");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminAppShell>
      <header className="mb-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">Central Dashboard</h1>
            <p className="max-w-4xl text-base font-medium text-secondary">
              Live statistics and administrative overview of recent hospital registrations and clinical visits.
            </p>
            {loadErr ? <p className="mt-2 text-sm text-error">{loadErr}</p> : null}
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/hospitals"
              className="rounded-xl bg-primary px-6 py-3 font-bold text-on-primary shadow-sm transition-colors hover:bg-primary/90"
            >
              Manage hospitals
            </Link>
          </div>
        </div>
      </header>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-8 md:col-span-2">
          <div className="relative z-10">
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-secondary">Total appointments</span>
            <div className="mb-2 text-5xl font-black text-primary">{apptCount ?? "—"}</div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-5 transition-transform duration-500 group-hover:scale-110">
            <span className="material-symbols-outlined text-[12rem]">vaccines</span>
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-2xl border border-outline-variant/10 bg-surface-container-low p-8 text-center">
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-secondary-container">Hospitals</span>
          <div className="text-4xl font-extrabold text-on-surface">{hospitalCount ?? "—"}</div>
        </div>
        <div className="flex flex-col justify-center rounded-2xl border border-outline-variant/10 bg-surface-container-low p-8 text-center">
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-secondary-container">Avg. Queue Wait</span>
          <div className="text-4xl font-extrabold text-on-surface">
            {d.stats.avgQueueWait}
            <span className="ml-1 text-xl text-secondary">{d.stats.avgQueueUnit}</span>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-surface">Hospitals</h3>
        </div>
        <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-surface-container-low text-[10px] font-black uppercase tracking-widest text-secondary">
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Province</th>
                <th className="px-8 py-4">Tel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {hospitals.slice(0, 8).map((h) => (
                <tr key={h._id}>
                  <td className="px-8 py-4 font-bold">{h.name}</td>
                  <td className="px-8 py-4">{h.province}</td>
                  <td className="px-8 py-4">{h.tel}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hospitals.length === 0 && !loadErr ? (
            <p className="p-8 text-on-surface-variant">No hospitals returned.</p>
          ) : null}
        </div>
      </section>
    </AdminAppShell>
  );
}

export default AdminDashboard;
