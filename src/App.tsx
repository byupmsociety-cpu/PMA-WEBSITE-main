import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Analytics } from "@vercel/analytics/react";
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
import GamePage from './pages/GamePage';
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HackathonPage from "./pages/HackathonPage";
import HackathonSharePage from "./pages/HackathonSharePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/hackathon" element={<HackathonPage />} />
            <Route path="/hackathon/share" element={<HackathonSharePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
