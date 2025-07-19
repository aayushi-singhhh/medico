import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration - replace with actual auth
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gradient-card shadow-hover">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join our healthcare platform</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="doctor" className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Doctor
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient" className="space-y-4 mt-6">
              <form onSubmit={(e) => handleSubmit(e, "patient")} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-first-name">First Name</Label>
                    <Input id="patient-first-name" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-last-name">Last Name</Label>
                    <Input id="patient-last-name" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email</Label>
                  <Input id="patient-email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-phone">Phone Number</Label>
                  <Input id="patient-phone" type="tel" placeholder="+1 (555) 000-0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-password">Password</Label>
                  <Input id="patient-password" type="password" required />
                </div>
                <Button variant="medical" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register as Patient"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="doctor" className="space-y-4 mt-6">
              <form onSubmit={(e) => handleSubmit(e, "doctor")} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-first-name">First Name</Label>
                    <Input id="doctor-first-name" placeholder="Dr. Jane" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-last-name">Last Name</Label>
                    <Input id="doctor-last-name" placeholder="Smith" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email</Label>
                  <Input id="doctor-email" type="email" placeholder="doctor@hospital.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-license">Medical License</Label>
                  <Input id="doctor-license" placeholder="License Number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-specialization">Specialization</Label>
                  <Input id="doctor-specialization" placeholder="e.g., Cardiology" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-password">Password</Label>
                  <Input id="doctor-password" type="password" required />
                </div>
                <Button variant="medical" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register as Doctor"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in here
              </Link>
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:underline block mt-2">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;