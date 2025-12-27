import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { settings } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language, i18n]);

  if (!settings.hasCompletedOnboarding) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/learn" element={<Dashboard />} />
      <Route path="/practice" element={<Dashboard />} />
      <Route path="/schemes" element={<Dashboard />} />
      <Route path="/tutor" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
