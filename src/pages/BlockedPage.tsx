import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const BlockedPage = () => {
  const navigate = useNavigate();
  const { user, isBlocked } = useAuth();

  useEffect(() => {
    // If user is no longer blocked (e.g. admin unblocked them while they were on this page),
    // send them back to the dashboard.
    if (user && !isBlocked) {
      navigate("/dashboard");
    }
  }, [user, isBlocked, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: "local" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-xl mx-auto">
        <Card className="border-destructive/40">
          <CardHeader className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">Account Access Restricted</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your PMA account has been blocked by an administrator. You can no longer access the
                dashboard or member resources with this account.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you believe this is a mistake or want to appeal the decision, please reach out to PMA
              leadership using the contact form.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => navigate("/contact")}
              >
                Contact PMA
              </Button>
              <Button
                variant="destructive"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlockedPage;

