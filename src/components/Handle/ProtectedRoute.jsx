import { Navigate } from "react-router-dom";
import {
  isAuthenticated,
  getCurrentRole,
  getToken,
  parseJWT,
} from "../../lib/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const authed = isAuthenticated();
  const token = getToken();
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
