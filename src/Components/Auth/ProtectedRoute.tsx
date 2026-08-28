import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../Store/Store.ts";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
