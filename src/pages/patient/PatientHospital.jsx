import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "../../api/index.js";
import { useAuth } from "../../context/AuthContext";
import PatientAppShell from "../../layouts/PatientAppShell";
import { formatIsoDate } from "../../utils/date";

function hospitalLabel(h) {
  if (!h) return "—";
  if (typeof h === "object" && h.name) return h.name;
  return "—";
}

function PatientHospital() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [hospital, setHospital] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookErr, setBookErr] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [apptLocal, setApptLocal] = useState("");

  useEffect(() => {
    let cancelled = false;
    setDentistId("");
    setApptLocal("");
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const [hRes, dRes, aRes] = await Promise.all([
          api.getHospital(id),
          api.listHospitalDentists(id),
          api.listAppointments()
        ]);
        if (cancelled) return;
        setHospital(hRes.data);
        const dList = dRes.data ?? [];
        setDentists(dList);
        if (dList.length) setDentistId((prev) => prev || dList[0]._id);
        setMyAppointments(aRes.data ?? []);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Could not load hospital");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const userBookingCount = myAppointments.filter((a) => {
    const uid = typeof a.user === "object" ? a.user?._id : a.user;
    return uid === user?._id;
  }).length;

  const canBookMore = isAdmin || userBookingCount < 1;

  async function reloadAppointments() {
    const aRes = await api.listAppointments();
    setMyAppointments(aRes.data ?? []);
  }

  async function handleBook(e) {
    e.preventDefault();
    setBookErr("");
    if (!dentistId || !apptLocal) {
      setBookErr("Choose a dentist and date/time.");
      return;
    }
    setBooking(true);
    try {
      const iso = new Date(apptLocal).toISOString();
      await api.createAppointment(id, { apptDate: iso, dentist: dentistId });
      setApptLocal("");
      await reloadAppointments();
    } catch (e) {
      setBookErr(e.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  }

  const h = hospital;

  return (
    <PatientAppShell>
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
        <Link className="transition-colors hover:text-primary" to="/patient/hospitals">
          Directory
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-semibold text-on-surface">{h?.name ?? "Hospital"}</span>
      </nav>

      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : err ? (
        <div className="rounded-xl border border-error/30 bg-error/5 p-4 text-error">{err}</div>
      ) : h ? (
        <>
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="mb-3 font-headline text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">{h.name}</h1>
              <p className="mb-6 text-sm uppercase tracking-wider text-on-surface-variant">
                {h.region} · {h.province}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-surface-container-low p-6">
                  <span className="material-symbols-outlined mb-2 text-primary">location_on</span>
                  <h4 className="font-headline font-bold text-on-surface">Address</h4>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {h.address}
                    <br />
                    {h.district}, {h.province} {h.postalcode}
                  </p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-6">
                  <span className="material-symbols-outlined mb-2 text-primary">call</span>
                  <h4 className="font-headline font-bold text-on-surface">Contact</h4>
                  <p className="mt-2 text-sm text-on-surface-variant">{h.tel || "—"}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 lg:col-span-5">
              <h3 className="mb-4 font-headline text-lg font-bold">Book appointment</h3>
              {!canBookMore ? (
                <p className="text-sm text-on-surface-variant">
                  You already have an appointment on file. Reschedule or cancel it from{" "}
                  <Link className="font-bold text-primary underline" to="/patient/appointments">
                    My Appointments
                  </Link>
                  .
                </p>
              ) : (
                <form className="space-y-4" onSubmit={handleBook}>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant" htmlFor="dentist">
                      Dentist
                    </label>
                    <select
                      id="dentist"
                      className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm"
                      value={dentistId}
                      onChange={(e) => setDentistId(e.target.value)}
                    >
                      {dentists.length === 0 ? <option value="">No dentists listed</option> : null}
                      {dentists.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name} — {d.areaOfExpertise}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-on-surface-variant" htmlFor="appt">
                      Date &amp; time
                    </label>
                    <input
                      id="appt"
                      type="datetime-local"
                      className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm"
                      value={apptLocal}
                      onChange={(e) => setApptLocal(e.target.value)}
                      required
                    />
                  </div>
                  {bookErr ? <p className="text-sm text-error">{bookErr}</p> : null}
                  <button
                    type="submit"
                    disabled={booking || !dentists.length}
                    className="primary-gradient w-full rounded-xl py-3 font-bold text-white shadow-lg disabled:opacity-50"
                  >
                    {booking ? "Booking…" : "Confirm booking"}
                  </button>
                </form>
              )}
            </div>
          </div>

          <section className="mt-12">
            <h2 className="mb-4 font-headline text-xl font-bold">Dentists at this hospital</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {dentists.map((d) => (
                <li key={d._id} className="rounded-xl bg-surface-container-low p-4">
                  <p className="font-bold text-on-surface">{d.name}</p>
                  <p className="text-sm text-on-surface-variant">{d.areaOfExpertise}</p>
                  <p className="text-xs text-outline">{d.yearsOfExperience} yrs experience</p>
                </li>
              ))}
            </ul>
            {dentists.length === 0 ? <p className="text-sm text-on-surface-variant">No dentists yet for this facility.</p> : null}
          </section>

          <section className="mt-12">
            <h2 className="mb-4 font-headline text-xl font-bold">Your appointment(s) here</h2>
            <ul className="space-y-2">
              {myAppointments
                .filter((a) => {
                  const hid = typeof a.hospital === "object" ? a.hospital?._id : a.hospital;
                  return hid === id;
                })
                .map((a) => (
                  <li key={a._id} className="flex flex-wrap items-center justify-between rounded-lg bg-surface-container-high px-4 py-3 text-sm">
                    <span>{formatIsoDate(a.apptDate)}</span>
                    <span className="text-on-surface-variant">{hospitalLabel(a.dentist)}</span>
                    <Link className="text-primary underline" to="/patient/appointments">
                      Manage
                    </Link>
                  </li>
                ))}
            </ul>
            {myAppointments.filter((a) => {
              const hid = typeof a.hospital === "object" ? a.hospital?._id : a.hospital;
              return hid === id;
            }).length === 0 ? (
              <p className="text-sm text-on-surface-variant">No bookings at this hospital yet.</p>
            ) : null}
          </section>
        </>
      ) : null}
    </PatientAppShell>
  );
}

export default PatientHospital;
