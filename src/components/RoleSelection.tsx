import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Stethoscope, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const RoleSelection = () => {
  const roles = [
    {
      icon: UserCircle,
      title: "Patient Portal",
      description: "Manage your medical history, upload reports, and get AI-powered health insights",
      features: [
        "Upload medical reports & images",
        "AI disease risk assessment", 
        "Personal health timeline",
        "Download medical history"
      ],
      color: "text-primary"
    },
    {
      icon: Stethoscope,
      title: "Doctor Dashboard",
      description: "Access patient histories, AI predictions, and comprehensive healthcare tools",
      features: [
        "View patient medical histories",
        "AI diagnostic assistance",
        "Add consultation notes",
        "Generate patient reports"
      ],
      color: "text-accent"
    },
    {
      icon: Building2,
      title: "Hospital Admin",
      description: "Manage healthcare professionals and monitor platform-wide analytics",
      features: [
        "Manage doctors & patients",
        "Platform monitoring",
        "Analytics dashboard",
        "System administration"
      ],
      color: "text-destructive"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access tailored healthcare solutions designed for your specific needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <Card key={index} className="relative overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 transform hover:scale-105 bg-gradient-card">
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-medical flex items-center justify-center`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                <CardDescription className="text-base">
                  {role.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={role.title === "Patient Portal" ? "/patient-dashboard" : 
                         role.title === "Doctor Dashboard" ? "/doctor-dashboard" : "#"}>
                  <Button variant="medical" className="w-full mt-6">
                    Access {role.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;