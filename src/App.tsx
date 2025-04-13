
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PatientProvider } from "@/contexts/PatientContext";
import { TherapistProvider } from "@/contexts/TherapistContext";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Records from "./pages/Records";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TherapistProfile from "./pages/TherapistProfile";
import TherapistRegistration from "./pages/TherapistRegistration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TherapistProvider>
      <PatientProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/records" element={<Records />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<TherapistProfile />} />
              <Route path="/register" element={<TherapistRegistration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PatientProvider>
    </TherapistProvider>
  </QueryClientProvider>
);

export default App;
