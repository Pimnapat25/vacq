import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../data/mockData";

function LoginScreen() {
  const navigate = useNavigate();
  const { user, loading: authLoading, login: apiLogin, register: apiRegister } = useAuth();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    navigate(user.role === "admin" ? "/admin/dashboard" : "/patient/dashboard", { replace: true });
  }, [authLoading, user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let u;
      if (tab === "signup") {
        u = await apiRegister({ name, email, password, tel });
      } else {
        u = await apiLogin({ email, password });
      }
      const role = u?.role;
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/patient/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface font-public">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-public text-on-surface selection:bg-primary-fixed selection:text-primary-fixed">
      <main className="relative flex flex-grow items-center justify-center overflow-hidden p-6">
        <div className="absolute left-[-5%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full bg-sanctuary-tertiary/5 blur-[120px]" />

        <div className="grid w-full max-w-[1100px] grid-cols-1 gap-0 overflow-hidden rounded-3xl bg-surface-container-lowest shadow-[0_10px_40px_rgba(25,28,30,0.06)] lg:grid-cols-12">
          <div className="relative hidden flex-col justify-between bg-primary p-12 text-on-primary lg:col-span-5 lg:flex">
            <div className="z-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shield_with_heart
                </span>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight">VacQ</h1>
              </div>
              <h2 className="mb-4 font-headline text-5xl font-bold leading-tight">The Vaccination Queue System</h2>
              <p className="max-w-xs text-lg leading-relaxed text-on-primary-container/80">
                Securely schedule and manage your clinical appointments with verified healthcare professionals.
              </p>
            </div>
            <div className="z-10 mt-12">
              <div className="mb-4 flex -space-x-3">
                {login.heroAvatars.map((src) => (
                  <img key={src} className="h-10 w-10 rounded-full border-2 border-primary object-cover" alt="" src={src} />
                ))}
              </div>
              <p className="text-sm font-medium opacity-90">Joined by 2,400+ healthcare professionals today.</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-90" />
            <img alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay" src={login.heroImage} />
          </div>

          <div className="col-span-1 flex flex-col justify-center p-8 lg:col-span-7 lg:p-16">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-10 text-center lg:text-left">
                <h3 className="mb-2 font-headline text-3xl font-extrabold text-on-surface">Welcome Back</h3>
                <p className="font-medium text-on-surface-variant">Use your account. New users can register below.</p>
              </div>

              <div className="mb-8 flex rounded-xl bg-surface-container-low p-1">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
                    tab === "login" ? "bg-surface-container-lowest text-primary shadow-sm" : "font-medium text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className={`flex-1 rounded-xl py-2.5 text-sm transition-all ${
                    tab === "signup" ? "bg-surface-container-lowest font-bold text-primary shadow-sm" : "font-medium text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {error ? (
                <div className="mb-4 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
                  {error}
                </div>
              ) : null}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {tab === "signup" ? (
                  <>
                    <div className="space-y-2">
                      <label className="ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="name">
                        Full name
                      </label>
                      <input
                        id="name"
                        className="text-well w-full rounded-t-lg px-4 py-3 font-medium"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="tel">
                        Phone (9–10 digits)
                      </label>
                      <input
                        id="tel"
                        className="text-well w-full rounded-t-lg px-4 py-3 font-medium"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                      />
                    </div>
                  </>
                ) : null}
                <div className="space-y-2">
                  <label className="ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">
                    Email Address
                  </label>
                  <div className="text-well group flex items-center gap-3 rounded-t-lg px-4 py-3">
                    <span className="material-symbols-outlined text-outline transition-colors group-focus-within:text-primary">mail</span>
                    <input
                      className="w-full border-none bg-transparent font-medium text-on-surface placeholder:text-outline/50 focus:ring-0"
                      id="email"
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">
                    Password
                  </label>
                  <div className="text-well group flex items-center gap-3 rounded-t-lg px-4 py-3">
                    <span className="material-symbols-outlined text-outline transition-colors group-focus-within:text-primary">lock</span>
                    <input
                      className="w-full border-none bg-transparent font-medium text-on-surface placeholder:text-outline/50 focus:ring-0"
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete={tab === "signup" ? "new-password" : "current-password"}
                    />
                  </div>
                </div>
                <button
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-container py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Please wait…" : tab === "signup" ? "Create account" : "Enter the Website"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <footer className="p-8 text-center">
        <p className="text-[10px] font-medium text-on-surface-variant/40">API base: {import.meta.env.VITE_API_URL || "/api/v1"} (see .env.example)</p>
      </footer>
    </div>
  );
}

export default LoginScreen;
