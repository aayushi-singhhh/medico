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
import { useTranslation } from "react-i18next";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "patient";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const { t } = useTranslation();

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
      console.log("Login attempt with:", { email, role });
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase auth successful:", user.uid);

      // Get user role from Firestore
      console.log("Fetching user document from Firestore...");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      console.log("Firestore response:", userDoc.exists() ? "Document exists" : "No document found");

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
        console.log("User data retrieved:", { role: userRole, firstName: userData.firstName });

        // Check if the selected role matches the user's actual role
        if (userRole === role) {
          toast({
            title: t('auth.loginSuccessful'),
            description: t('auth.welcomeBackUser', { name: userData.firstName }),
          });

          // Navigate to appropriate dashboard
          if (role === "patient") {
            navigate("/patient-dashboard");
          } else {
            navigate("/doctor-dashboard");
          }
        } else {
          toast({
            title: t('auth.accessDenied'),
            description: t('auth.registeredAsRole', { currentRole: t(`roles.${userRole}`), attemptedRole: t(`roles.${role}`) }),
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: t('auth.userDataNotFound'),
          description: t('auth.pleaseContactSupport'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error details:", error);
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = t('auth.invalidCredentials');
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = t('auth.invalidCredentials');
      }
      toast({
        title: t('auth.loginFailed'),
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
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80" alt="Healthcare" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-900 opacity-80"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">{t('auth.welcomeTo')} {t('app.title')}</h2>
          <p className="text-lg opacity-90 mb-8 max-w-md">{t('auth.appDescription')}</p>
        </div>
      </div>
      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md bg-white shadow-2xl rounded-3xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {t('auth.signIn')}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mb-2">
              {t('auth.welcomeBack')} {t('app.title')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultRole} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="patient" className="flex items-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <UserCircle className="w-4 h-4" /> {t('roles.patient')}
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Stethoscope className="w-4 h-4" /> {t('roles.doctor')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="patient" className="space-y-6 mt-6">
                <GoogleAuthButton role="patient" isLoading={isLoading} setIsLoading={setIsLoading} mode="login" />
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
                    <Label htmlFor="patient-email" className="text-sm font-medium text-gray-700">{t('auth.email')}</Label>
                    <Input id="patient-email" type="email" placeholder="patient@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password" className="text-sm font-medium text-gray-700">{t('auth.password')}</Label>
                    <Input id="patient-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" />
                  </div>
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg" disabled={isLoading}>
                    {isLoading ? t('auth.signingIn') : t('auth.signInAs', { role: t('roles.patient') })}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="doctor" className="space-y-6 mt-6">
                <GoogleAuthButton role="doctor" isLoading={isLoading} setIsLoading={setIsLoading} mode="login" />
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
                    <Label htmlFor="doctor-email" className="text-sm font-medium text-gray-700">{t('auth.email')}</Label>
                    <Input id="doctor-email" type="email" placeholder="doctor@hospital.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password" className="text-sm font-medium text-gray-700">{t('auth.password')}</Label>
                    <Input id="doctor-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" />
                  </div>
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg" disabled={isLoading}>
                    {isLoading ? t('auth.signingIn') : t('auth.signInAs', { role: t('roles.doctor') })}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-600">
                {t('auth.noAccount')}{" "}
                <Link to={`/register?role=${defaultRole}`} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  {t('auth.signUp')}
                </Link>
              </p>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline block">
                {t('navigation.home')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;