import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Stethoscope } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Check if the selected role matches the user's actual role
        if (userRole === role) {
          toast({
            title: "Login successful!",
            description: `Welcome back, ${userData.firstName}!`,
          });

          // Navigate to appropriate dashboard
          if (role === "patient") {
            navigate("/patient-dashboard");
          } else {
            navigate("/doctor-dashboard");
          }
        } else {
          toast({
            title: "Access denied",
            description: `You are registered as a ${userRole}, not a ${role}.`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "User data not found",
          description: "Please contact support.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <Tabs defaultValue={defaultRole} className="w-full max-w-md">
            <TabsContent value="patient" className="space-y-6">
              <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <UserCircle className="w-16 h-16" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Patient Portal</h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  Access your complete medical history, upload reports, and get AI-powered health insights all in one secure platform.
                </p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Upload medical reports instantly</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>AI disease risk assessment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Complete health timeline</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="doctor" className="space-y-6">
              <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Stethoscope className="w-16 h-16" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Doctor Dashboard</h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  Enhance your practice with AI diagnostic assistance and comprehensive patient management tools.
                </p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>AI diagnostic assistance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Patient management tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Comprehensive reports</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Sign in to your healthcare account
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
                  mode="login"
                />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, "patient")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input 
                      id="patient-email" 
                      type="email" 
                      placeholder="patient@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input 
                      id="patient-password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Patient"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="doctor" className="space-y-6 mt-6">
                <GoogleAuthButton 
                  role="doctor" 
                  isLoading={isLoading} 
                  setIsLoading={setIsLoading}
                  mode="login"
                />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, "doctor")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input 
                      id="doctor-email" 
                      type="email" 
                      placeholder="doctor@hospital.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input 
                      id="doctor-password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Doctor"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to={`/register?role=${defaultRole}`} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Register here
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

export default Login;
