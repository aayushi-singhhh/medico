import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const DoctorProfileCompletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    license: "",
    specialization: "",
    phone: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userData, refreshUserData } = useAuth();

  useEffect(() => {
    // Redirect if not logged in or not a doctor
    if (!user || !userData) {
      navigate("/login?role=doctor");
      return;
    }

    if (userData.role !== "doctor") {
      navigate("/login?role=doctor");
      return;
    }

    // If profile is already complete, redirect to dashboard
    if (userData.license && userData.specialization) {
      navigate("/doctor-dashboard");
      return;
    }

    // Pre-fill form with existing data
    setFormData({
      license: userData.license || "",
      specialization: userData.specialization || "",
      phone: userData.phone || ""
    });
  }, [user, userData, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update user profile in Firestore
      await updateDoc(doc(db, "users", user!.uid), {
        license: formData.license,
        specialization: formData.specialization,
        phone: formData.phone,
        profileCompleted: true,
        updatedAt: new Date().toISOString()
      });

      // Refresh user data in context
      await refreshUserData();

      toast({
        title: "Profile completed!",
        description: "Welcome to your doctor dashboard.",
      });

      // Navigate to doctor dashboard
      navigate("/doctor-dashboard");
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md bg-white shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Complete Your Doctor Profile
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please provide your medical credentials to access the doctor dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="license" className="text-sm font-medium text-gray-700">
                Medical License Number *
              </Label>
              <Input 
                id="license" 
                name="license"
                placeholder="e.g., MD123456789" 
                required 
                value={formData.license}
                onChange={handleInputChange}
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                Enter your state medical license number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">
                Medical Specialization *
              </Label>
              <Input 
                id="specialization" 
                name="specialization"
                placeholder="e.g., Cardiology, Pediatrics, Internal Medicine" 
                required 
                value={formData.specialization}
                onChange={handleInputChange}
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                Your primary area of medical practice
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input 
                id="phone" 
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000" 
                value={formData.phone}
                onChange={handleInputChange}
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                Optional: For patient communication
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Information Security
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your medical credentials are encrypted and stored securely. This information 
                    is used to verify your professional status and provide appropriate access.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
              disabled={isLoading}
            >
              {isLoading ? "Completing Profile..." : "Complete Profile & Continue"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact support at support@medico.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfileCompletion;
