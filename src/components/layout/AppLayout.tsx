import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '../ThemeToggle';
import { Button } from '../ui/button';
import { FeedbackModal } from '../FeedbackModal';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  Briefcase,
  Layers,
  Video,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  Shield,
  Lock,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarGroup = ({ title, children, isCollapsed }: { title: string, children: React.ReactNode, isCollapsed?: boolean }) => (
  <div className="mb-6">
    {!isCollapsed && (
      <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all">
        {title}
      </h3>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const NavItem = ({ 
  to, 
  icon: Icon, 
  children, 
  onClick,
  isCollapsed
}: { 
  to: string; 
  icon: any; 
  children: React.ReactNode;
  onClick?: () => void;
  isCollapsed?: boolean;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      onClick={onClick}
      title={isCollapsed ? children?.toString() : undefined}
      className={cn(
        "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        isCollapsed ? "justify-center" : "gap-3"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
      {!isCollapsed && <span className="truncate">{children}</span>}
    </Link>
  );
};

const AppLayout = () => {
  const { user, profile, isAdmin, isSuperAdmin, isBlocked, isGuest, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const displayName = profile?.full_name?.trim() || user?.user_metadata?.full_name?.trim() || user?.email?.split('@')[0] || 'Account';
  const displayEmail = profile?.email || user?.email || '';
  
  const handleSignOut = () => {
    setMobileMenuOpen(false);
    const reload = () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.includes('-auth-token') || key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      window.location.href = '/';
    };
    const timeout = setTimeout(reload, 2000);
    supabase.auth.signOut({ scope: 'local' }).finally(() => {
      clearTimeout(timeout);
      reload();
    });
  };

  const closeMenu = () => setMobileMenuOpen(false);

  // Reusable Navigation Content
  const NavigationContent = ({ mobile = false }: { mobile?: boolean }) => {
    const collapsed = mobile ? false : isCollapsed;
    
    return (
      <div className="flex h-full flex-col overflow-y-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className={cn("px-4 mb-6 flex items-center", collapsed ? "justify-center px-0 flex-col gap-4 mt-2" : "justify-between mt-2")}>
          <Link to="/" onClick={closeMenu} className="flex items-center px-2">
            {collapsed ? (
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
                P
              </div>
            ) : (
              <img src="/img/pma-logo-transparent.png" alt="PMA Logo" className="h-8 object-contain" />
            )}
          </Link>
          
          {!mobile && (
            <Button 
              title={collapsed ? "Expand Menu" : "Collapse Menu"}
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground h-8 w-8 hover:bg-muted"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 px-3">
          <SidebarGroup title="Home" isCollapsed={collapsed}>
            <NavItem to="/dashboard" icon={LayoutDashboard} onClick={closeMenu} isCollapsed={collapsed}>Dashboard</NavItem>
          </SidebarGroup>

          <SidebarGroup title="Community & Learning" isCollapsed={collapsed}>
            <NavItem to="/events" icon={Calendar} onClick={closeMenu} isCollapsed={collapsed}>Upcoming Events</NavItem>
            <NavItem to="/resources" icon={BookOpen} onClick={closeMenu} isCollapsed={collapsed}>Resource Vault</NavItem>
            <NavItem to="/members" icon={Users} onClick={closeMenu} isCollapsed={collapsed}>Member Directory</NavItem>
          </SidebarGroup>

          <SidebarGroup title="Career Hub" isCollapsed={collapsed}>
            <NavItem to="/jobs" icon={Briefcase} onClick={closeMenu} isCollapsed={collapsed}>Job Board</NavItem>
            <NavItem to="/tracker" icon={Layers} onClick={closeMenu} isCollapsed={collapsed}>Application Tracker</NavItem>
            <NavItem to="/interviews" icon={Video} onClick={closeMenu} isCollapsed={collapsed}>Mock Interviews</NavItem>
            <NavItem to="/resumes" icon={FileText} onClick={closeMenu} isCollapsed={collapsed}>Resume Review</NavItem>
          </SidebarGroup>
          
          <SidebarGroup title="Account" isCollapsed={collapsed}>
            <NavItem to="/profile" icon={User} onClick={closeMenu} isCollapsed={collapsed}>Profile</NavItem>
            <NavItem to="/preferences" icon={Settings} onClick={closeMenu} isCollapsed={collapsed}>Job Preferences</NavItem>
            {(isAdmin || isSuperAdmin) && !isBlocked && (
              <NavItem to="/admin" icon={Shield} onClick={closeMenu} isCollapsed={collapsed}>Admin Dashboard</NavItem>
            )}
          </SidebarGroup>
        </div>

        {/* Bottom Actions Area */}
        <div className="mt-auto px-3 border-t border-border pt-4 flex flex-col gap-2">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("w-full px-2 hover:bg-accent/60 h-auto py-2", collapsed ? "justify-center" : "justify-start")}>
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {displayName ? displayName[0]?.toUpperCase() : <UserCircle className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-medium truncate w-full">{displayName}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">{displayEmail}</span>
                      </div>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side={mobile ? "top" : "right"} className={cn("w-64", mobile ? "mb-2" : "ml-2")}>
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {displayName[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold leading-none truncate">{displayName}</p>
                        {isBlocked && <Badge variant="destructive" className="shrink-0 text-[10px] px-1 h-4">BLOCKED</Badge>}
                      </div>
                      {displayEmail && <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>}
                      {!isBlocked && !isGuest && profile?.is_pma_member ? (
                        <p className="text-[11px] text-muted-foreground">Paying/verified PMA member</p>
                      ) : !isBlocked && isGuest ? (
                        <p className="text-[11px] text-muted-foreground">Free account</p>
                      ) : null}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground px-2">Theme</span>
                  <ThemeToggle />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden border-r border-border bg-card md:flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <NavigationContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <NavigationContent mobile={true} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isCollapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="font-semibold tracking-tight">PMA Portal</span>
          </div>
        </header>

        {/* Global Guest Banner */}
        {isGuest && !authLoading && (
          <div className="border-b border-amber-200 bg-amber-50 p-3 text-xs md:text-sm text-center text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200 flex justify-center items-center gap-2">
            <Lock className="h-4 w-4 shrink-0" />
            You're using a free account. Become a PMA member to unlock premium features and data.
          </div>
        )}

        <main className="flex-1 w-full max-w-7xl mx-auto md:py-6 relative">
          <Outlet />
          {!isGuest && <FeedbackModal />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
