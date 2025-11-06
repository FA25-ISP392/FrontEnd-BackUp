import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentRole } from "../../lib/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const authed = isAuthenticated();
  const role = getCurrentRole();

  if (!authed) return <Navigate to="/" replace />;

  if (allowedRoles?.length) {
    const ok =
      role &&
      allowedRoles
        .map((r) => r.toUpperCase())
        .includes(String(role).toUpperCase());
    if (!ok) return <Navigate to="/" replace />;
  }
  return children;
}
