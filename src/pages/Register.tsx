import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Stethoscope } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    license: "",
    specialization: ""
  });
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "patient";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userData } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && userData) {
      if (userData.role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/doctor-dashboard");
      }
    }
  }, [user, userData, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Prepare user data for Firestore
      const userData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: role,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
        uid: user.uid,
        authProvider: "email"
      };

      // Add role-specific data
      if (role === "doctor") {
        userData.license = formData.license;
        userData.specialization = formData.specialization;
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      toast({
        title: "Registration successful!",
        description: "Your account has been created. Please log in.",
      });

      // Navigate to login page
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Role-specific imagery */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <Tabs defaultValue={defaultRole} className="w-full max-w-md">
            <TabsContent value="patient" className="space-y-6">
              <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <UserCircle className="w-16 h-16" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Join as Patient</h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  Take control of your health journey with our comprehensive digital healthcare platform.
                </p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Secure medical record storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>AI-powered health insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Easy appointment scheduling</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="doctor" className="space-y-6">
              <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Stethoscope className="w-16 h-16" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Join as Doctor</h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  Enhance your medical practice with our advanced diagnostic and patient management tools.
                </p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Advanced diagnostic tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Patient management system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>AI-assisted consultations</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Join our healthcare platform
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={defaultRole} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="patient" className="flex items-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <UserCircle className="w-4 h-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Stethoscope className="w-4 h-4" />
                  Doctor
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="patient" className="space-y-6 mt-6">
                <GoogleAuthButton 
                  role="patient" 
                  isLoading={isLoading} 
                  setIsLoading={setIsLoading}
                  mode="register"
                />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or register with email</span>
                  </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, "patient")} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-first-name" className="text-sm font-medium text-gray-700">First Name</Label>
                      <Input 
                        id="patient-first-name" 
                        name="firstName"
                        placeholder="John" 
                        required 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-last-name" className="text-sm font-medium text-gray-700">Last Name</Label>
                      <Input 
                        id="patient-last-name" 
                        name="lastName"
                        placeholder="Doe" 
                        required 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input 
                      id="patient-email" 
                      name="email"
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <Input 
                      id="patient-phone" 
                      name="phone"
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      required 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input 
                      id="patient-password" 
                      name="password"
                      type="password" 
                      required 
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Register as Patient"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="doctor" className="space-y-6 mt-6">
                <GoogleAuthButton 
                  role="doctor" 
                  isLoading={isLoading} 
                  setIsLoading={setIsLoading}
                  mode="register"
                />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or register with email</span>
                  </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, "doctor")} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-first-name" className="text-sm font-medium text-gray-700">First Name</Label>
                      <Input 
                        id="doctor-first-name" 
                        name="firstName"
                        placeholder="Dr. Jane" 
                        required 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-last-name" className="text-sm font-medium text-gray-700">Last Name</Label>
                      <Input 
                        id="doctor-last-name" 
                        name="lastName"
                        placeholder="Smith" 
                        required 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input 
                      id="doctor-email" 
                      name="email"
                      type="email" 
                      placeholder="doctor@hospital.com" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <Input 
                      id="doctor-phone" 
                      name="phone"
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      required 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-license" className="text-sm font-medium text-gray-700">Medical License</Label>
                    <Input 
                      id="doctor-license" 
                      name="license"
                      placeholder="License Number" 
                      required 
                      value={formData.license}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-specialization" className="text-sm font-medium text-gray-700">Specialization</Label>
                    <Input 
                      id="doctor-specialization" 
                      name="specialization"
                      placeholder="e.g., Cardiology" 
                      required 
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input 
                      id="doctor-password" 
                      name="password"
                      type="password" 
                      required 
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Register as Doctor"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to={`/login?role=${defaultRole}`} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline block">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
