import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/index.js";
import { useAuth } from "../../context/AuthContext";
import PatientAppShell from "../../layouts/PatientAppShell";
import { patient } from "../../data/mockData";
import { formatIsoDate, isFuture } from "../../utils/date";

function namePart(x) {
  if (!x) return "—";
  if (typeof x === "object" && x.name) return x.name;
  return "—";
}

function PatientDashboard() {
  const { user } = useAuth();
  const p = patient;
  const [appts, setAppts] = useState([]);
  const [loadingAppt, setLoadingAppt] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.listAppointments();
        if (!cancelled) setAppts(res.data ?? []);
      } catch {
        if (!cancelled) setAppts([]);
      } finally {
        if (!cancelled) setLoadingAppt(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = appts.filter((a) => isFuture(a.apptDate)).sort((a, b) => new Date(a.apptDate) - new Date(b.apptDate))[0];

  const first = user?.email?.split("@")[0] ?? "there";

  return (
    <PatientAppShell>
      <section className="mb-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-on-surface lg:text-3xl">Welcome back, {first}.</h2>
            <p className="max-w-6xl text-sm text-on-surface-variant">
              Book and manage visits from the hospital directory and appointments pages.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-xs font-bold tracking-wide text-on-secondary-container">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {user?.role === "admin" ? "ADMIN" : "PATIENT"} SESSION
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="flex min-h-[320px] flex-col justify-between rounded-3xl bg-surface-container-lowest p-8 md:col-span-12">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-2xl font-bold">Vaccination Sequence</h3>
              <p className="text-sm text-outline">{p.vaccination.product}</p>
              <p className="mt-2 text-xs text-on-surface-variant">(Demo UI — backend tracks dental appointments separately.)</p>
            </div>
            <span className="text-lg font-bold text-primary">{p.vaccination.percentComplete}% Complete</span>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <div className="mb-6 h-4 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container"
                style={{ width: `${p.vaccination.percentComplete}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {p.vaccination.doses.map((d) => (
                <div key={d.label} className={`flex flex-col gap-2 ${d.state === "pending" ? "opacity-40" : ""}`}>
                  <span className="text-xs font-bold uppercase tracking-tighter text-outline">{d.label}</span>
                  <div
                    className={`flex items-center gap-2 ${
                      d.state === "done" ? "text-primary" : d.state === "scheduled" ? "text-tertiary" : ""
                    }`}
                  >
                    {d.state === "done" ? (
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    ) : d.state === "scheduled" ? (
                      <span className="material-symbols-outlined text-sm">schedule</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">circle</span>
                    )}
                    <span className="text-sm font-semibold">{d.status}</span>
                  </div>
                  <span className="text-[10px] text-outline">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-surface-container-low p-8 md:col-span-5">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-bold">Next appointment (API)</h3>
            <span className="material-symbols-outlined text-primary">calendar_today</span>
          </div>
          {loadingAppt ? (
            <p className="text-sm text-outline">Loading…</p>
          ) : upcoming ? (
            <div className="space-y-6">
              <div>
                <p className="text-lg font-bold">{namePart(upcoming.hospital)}</p>
                <p className="text-sm text-outline">{formatIsoDate(upcoming.apptDate)}</p>
                <p className="mt-2 text-sm text-on-surface-variant">Dentist: {namePart(upcoming.dentist)}</p>
              </div>
              <Link to="/patient/appointments" className="inline-block rounded-xl bg-on-surface px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">
                Manage schedule
              </Link>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              No upcoming visit.{" "}
              <Link className="font-bold text-primary underline" to="/patient/hospitals">
                Book at a hospital
              </Link>
              .
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-7">
          <Link
            to="/patient/hospitals"
            className="group flex flex-col justify-between rounded-3xl bg-surface-container-lowest p-8 transition-all duration-300 hover:bg-surface-bright"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <span className="material-symbols-outlined">local_hospital</span>
            </div>
            <div>
              <h4 className="text-lg font-bold transition-colors group-hover:text-primary">Hospital Directory</h4>
              <p className="mt-2 text-sm text-outline">Live list from GET /hospitals</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase text-primary">
              Browse
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>
          <Link
            to="/patient/records"
            className="group flex flex-col justify-between rounded-3xl bg-surface-container-lowest p-8 transition-all duration-300 hover:bg-surface-bright"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <span className="material-symbols-outlined">history_edu</span>
            </div>
            <div>
              <h4 className="text-lg font-bold transition-colors group-hover:text-amber-700">Visit records</h4>
              <p className="mt-2 text-sm text-outline">Exported from your appointments</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase text-amber-700">
              View records
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>
        </div>
      </div>


    </PatientAppShell>
  );
}

export default PatientDashboard;
