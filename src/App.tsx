import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfileCompletion from "./pages/DoctorProfileCompletion";
import UploadReport from "./pages/UploadReport";
import PredictionResults from "./pages/PredictionResults";
import SimplePrediction from "./pages/SimplePrediction";
import MedicalHistory from "./pages/MedicalHistory";
import NearbyServicesPage from "./pages/NearbyServicesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient-dashboard" element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor-profile-completion" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorProfileCompletion />
            </ProtectedRoute>
          } />
          <Route path="/upload-report" element={
            <ProtectedRoute>
              <UploadReport />
            </ProtectedRoute>
          } />
          <Route path="/prediction-results" element={
            <ProtectedRoute>
              <PredictionResults />
            </ProtectedRoute>
          } />
          <Route path="/simple-prediction" element={
            <ProtectedRoute>
              <SimplePrediction />
            </ProtectedRoute>
          } />
          <Route path="/medical-history" element={
            <ProtectedRoute>
              <MedicalHistory />
            </ProtectedRoute>
          } />
          <Route path="/nearby-services" element={
            <ProtectedRoute>
              <NearbyServicesPage />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
