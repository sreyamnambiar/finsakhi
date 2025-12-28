import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import CourseDetail from "./pages/CourseDetail";
import Quiz from "./pages/Quiz";
import Simulations from "./pages/Simulations";
import VoiceAssistant from "./pages/VoiceAssistant";
import NotFound from "./pages/NotFound";
import Livelihoods from "./pages/Livelihoods";
import { FloatingChatbot } from "@/components/FloatingChatbot";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { settings } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language, i18n]);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/learn/:courseId" element={<CourseDetail />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/livelihoods" element={<Livelihoods />} />
      <Route path="/practice" element={<Dashboard />} />
      <Route path="/simulations" element={<Simulations />} />
      <Route path="/voice" element={<VoiceAssistant />} />
      <Route path="/schemes" element={<Dashboard />} />
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
        <FloatingChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
