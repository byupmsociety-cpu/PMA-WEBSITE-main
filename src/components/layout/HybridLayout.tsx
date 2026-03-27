import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "./AppLayout";
import PublicLayout from "./PublicLayout";
import { Loader2 } from "lucide-react";

/**
 * HybridLayout dynamically chooses which layout wrapper to render
 * based on the user's authentication state.
 * 
 * If a user is not signed in, they see the site like a public visitor (PublicLayout).
 * If a user is signed in, they see the app like a web portal (AppLayout).
 */
const HybridLayout = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <AppLayout /> : <PublicLayout />;
};

export default HybridLayout;
