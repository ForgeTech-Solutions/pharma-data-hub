import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/docs" element={<ApiExplorer />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/stats" element={<DashboardStats />} />
          <Route path="/dashboard/pack" element={<DashboardPack />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
          <Route path="/dashboard/password" element={<DashboardPassword />} />
          <Route path="/dashboard/delete" element={<DashboardDelete />} />
          <Route path="/dashboard/tokens" element={<DashboardTokens />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
