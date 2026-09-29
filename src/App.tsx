import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import HomePage from "./pages/HomePage";
import TeamPage from "./pages/TeamPage";
import ResourcesPage from "./pages/ResourcesPage";
import EventsPage from "./pages/EventsPage";
import ContactPage from "./pages/ContactPage";
import StudentsPage from "./pages/StudentsPage";
import CompaniesPage from "./pages/CompaniesPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import RouteMeta from "./components/RouteMeta";
import GamePage from './pages/GamePage';
import AuthPage from "./pages/AuthPage";
import HackathonPage from "./pages/HackathonPage";
import HackathonSharePage from "./pages/HackathonSharePage";
import HackathonFAQPage from "./pages/HackathonFAQPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminTeamPage from "./pages/AdminTeamPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminResourcesPage from "./pages/AdminResourcesPage";
import BlockedPage from "./pages/BlockedPage";
import AdminAccessPage from "./pages/AdminAccessPage";
import AdminJobsPage from "./pages/AdminJobsPage";
import RoadmapPage from "./pages/RoadmapPage";
import AdminResumesPage from "./pages/AdminResumesPage";
import AdminInterviewsPage from "./pages/AdminInterviewsPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import AppLayout from "./components/layout/AppLayout";
import PublicLayout from "./components/layout/PublicLayout";
import MeetingPresentationPage from "./pages/MeetingPresentationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <RouteMeta />
            <Routes>
              {/* Public Marketing Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/hackathon" element={<HackathonPage />} />
                <Route path="/hackathon/share" element={<HackathonSharePage />} />
                <Route path="/hackathon/faq" element={<HackathonFAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/discover" element={<Navigate to="/students" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/blocked" element={<BlockedPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/meeting" element={<MeetingPresentationPage />} />
                <Route path="/events" element={<EventsPage />} />
                {/* Members-only: ResourcesPage gates itself on is_pma_member */}
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Retired member-portal pages. Logging in now only unlocks /resources,
                  so these redirect there. The page components are kept in src/pages
                  and can be restored by pointing a route back at them. */}
              {["/dashboard", "/jobs", "/members", "/tracker", "/interviews", "/resumes", "/preferences", "/profile"].map((path) => (
                <Route key={path} path={path} element={<Navigate to="/resources" replace />} />
              ))}

              {/* Admin Portal Routes */}
              <Route element={<AppLayout />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/access" element={<AdminAccessPage />} />
                <Route path="/admin/team" element={<AdminTeamPage />} />
                <Route path="/admin/events" element={<AdminEventsPage />} />
                <Route path="/admin/resources" element={<AdminResourcesPage />} />
                <Route path="/admin/jobs" element={<AdminJobsPage />} />
                <Route path="/admin/resumes" element={<AdminResumesPage />} />
                <Route path="/admin/interviews" element={<AdminInterviewsPage />} />
                <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
              </Route>

              <Route path="/game" element={<GamePage />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
