import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegionProvider } from "@/contexts/RegionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import '@/i18n/config'; // Initialize i18n synchronously
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
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Calculators from "./pages/Calculators";
import REIS from "./pages/REIS";
import News from "./pages/News";
import Events from "./pages/Events";
import CaseStudies from "./pages/CaseStudies";
import DataAI from "./pages/DataAI";
import LMS from "./pages/LMS";
import Partners from "./pages/Partners";
import BecomeAPartner from "./pages/BecomeAPartner";
import PolicyInstallerNG from "./pages/policy/PolicyInstallerNG";
import PolicyInstallerUK from "./pages/policy/PolicyInstallerUK";
import PolicyMarketplaceNG from "./pages/policy/PolicyMarketplaceNG";
import PolicyMarketplaceUK from "./pages/policy/PolicyMarketplaceUK";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/common/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RegionProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/Solutions" element={<Solutions />} />
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partners-dashboard"
            element={
              <ProtectedRoute requiredRole="partner">
                <PartnersDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/partners" element={<Partners />} />
          <Route path="/become-a-partner" element={<BecomeAPartner />} />
          <Route path="/policy/installer-ng" element={<PolicyInstallerNG />} />
          <Route path="/policy/installer-uk" element={<PolicyInstallerUK />} />
          <Route path="/policy/marketplace-ng" element={<PolicyMarketplaceNG />} />
          <Route path="/policy/marketplace-uk" element={<PolicyMarketplaceUK />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </CartProvider>
    </RegionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
