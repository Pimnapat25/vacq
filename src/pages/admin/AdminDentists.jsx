import { useCallback, useEffect, useState } from "react";
import * as api from "../../api/index.js";
import AdminAppShell from "../../layouts/AdminAppShell";

const emptyForm = {
  hospitalId: "",
  name: "",
  yearsOfExperience: 0,
  areaOfExpertise: ""
};

function dentistHospitalId(dentist) {
  if (!dentist?.hospital) return "";
  return typeof dentist.hospital === "object" ? dentist.hospital?._id || "" : dentist.hospital;
}

function dentistHospitalName(dentist) {
  if (!dentist?.hospital) return "—";
  return typeof dentist.hospital === "object" ? dentist.hospital?.name || "—" : dentist.hospital;
}

function AdminDentists() {
  const [rows, setRows] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [lookupName, setLookupName] = useState("");
  const [lookupResults, setLookupResults] = useState([]);
  const [lookupErr, setLookupErr] = useState("");

  const load = useCallback(async () => {
    setErr("");
    try {
      const [dentistsRes, hospitalsRes] = await Promise.all([api.listDentists(), api.listHospitals({ limit: 200, sort: "name" })]);
      setRows(dentistsRes.data ?? []);
      const hospitalRows = hospitalsRes.data ?? [];
      setHospitals(hospitalRows);
      setForm((prev) => ({ ...prev, hospitalId: prev.hospitalId || hospitalRows[0]?._id || "" }));
    } catch (e) {
      setErr(e.message || "Failed to load dentists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(dentist) {
    setEditingId(dentist._id);
    setForm({
      hospitalId: dentistHospitalId(dentist),
      name: dentist.name || "",
      yearsOfExperience: Number(dentist.yearsOfExperience) || 0,
      areaOfExpertise: dentist.areaOfExpertise || ""
    });
  }

  function clearForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      hospitalId: hospitals[0]?._id || ""
    });
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.hospitalId) return;
    setSaving(true);
    try {
      await api.createDentist(form.hospitalId, {
        name: form.name,
        yearsOfExperience: Number(form.yearsOfExperience) || 0,
        areaOfExpertise: form.areaOfExpertise
      });
      clearForm();
      await load();
    } catch (error) {
      alert(error.message || "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      await api.updateDentist(editingId, {
        name: form.name,
        yearsOfExperience: Number(form.yearsOfExperience) || 0,
        areaOfExpertise: form.areaOfExpertise
      });
      clearForm();
      await load();
    } catch (error) {
      alert(error.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this dentist?")) return;
    try {
      await api.deleteDentist(id);
      await load();
    } catch (error) {
      alert(error.message || "Delete failed");
    }
  }

  async function handleLookup(e) {
    e.preventDefault();
    const query = lookupName.trim().toLowerCase();
    if (!query) return;
    setLookupErr("");
    const matches = rows.filter((dentist) => (dentist.name || "").toLowerCase().includes(query));
    setLookupResults(matches);
    if (matches.length === 0) setLookupErr("No dentist matched that name");
  }

  return (
    <AdminAppShell>
      <header className="mb-8">
        <h1 className="font-headline text-3xl font-extrabold text-on-surface">Dentists</h1>
        <p className="mt-2 text-on-surface-variant">Add, edit, and organize dentist profiles across hospitals.</p>
      </header>

      {loading ? <p>Loading…</p> : null}
      {!loading && err ? <div className="mb-6 text-error">{err}</div> : null}

      <section className="mb-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
        <h2 className="mb-4 text-lg font-bold">{editingId ? "Edit dentist" : "Add dentist"}</h2>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={editingId ? handleUpdate : handleCreate}>
          <label className="text-sm">
            <span className="mb-1 block font-bold text-on-surface-variant">Hospital</span>
            <select
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
              value={form.hospitalId}
              onChange={(e) => setForm((prev) => ({ ...prev, hospitalId: e.target.value }))}
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
            <span className="mb-1 block font-bold text-on-surface-variant">Name</span>
            <input
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-bold text-on-surface-variant">Years of experience</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
              value={form.yearsOfExperience}
              onChange={(e) => setForm((prev) => ({ ...prev, yearsOfExperience: e.target.value }))}
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-bold text-on-surface-variant">Expertise</span>
            <input
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
              value={form.areaOfExpertise}
              onChange={(e) => setForm((prev) => ({ ...prev, areaOfExpertise: e.target.value }))}
              required
            />
          </label>
          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={saving || !hospitals.length}
              className="rounded-xl bg-primary px-6 py-2.5 font-bold text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Save changes" : "Create dentist"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="rounded-xl border border-outline-variant/20 px-4 py-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              {editingId ? "Cancel edit" : "Reset"}
            </button>
          </div>
        </form>
      </section>

      <section className="mb-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
        <h2 className="mb-3 text-lg font-bold">Find dentist by name</h2>
        <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleLookup}>
          <input
            className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-primary/30 md:max-w-xl"
            value={lookupName}
            onChange={(e) => setLookupName(e.target.value)}
            placeholder="Type dentist name"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2 font-semibold text-on-primary transition-colors hover:bg-primary/90 md:w-auto"
          >
            Find
          </button>
        </form>
        {lookupErr ? <p className="mt-3 text-sm text-error">{lookupErr}</p> : null}
        {lookupResults.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {lookupResults.slice(0, 8).map((dentist) => (
              <li key={dentist._id} className="rounded-xl bg-surface-container-high p-4 text-sm">
                <p className="font-bold">{dentist.name}</p>
                <p className="text-on-surface-variant">{dentist.areaOfExpertise}</p>
                <p className="text-on-surface-variant">Experience: {dentist.yearsOfExperience} years</p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className="overflow-x-auto rounded-2xl border border-outline-variant/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-high/40 text-xs uppercase tracking-wider text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Expertise</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((dentist) => (
              <tr key={dentist._id}>
                <td className="px-4 py-3 font-medium">{dentist.name}</td>
                <td className="px-4 py-3">{dentist.areaOfExpertise || "—"}</td>
                <td className="px-4 py-3">{dentist.yearsOfExperience ?? 0} yrs</td>
                <td className="px-4 py-3">{dentistHospitalName(dentist)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                      onClick={() => startEdit(dentist)}
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-error/30 bg-error/5 px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10"
                      onClick={() => handleDelete(dentist._id)}
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

export default AdminDentists;
