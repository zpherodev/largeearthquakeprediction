
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

// Pages
import Index from "./pages/Index";
import MagneticData from "./pages/MagneticData";
import Predictions from "./pages/Predictions";
import Map from "./pages/Map";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Index />
            </Layout>
          } />
          <Route path="/magnetic-data" element={
            <Layout>
              <MagneticData />
            </Layout>
          } />
          <Route path="/predictions" element={
            <Layout>
              <Predictions />
            </Layout>
          } />
          <Route path="/map" element={
            <Layout>
              <Map />
            </Layout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
