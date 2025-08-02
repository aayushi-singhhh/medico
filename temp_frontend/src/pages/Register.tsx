import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Stethoscope, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    license: "",
    specialization: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (name === "password") {
      setPasswordError("");
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setConfirmPasswordError("Passwords don't match");
      } else {
        setConfirmPasswordError("");
      }
    }
    
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setConfirmPasswordError("Passwords don't match");
      } else {
        setConfirmPasswordError("");
      }
    }
    
    if (name === "phone") {
      setPhoneError("");
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    return true;
  };
  
  const validatePhone = (phone: string) => {
    // Simple validation - can be enhanced with country-specific patterns
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault();
    
    // Validate form
    if (!validatePassword(formData.password)) {
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      return;
    }
    
    if (!agreeToTerms) {
      toast({
        title: "Terms required",
        description: "You must agree to the terms of service",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);

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
        description: "Please check your email to verify your account before logging in.",
      });

      // Navigate to login page
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? "This email is already registered. Please log in or use a different email."
        : error.message;
        
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd2e?auto=format&fit=crop&w=900&q=80" alt="Register Healthcare" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-blue-700 to-purple-900 opacity-80"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Join Medico</h2>
          <p className="text-lg opacity-90 mb-8 max-w-md">Create your account and experience next-gen healthcare for patients and doctors.</p>
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
                    <div className="relative">
                      <Input 
                        id="patient-password" 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${passwordError ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <Input 
                      id="patient-confirm-password" 
                      name="confirmPassword"
                      type="password" 
                      required 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${confirmPasswordError ? "border-red-500" : ""}`}
                    />
                    {confirmPasswordError && (
                      <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="terms" 
                      checked={agreeToTerms} 
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
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
                    <div className="relative">
                      <Input 
                        id="doctor-password" 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${passwordError ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <Input 
                      id="doctor-confirm-password" 
                      name="confirmPassword"
                      type="password" 
                      required 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${confirmPasswordError ? "border-red-500" : ""}`}
                    />
                    {confirmPasswordError && (
                      <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="terms" 
                      checked={agreeToTerms} 
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
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