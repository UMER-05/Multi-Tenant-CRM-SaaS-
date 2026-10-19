import { useAuth } from "./AuthContext.jsx";
import { Navigate } from "react-router-dom";
import Loader from "../components/loader.jsx";
export default function RoleGuard({ roles, children }) {
  const { user, loading } = useAuth();
{/* */}
  // if (!loading) {
  //   return children;
  // }
  if (!user) return <Navigate to="/login"  />;

  if (!roles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
}
