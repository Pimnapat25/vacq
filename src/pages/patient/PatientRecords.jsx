import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/index.js";
import { useAuth } from "../../context/AuthContext";
import PatientAppShell from "../../layouts/PatientAppShell";
import { formatIsoDate } from "../../utils/date";

function namePart(x) {
  if (!x) return "—";
  if (typeof x === "object" && x.name) return x.name;
  return "—";
}

function PatientRecords() {
  const { user } = useAuth();
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
        if (!cancelled) setErr(e.message || "Failed to load records");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PatientAppShell>
      <header className="mb-12">
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">Clinical visit records</h1>
        <p className="max-w-2xl text-sm text-on-surface-variant font-body">
          Appointment history from the VacQ of dental / clinical scheduling.
        </p>
      </header>

      <div className="rounded-2xl bg-surface-container-low p-6 md:p-8">
        <p className="mb-6 text-sm text-on-surface-variant">
          The record of <strong className="text-on-surface">{user?.name}</strong>
        </p>

        {loading ? (
          <p>Loading…</p>
        ) : err ? (
          <div className="text-error">{err}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 text-xs uppercase tracking-wider text-on-surface-variant">
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">Hospital</th>
                  <th className="py-3 pr-4">Dentist</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {rows.map((a) => (
                  <tr key={a._id}>
                    <td className="py-3 pr-4 font-mono text-xs text-on-surface-variant">{a._id}</td>
                    <td className="py-3 pr-4">{namePart(a.hospital)}</td>
                    <td className="py-3 pr-4">{namePart(a.dentist)}</td>
                    <td className="py-3 font-medium">{formatIsoDate(a.apptDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !err && rows.length === 0 ? (
          <p className="text-on-surface-variant">
            No visits yet.{" "}
            <Link className="font-bold text-primary underline" to="/patient/hospitals">
              Browse hospitals
            </Link>{" "}
            to book.
          </p>
        ) : null}
      </div>
    </PatientAppShell>
  );
}

export default PatientRecords;
