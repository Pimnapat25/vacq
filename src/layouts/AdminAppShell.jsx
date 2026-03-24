import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Single admin-area layout: shared header + sidebar for dashboard and registry. */
const MAIN_NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/registry", label: "Appointments registry", icon: "group" },
  { to: "/admin/hospitals", label: "Hospitals", icon: "local_hospital" },
  { to: "/admin/dentists", label: "Dentists", icon: "medical_services" }
];

function AdminAppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  const displayName = user?.name ?? "Admin";
  const role = user?.role ?? "";

  return (
    <div className="min-h-screen bg-surface font-inter text-on-surface antialiased">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest px-4 shadow-sm dark:bg-slate-950 md:px-8">
        <div className="min-w-0">
          <h1 className="font-headline text-lg font-black tracking-tight text-blue-800 dark:text-blue-300">VacQ</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Administration</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button type="button" className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <div className="hidden h-8 w-px bg-outline-variant md:block" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold leading-none text-on-surface">{displayName}</p>
              <p className="text-xs text-on-surface-variant">{role}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-primary/10 font-bold text-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 flex-col border-r border-outline-variant/10 bg-surface-container-low py-6 pl-4 dark:bg-slate-900/90 md:flex">
        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Main</p>
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-l-full px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "translate-x-0.5 bg-surface-container-lowest text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-400"
                    : "text-slate-600 hover:bg-surface-container-high/80 dark:text-slate-400 dark:hover:bg-slate-800"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="mt-auto border-t border-outline-variant/10 p-4 pr-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/20 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-20 sm:px-6 md:ml-64 md:max-w-none md:px-8 md:pb-12 md:pt-24 lg:px-12">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl border-t border-outline-variant/10 bg-surface-container-lowest/95 px-2 pb-4 pt-2 shadow-[0_-8px_32px_rgba(25,28,30,0.06)] backdrop-blur-xl dark:bg-slate-900/95 md:hidden">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-1 py-2 transition-all ${
              isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" : "text-slate-400 dark:text-slate-500"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-bold">Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/dentists"
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-1 py-2 transition-all ${
              isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" : "text-slate-400 dark:text-slate-500"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">medical_services</span>
          <span className="text-[10px] font-medium">Dentists</span>
        </NavLink>
        <NavLink
          to="/admin/hospitals"
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-1 py-2 transition-all ${
              isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" : "text-slate-400 dark:text-slate-500"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">local_hospital</span>
          <span className="text-[10px] font-medium">Hospitals</span>
        </NavLink>
        <NavLink
          to="/admin/registry"
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-1 py-2 transition-all ${
              isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" : "text-slate-400 dark:text-slate-500"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">group</span>
          <span className="text-[10px] font-medium">Registry</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default AdminAppShell;
