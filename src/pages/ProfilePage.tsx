import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, profile, loading, isGuest, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const roleLabel = profile.role.toUpperCase();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-3xl mx-auto space-y-6">
        {isGuest && (
          <Card className="border-yellow-400/60 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="py-4">
              <p className="text-sm">
                You currently have <span className="font-semibold">guest</span> access.{" "}
                To become a full PMA member user, please email the PMA leadership email or{" "}
                <a
                  href="mailto:justmax@byu.edu"
                  className="underline font-medium"
                >
                  justmax@byu.edu
                </a>{" "}
                using your <span className="font-mono">@byu.edu</span> address.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{profile.full_name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-mono">{profile.email || user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge>{roleLabel}</Badge>
              {profile.is_pma_member && (
                <Badge variant="outline" className="ml-1">
                  PMA Member
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
          {(isAdmin || isSuperAdmin) && (
            <Button onClick={() => navigate("/admin")}>
              Open Admin Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

