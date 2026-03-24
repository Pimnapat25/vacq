import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/index.js";
import PatientAppShell from "../../layouts/PatientAppShell";

function PatientHospitalList() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr("");
      try {
        const res = await api.listHospitals({ limit: 50, sort: "name" });
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load hospitals");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = (data?.data ?? []).filter((h) => {
    const q = search.toLowerCase();
    return h.name.toLowerCase().includes(q) || h.province.toLowerCase().includes(q) || h.district.toLowerCase().includes(q);
  });

  return (
    <PatientAppShell>
      <header className="mb-10">
        <h1 className="mb-2 font-headline text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">Hospital Directory</h1>
        <p className="max-w-6xl text-sm text-on-surface-variant">
          Browse registered clinical facilities. Select a location to view details and book an appointment.
        </p>
      </header>
      
      <div className="mb-8">
        <input
          type="search"
          placeholder="Search by name, province, or district..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-outline-variant/20 bg-surface-container-highest px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Loading hospitals…</p>
      ) : err ? (
        <div className="rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error">{err}</div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((h) => (
            <li key={h._id}>
              <Link
                to={`/patient/hospital/${h._id}`}
                className="flex h-full flex-col rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <span className="material-symbols-outlined">local_hospital</span>
                </div>
                <h2 className="font-headline text-lg font-bold text-on-surface">{h.name}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {h.district}, {h.province}
                </p>
                {h.tel ? (
                  <p className="mt-3 text-xs font-medium text-outline">
                    <span className="material-symbols-outlined align-middle text-sm">call</span> {h.tel}
                  </p>
                ) : null}
                <span className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">View details →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && !err && (data?.data?.length ?? 0) === 0 ? (
        <p className="text-on-surface-variant">No hospitals found. Ask an administrator to add facilities.</p>
      ) : null}
    </PatientAppShell>
  );
}

export default PatientHospitalList;
