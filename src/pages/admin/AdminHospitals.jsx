import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/index.js";
import AdminAppShell from "../../layouts/AdminAppShell";

const emptyForm = {
  name: "",
  address: "",
  district: "",
  province: "",
  postalcode: "",
  tel: "",
  region: ""
};

function AdminHospitals() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setErr("");
    try {
      const res = await api.listHospitals({ limit: 100, sort: "name" });
      setRows(res.data ?? []);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(h) {
    setEditingId(h._id);
    setEditForm({
      name: h.name || "",
      address: h.address || "",
      district: h.district || "",
      province: h.province || "",
      postalcode: h.postalcode || "",
      tel: h.tel || "",
      region: h.region || ""
    });
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createHospital(createForm);
      setCreateForm(emptyForm);
      await load();
    } catch (e) {
      alert(e.message || "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      await api.updateHospital(editingId, editForm);
      setEditingId(null);
      setEditForm(emptyForm);
      await load();
    } catch (e) {
      alert(e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this hospital and related appointments?")) return;
    try {
      await api.deleteHospital(id);
      await load();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  const filteredRows = rows.filter((h) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (h.name || "").toLowerCase().includes(q) ||
      (h.province || "").toLowerCase().includes(q) ||
      (h.tel || "").toLowerCase().includes(q)
    );
  });

  return (
    <AdminAppShell>
      <header className="mb-8">
        <h1 className="font-headline text-3xl font-extrabold text-on-surface">Hospitals</h1>
        <p className="mt-2 text-on-surface-variant">Create, update, and manage hospital information in one place.</p>
      </header>

      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <div className="text-error">{err}</div>
      ) : null}

      <section className="mb-10 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
        <h2 className="mb-4 font-bold">Add hospital</h2>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleCreate}>
          {Object.keys(emptyForm).map((key) => (
            <label key={key} className="text-sm">
              <span className="mb-1 block font-bold capitalize text-on-surface-variant">{key}</span>
              <input
                className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
                value={createForm[key]}
                onChange={(e) => setCreateForm((f) => ({ ...f, [key]: e.target.value }))}
                required={key === "name" || key === "address" || key === "province"}
              />
            </label>
          ))}
          <div className="flex flex-wrap items-end gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-6 py-2.5 font-bold text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create hospital"}
            </button>
          </div>
        </form>
      </section>

      <section className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-4">
        <label className="text-sm">
          <span className="mb-1 block font-bold text-on-surface-variant">Search hospitals</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, province, or tel"
            className="w-full min-w-72 rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
          />
        </label>
      </section>

      <div className="overflow-x-auto rounded-2xl border border-outline-variant/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-high/40 text-xs uppercase tracking-wider text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Province</th>
              <th className="px-4 py-3">Tel</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {filteredRows.map((h) => (
              <tr key={h._id}>
                <td className="px-4 py-3 font-medium">{h.name}</td>
                <td className="px-4 py-3">{h.province}</td>
                <td className="px-4 py-3">{h.tel}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                      to={`/admin/hospitals/${h._id}/dentists`}
                    >
                      <span className="material-symbols-outlined text-sm">medical_services</span>
                      Dentists
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                      onClick={() => startEdit(h)}
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-error/30 bg-error/5 px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10"
                      onClick={() => handleDelete(h._id)}
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
        {!loading && filteredRows.length === 0 ? (
          <p className="p-4 text-sm text-on-surface-variant">No hospitals match your search.</p>
        ) : null}
      </div>

      {editingId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-headline text-2xl font-extrabold text-on-surface">Edit hospital</h2>
              <button
                type="button"
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                onClick={() => {
                  setEditingId(null);
                  setEditForm(emptyForm);
                }}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleUpdate}>
              {Object.keys(emptyForm).map((key) => (
                <label key={key} className="text-sm">
                  <span className="mb-1 block font-bold capitalize text-on-surface-variant">{key}</span>
                  <input
                    className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 focus:ring-2 focus:ring-primary/30"
                    value={editForm[key]}
                    onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                    required={key === "name" || key === "address" || key === "province"}
                  />
                </label>
              ))}
              <div className="flex flex-wrap items-end gap-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-6 py-2.5 font-bold text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-outline-variant/20 px-4 py-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                  onClick={() => {
                    setEditingId(null);
                    setEditForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminAppShell>
  );
}

export default AdminHospitals;
