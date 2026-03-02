import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UsersRolesPanel from "@/components/admin/UsersRolesPanel";
import ApprovedEmailsPanel from "@/components/admin/ApprovedEmailsPanel";

const AdminAccessPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const currentTab = searchParams.get("tab") === "emails" ? "emails" : "users";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Access & Membership</h1>
            <p className="text-muted-foreground text-sm">
              Manage who can sign up for PMA and what access each user has.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin")}
          >
            Back to Admin
          </Button>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users &amp; Roles</TabsTrigger>
            <TabsTrigger value="emails">Pre-approved Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersRolesPanel />
          </TabsContent>

          <TabsContent value="emails">
            <ApprovedEmailsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAccessPage;

