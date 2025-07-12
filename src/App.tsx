
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotificationDemo from "./pages/NotificationDemo";
import MedicationRecords from "./pages/MedicationRecords";
import NotFound from "./pages/NotFound";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { isFirstTimeUser } from "./hooks/useOnboardingState";

const queryClient = new QueryClient();

const App = () => {
  const firstTime = isFirstTimeUser();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Onboarding route for first-time users */}
            <Route 
              path="/" 
              element={firstTime ? <OnboardingFlow /> : <Navigate to="/app" replace />} 
            />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            
            {/* Main app routes */}
            <Route path="/app" element={<Index />} />
            <Route path="/demo" element={<NotificationDemo />} />
            <Route path="/medication-records" element={<MedicationRecords />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
