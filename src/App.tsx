import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import HomePage from "./pages/HomePage";
import TeamPage from "./pages/TeamPage";
import ResourcesPage from "./pages/ResourcesPage";
import EventsPage from "./pages/EventsPage";
import ContactPage from "./pages/ContactPage";
import DiscoverPage from "./pages/DiscoverPage";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import RouteMeta from "./components/RouteMeta";
import GamePage from './pages/GamePage';
import AuthPage from "./pages/AuthPage";
import DashboardRoute from "./components/DashboardRoute";
import HackathonPage from "./pages/HackathonPage";
import HackathonSharePage from "./pages/HackathonSharePage";
import HackathonFAQPage from "./pages/HackathonFAQPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminTeamPage from "./pages/AdminTeamPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminResourcesPage from "./pages/AdminResourcesPage";
import BlockedPage from "./pages/BlockedPage";
import AdminAccessPage from "./pages/AdminAccessPage";

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
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/hackathon" element={<HackathonPage />} />
              <Route path="/hackathon/share" element={<HackathonSharePage />} />
              <Route path="/hackathon/faq" element={<HackathonFAQPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardRoute />} />
              <Route path="/blocked" element={<BlockedPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/access" element={<AdminAccessPage />} />
              <Route path="/admin/team" element={<AdminTeamPage />} />
              <Route path="/admin/events" element={<AdminEventsPage />} />
              <Route path="/admin/resources" element={<AdminResourcesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
