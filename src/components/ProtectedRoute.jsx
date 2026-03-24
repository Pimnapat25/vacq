import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * @param {object} props
 * @param {'admin' | 'user' | 'any'} [props.role='any'] - admin: admin only; user: non-admin or any logged-in for patient area use 'any'
 */
function ProtectedRoute({ children, role = "any" }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface font-public text-on-surface">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-on-surface-variant">Loading session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role === "admin" && user.role !== "admin") {
    return <Navigate to="/patient/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
