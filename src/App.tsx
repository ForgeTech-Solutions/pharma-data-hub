import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ApiExplorer from "./pages/ApiExplorer";
import Actualites from "./pages/Actualites";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DashboardStats from "./pages/DashboardStats";
import DashboardPack from "./pages/DashboardPack";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardPassword from "./pages/DashboardPassword";
import DashboardDelete from "./pages/DashboardDelete";
import DashboardTokens from "./pages/DashboardTokens";
import DashboardApiKeys from "./pages/DashboardApiKeys";
import PageTransition from "./components/PageTransition";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import ConditionsUtilisation from "./pages/ConditionsUtilisation";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/docs" element={<ApiExplorer />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/stats" element={<DashboardStats />} />
        <Route path="/dashboard/pack" element={<DashboardPack />} />
        <Route path="/dashboard/api-keys" element={<DashboardApiKeys />} />
        <Route path="/dashboard/profile" element={<DashboardProfile />} />
        <Route path="/dashboard/password" element={<DashboardPassword />} />
        <Route path="/dashboard/delete" element={<DashboardDelete />} />
        <Route path="/dashboard/tokens" element={<DashboardTokens />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
