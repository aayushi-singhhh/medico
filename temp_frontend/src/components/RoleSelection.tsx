import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Stethoscope, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const RoleSelection = () => {
  const roles = [
    {
      icon: UserCircle,
      title: "Patient Portal",
      description: "Take control of your health with AI-powered insights and comprehensive medical record management",
      features: [
        "Upload medical reports & images instantly",
        "AI disease risk assessment in seconds", 
        "Personal health timeline with trends",
        "Download complete medical history"
      ],
      route: "/login?role=patient"
    },
    {
      icon: Stethoscope,
      title: "Doctor Dashboard",
      description: "Enhance your practice with AI diagnostic assistance and comprehensive patient management tools",
      features: [
        "View complete patient medical histories",
        "AI diagnostic assistance & recommendations",
        "Add detailed consultation notes",
        "Generate comprehensive patient reports"
      ],
      route: "/login?role=doctor"
    },
    {
      icon: Building2,
      title: "Hospital Admin",
      description: "Streamline healthcare operations with advanced analytics and comprehensive system management",
      features: [
        "Manage doctors & patients efficiently",
        "Real-time platform monitoring",
        "Advanced analytics dashboard",
        "System administration tools"
      ],
      route: "/admin-dashboard"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Role
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access tailored healthcare solutions designed specifically for your role and responsibilities.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => {
            // Define colors for each role
            const roleColors = [
              {
                gradient: "from-blue-500 to-cyan-500",
                bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
                iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
                button: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
                bullet: "bg-blue-500",
                border: "border-blue-200"
              },
              {
                gradient: "from-emerald-500 to-teal-500", 
                bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
                iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
                button: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
                bullet: "bg-emerald-500",
                border: "border-emerald-200"
              },
              {
                gradient: "from-purple-500 to-pink-500",
                bg: "bg-gradient-to-br from-purple-50 to-pink-50", 
                iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
                button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                bullet: "bg-purple-500",
                border: "border-purple-200"
              }
            ];
            
            const colors = roleColors[index];
            
            return (
              <Card key={index} className={`shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${colors.border} ${colors.bg} hover:scale-105`}>
                <CardHeader className="text-center pb-6">
                  <div className={`mx-auto mb-6 w-16 h-16 rounded-full ${colors.iconBg} flex items-center justify-center shadow-lg`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-3 text-gray-800">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {role.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className={`w-2 h-2 ${colors.bullet} rounded-full mt-2 mr-3 flex-shrink-0`} />
                        <span className="text-gray-700 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Link to={role.route}>
                    <Button className={`w-full ${colors.button} text-white font-semibold py-3 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl`}>
                      Access {role.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;