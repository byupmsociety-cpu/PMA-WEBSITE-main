import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import PaidResourceModal from "@/components/PaidResourceModal";
import PrepShell from "@/components/prep/PrepShell";
import { useAuth } from "@/contexts/AuthContext";
import { PrepContext, usePrepState } from "@/hooks/usePrepState";
import { applyPrepDemo } from "@/lib/prepDemo";
import { findResource } from "@/lib/resourceCatalog";

const ResourcesPage = () => {
  const { user, profile, isBlocked, loading: authLoading } = useAuth();
  const [demoMember] = useState(applyPrepDemo);
  const isPmaMember = demoMember ?? (!!profile?.is_pma_member && !isBlocked);
  const [selectedPaidResource, setSelectedPaidResource] = useState<{ title: string; url: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const prep = usePrepState({
    isMember: isPmaMember,
    isLoggedIn: !!user,
    onOpenPaid: setSelectedPaidResource,
    onOpenAuth: () => setAuthOpen(true),
    ready: !authLoading,
  });

  useEffect(() => {
    const resourceParam = searchParams.get("resource");
    if (!resourceParam) return;
    const match = findResource(resourceParam);
    if (match?.resource.isPaid) {
      setSelectedPaidResource({ title: match.resource.title, url: match.resource.url });
    }
    const next = new URLSearchParams(searchParams);
    next.delete("resource");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrepContext.Provider value={prep}>
      <div className="min-h-screen overflow-x-clip bg-background pb-24 pt-16 text-foreground lg:pb-12">
        <PrepShell />
      </div>

      <PaidResourceModal
        isOpen={!!selectedPaidResource}
        onClose={() => setSelectedPaidResource(null)}
        resourceTitle={selectedPaidResource?.title || ""}
        resourceUrl={selectedPaidResource?.url || ""}
        isAuthenticated={!!user}
        isPmaMember={isPmaMember}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </PrepContext.Provider>
  );
};

export default ResourcesPage;
