import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Solutions from "./pages/Solutions";
import AboutNew from "./pages/AboutNew";
import Projects from "./pages/Projects";
import Support from "./pages/Support";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PartnersDashboard from "./pages/PartnersDashboard";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import Calculators from "./pages/Calculators";
import REIS from "./pages/REIS";
import DataAI from "./pages/DataAI";
import LMS from "./pages/LMS";
import Partners from "./pages/Partners";
import BecomeAPartner from "./pages/BecomeAPartner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/about" element={<AboutNew />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/support" element={<Support />} />
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/reis" element={<REIS />} />
          <Route path="/data-and-ai" element={<DataAI />} />
          <Route path="/lms" element={<LMS />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/partners-dashboard" element={<PartnersDashboard />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/become-a-partner" element={<BecomeAPartner />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
