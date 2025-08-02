import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Create a Google Auth Provider instance
const googleProvider = new GoogleAuthProvider();
import { useNavigate } from "react-router-dom";

interface GoogleAuthButtonProps {
  role: "patient" | "doctor";
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mode: "login" | "register";
}

const GoogleAuthButton = ({ role, isLoading, setIsLoading, mode }: GoogleAuthButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        // User exists - this is a login
        const userData = userDoc.data();
        const userRole = userData.role;

        if (userRole === role) {
          toast({
            title: `Google ${mode} successful!`,
            description: `Welcome back, ${userData.firstName}!`,
          });

          // Navigate based on role and profile completion
          if (role === "patient") {
            navigate("/patient-dashboard");
          } else {
            // Check if doctor profile is complete
            if (userData.license && userData.specialization) {
              navigate("/doctor-dashboard");
            } else {
              navigate("/doctor-profile-completion");
            }
          }
        } else {
          toast({
            title: "Access denied",
            description: `You are registered as a ${userRole}, not a ${role}.`,
            variant: "destructive",
          });
          // Sign out the user since role doesn't match
          await auth.signOut();
        }
      } else {
        // User doesn't exist - this is a registration
        if (mode === "login") {
          toast({
            title: "Account not found",
            description: "Please register first or use the correct login method.",
            variant: "destructive",
          });
          await auth.signOut();
          return;
        }

        // Create new user profile
        const [firstName, ...lastNameParts] = (user.displayName || "").split(" ");
        const lastName = lastNameParts.join(" ");

        const userData: any = {
          firstName: firstName || "Google",
          lastName: lastName || "User",
          email: user.email || "",
          role: role,
          phone: "", // Can be filled later in profile
          createdAt: new Date().toISOString(),
          uid: user.uid,
          authProvider: "google"
        };

        // Add role-specific placeholder data for doctors
        if (role === "doctor") {
          userData.license = ""; // To be filled later
          userData.specialization = ""; // To be filled later
          userData.profileCompleted = false;
        }

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), userData);

        toast({
          title: `Google ${mode} successful!`,
          description: `Welcome, ${firstName}!`,
        });

        // Navigate based on role and completion status
        if (role === "patient") {
          navigate("/patient-dashboard");
        } else {
          // For doctors, redirect to profile completion first
          navigate("/doctor-profile-completion");
        }
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      
      let errorMessage = error.message;
      let errorTitle = `Google ${mode} failed`;
      
      // Provide specific guidance for common OAuth errors
      if (error.code === 'auth/unauthorized-domain') {
        errorTitle = "Domain not authorized";
        errorMessage = "This domain is not authorized for Google sign-in. Please contact support.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorTitle = "OAuth not configured";
        errorMessage = "Google sign-in is not properly configured. Please check Firebase Console settings.";
      } else if (error.code === 'auth/popup-blocked') {
        errorTitle = "Popup blocked";
        errorMessage = "Please allow popups for this site and try again.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorTitle = "Sign-in cancelled";
        errorMessage = "Google sign-in was cancelled. Please try again.";
      } else if (error.code === 'auth/network-request-failed') {
        errorTitle = "Network error";
        errorMessage = "Please check your internet connection and try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 transition-all duration-200"
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? "Processing..." : `Continue with Google as ${role === "patient" ? "Patient" : "Doctor"}`}
    </Button>
  );
};

export default GoogleAuthButton;
