import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardPage from "@/pages/DashboardPage";

/**
 * Route wrapper: super admins go to /admin, everyone else sees the PM dashboard.
 * Using Navigate instead of useEffect prevents redirect loops and flashing.
 */
export default function DashboardRoute() {
  const { isSuperAdmin, isBlocked, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isBlocked) {
    return <Navigate to="/blocked" replace />;
  }

  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <DashboardPage />;
}
