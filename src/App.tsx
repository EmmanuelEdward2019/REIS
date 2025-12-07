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
import '@/i18n/config';
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
import ResidentialSolar from "./pages/reis/ResidentialSolar";
import CommercialSolar from "./pages/reis/CommercialSolar";
import UtilityScale from "./pages/reis/UtilityScale";
import SolarWindHybrid from "./pages/reis/SolarWindHybrid";
import BatterySystems from "./pages/reis/BatterySystems";
import GridStorage from "./pages/reis/GridStorage";
import HydrogenSolutions from "./pages/reis/HydrogenSolutions";
import MicroStorage from "./pages/reis/MicroStorage";
import OffshoreWind from "./pages/reis/OffshoreWind";
import TidalEnergy from "./pages/reis/TidalEnergy";
import WavePower from "./pages/reis/WavePower";
import FloatingSolar from "./pages/reis/FloatingSolar";
import News from "./pages/News";
import Events from "./pages/Events";
import CaseStudies from "./pages/CaseStudies";
import DataAI from "./pages/DataAI";
import AIStrategy from "./pages/data-ai/AIStrategy";
import DataAnalytics from "./pages/data-ai/DataAnalytics";
import MachineLearning from "./pages/data-ai/MachineLearning";
import DataEngineering from "./pages/data-ai/DataEngineering";
import AIProducts from "./pages/data-ai/AIProducts";
import SecuritySolutions from "./pages/data-ai/SecuritySolutions";
import GeospatialAnalytics from "./pages/data-ai/GeospatialAnalytics";
import LMS from "./pages/LMS";
import LMSPlatform from "./pages/lms/LMSPlatform";
import ContentDevelopment from "./pages/lms/ContentDevelopment";
import ProfessionalPrograms from "./pages/lms/ProfessionalPrograms";
import ComplianceTraining from "./pages/lms/ComplianceTraining";
import VocationalTraining from "./pages/lms/VocationalTraining";
import AssessmentTools from "./pages/lms/AssessmentTools";
import AdvisoryServices from "./pages/lms/AdvisoryServices";
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

                {/* REIS Routes */}
                <Route path="/reis" element={<REIS />} />
                <Route path="/reis/residential-solar" element={<ResidentialSolar />} />
                <Route path="/reis/commercial-solar" element={<CommercialSolar />} />
                <Route path="/reis/utility-scale" element={<UtilityScale />} />
                <Route path="/reis/solar-wind-hybrid" element={<SolarWindHybrid />} />
                <Route path="/reis/battery-systems" element={<BatterySystems />} />
                <Route path="/reis/grid-storage" element={<GridStorage />} />
                <Route path="/reis/hydrogen-solutions" element={<HydrogenSolutions />} />
                <Route path="/reis/micro-storage" element={<MicroStorage />} />
                <Route path="/reis/offshore-wind" element={<OffshoreWind />} />
                <Route path="/reis/tidal-energy" element={<TidalEnergy />} />
                <Route path="/reis/wave-power" element={<WavePower />} />
                <Route path="/reis/floating-solar" element={<FloatingSolar />} />

                {/* Data & AI Routes */}
                <Route path="/data-and-ai" element={<DataAI />} />
                <Route path="/data-and-ai/ai-strategy" element={<AIStrategy />} />
                <Route path="/data-and-ai/data-analytics" element={<DataAnalytics />} />
                <Route path="/data-and-ai/machine-learning" element={<MachineLearning />} />
                <Route path="/data-and-ai/data-engineering" element={<DataEngineering />} />
                <Route path="/data-and-ai/ai-products" element={<AIProducts />} />
                <Route path="/data-and-ai/security-solutions" element={<SecuritySolutions />} />
                <Route path="/data-and-ai/geospatial-analytics" element={<GeospatialAnalytics />} />

                {/* LMS Routes */}
                <Route path="/lms" element={<LMS />} />
                <Route path="/lms/lms-platform" element={<LMSPlatform />} />
                <Route path="/lms/content-development" element={<ContentDevelopment />} />
                <Route path="/lms/professional-programs" element={<ProfessionalPrograms />} />
                <Route path="/lms/compliance-training" element={<ComplianceTraining />} />
                <Route path="/lms/vocational-training" element={<VocationalTraining />} />
                <Route path="/lms/assessment-tools" element={<AssessmentTools />} />
                <Route path="/lms/advisory-services" element={<AdvisoryServices />} />

                {/* Shop & Cart */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

                {/* Protected Routes */}
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

                {/* Partners & Policies */}
                <Route path="/partners" element={<Partners />} />
                <Route path="/become-a-partner" element={<BecomeAPartner />} />
                <Route path="/policy/installer-ng" element={<PolicyInstallerNG />} />
                <Route path="/policy/installer-uk" element={<PolicyInstallerUK />} />
                <Route path="/policy/marketplace-ng" element={<PolicyMarketplaceNG />} />
                <Route path="/policy/marketplace-uk" element={<PolicyMarketplaceUK />} />

                {/* News & Updates */}
                <Route path="/news" element={<News />} />
                <Route path="/events" element={<Events />} />
                <Route path="/case-studies" element={<CaseStudies />} />

                {/* 404 - Must be last */}
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
