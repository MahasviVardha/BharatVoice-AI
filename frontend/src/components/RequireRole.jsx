import { Navigate } from "react-router-dom";

/** Route guard: redirects away if the logged-in user's role isn't in `roles`. admin always passes. */
export default function RequireRole({ roles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/role-select" replace />;
  }
  if (role !== "admin" && !roles.includes(role)) {
    return <Navigate to={role === "employee" ? "/employee/dashboard" : "/dashboard"} replace />;
  }
  return children;
}
