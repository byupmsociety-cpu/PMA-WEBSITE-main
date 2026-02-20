import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboardPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, pre-approved emails, team members, and events.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {isSuperAdmin && (
            <Card className="hover:border-primary/60 transition-colors">
              <CardHeader>
                <CardTitle>Users & Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  View all users and manage their roles and PMA membership status.
                </p>
                <Link
                  to="/admin/users"
                  className="inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Open Users Management
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className="hover:border-primary/60 transition-colors">
            <CardHeader>
              <CardTitle>Pre-approved Emails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Manage the list of BYU emails that are auto-approved as PMA users or admins.
              </p>
              <Link
                to="/admin/approved-emails"
                className="inline-flex text-sm font-medium text-primary hover:underline"
              >
                Manage Pre-approved Emails
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/60 transition-colors">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Edit the PMA team members shown on the public website.
              </p>
              <Link
                to="/admin/team"
                className="inline-flex text-sm font-medium text-primary hover:underline"
              >
                Manage Team
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/60 transition-colors">
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Manage PMA events in Supabase (future replacement for Airtable).
              </p>
              <Link
                to="/admin/events"
                className="inline-flex text-sm font-medium text-primary hover:underline"
              >
                Manage Events
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

