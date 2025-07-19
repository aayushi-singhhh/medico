import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Brain, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/healthcare-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Healthcare Technology" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Unified AI-Powered 
            <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Smart Healthcare Platform
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Connecting hospitals, doctors, and patients through intelligent health management, 
            AI-powered diagnostics, and comprehensive medical record systems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button variant="hero" className="group">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-card hover:shadow-hover transition-all duration-300 transform hover:scale-105">
              <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Diagnostics</h3>
              <p className="opacity-80">Advanced machine learning for disease prediction and medical image analysis</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-card hover:shadow-hover transition-all duration-300 transform hover:scale-105">
              <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="opacity-80">HIPAA-compliant data protection with role-based access control</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-card hover:shadow-hover transition-all duration-300 transform hover:scale-105">
              <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unified Access</h3>
              <p className="opacity-80">Connecting patients, doctors, and healthcare providers seamlessly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;