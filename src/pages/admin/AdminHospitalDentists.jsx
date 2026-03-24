import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "../../api/index.js";
import AdminAppShell from "../../layouts/AdminAppShell";

const emptyDentist = {
  name: "",
  yearsOfExperience: 0,
  areaOfExpertise: ""
};

function AdminHospitalDentists() {
  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [form, setForm] = useState(emptyDentist);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr("");
      try {
        const [hRes, dRes] = await Promise.all([api.getHospital(hospitalId), api.listHospitalDentists(hospitalId)]);
        if (cancelled) return;
        setHospital(hRes.data);
        setDentists(dRes.data ?? []);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hospitalId]);

  async function reloadDentists() {
    const dRes = await api.listHospitalDentists(hospitalId);
    setDentists(dRes.data ?? []);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createDentist(hospitalId, {
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience) || 0
      });
      setForm(emptyDentist);
      await reloadDentists();
    } catch (e) {
      alert(e.message || "Create failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(d) {
    setEditingId(d._id);
    setForm({
      name: d.name,
      yearsOfExperience: d.yearsOfExperience,
      areaOfExpertise: d.areaOfExpertise
    });
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
      setEditingId(null);
      setForm(emptyDentist);
      await reloadDentists();
    } catch (e) {
      alert(e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this dentist?")) return;
    try {
      await api.deleteDentist(id);
      await reloadDentists();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <AdminAppShell>
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-on-surface-variant">
        <Link
          className="mr-2 inline-flex items-center gap-1 rounded-full border border-outline-variant/20 bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          to="/admin/hospitals"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </Link>
        <Link className="hover:text-primary" to="/admin/hospitals">
          Hospitals
        </Link>
        <span>/</span>
        <span className="text-on-surface">{hospital?.name ?? hospitalId}</span>
      </nav>

      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <div className="text-error">{err}</div>
      ) : (
        <>
          <h1 className="mb-6 font-headline text-3xl font-bold">Dentists — {hospital?.name}</h1>

          <section className="mb-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
            <h2 className="mb-4 font-bold">{editingId ? "Edit dentist" : "Add dentist"}</h2>
            <form className="grid gap-4 md:grid-cols-3" onSubmit={editingId ? handleUpdate : handleCreate}>
              <label className="text-sm">
                <span className="mb-1 block font-bold">Name</span>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-bold">Years of experience</span>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
                  value={form.yearsOfExperience}
                  onChange={(e) => setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))}
                />
              </label>
              <label className="text-sm md:col-span-1">
                <span className="mb-1 block font-bold">Expertise</span>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
                  value={form.areaOfExpertise}
                  onChange={(e) => setForm((f) => ({ ...f, areaOfExpertise: e.target.value }))}
                  required
                />
              </label>
              <div className="flex gap-2 md:col-span-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-6 py-2 font-bold text-on-primary shadow-sm transition-colors hover:bg-primary/90"
                >
                  {saving ? "…" : editingId ? "Save" : "Add dentist"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    className="rounded-xl border border-outline-variant/20 px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyDentist);
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <ul className="space-y-3">
            {dentists.map((d) => (
              <li key={d._id} className="flex flex-wrap items-center justify-between rounded-xl bg-surface-container-high px-4 py-3">
                <div>
                  <p className="font-bold">{d.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {d.areaOfExpertise} · {d.yearsOfExperience} yrs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                    onClick={() => startEdit(d)}
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-error/30 bg-error/5 px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10"
                    onClick={() => handleDelete(d._id)}
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {dentists.length === 0 ? <p className="text-on-surface-variant">No dentists yet.</p> : null}
        </>
      )}
    </AdminAppShell>
  );
}

export default AdminHospitalDentists;
