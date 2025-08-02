import { Button } from "./ui/button";
import { ArrowRight, Shield, Brain, Users, Heart, Activity, MapPin, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-6 py-2 mb-8 backdrop-blur-sm">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium">{t('hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/prediction-results">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full">
                {t('hero.tryAiDiagnosis')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login?role=patient">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full">
                <UserCircle className="mr-2 w-4 h-4" />
                {t('hero.patientLogin')}
              </Button>
            </Link>
            <Link to="/nearby-services">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full"
              >
                <MapPin className="mr-2 w-4 h-4" />
                {t('hero.findNearbyServices')}
              </Button>
            </Link>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart AI Diagnostics</h3>
              <p className="opacity-90">
                Advanced machine learning algorithms analyze your health data with 94.2% accuracy
              </p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="opacity-90">
                HIPAA-compliant platform with end-to-end encryption ensuring your data stays secure
              </p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connected Care</h3>
              <p className="opacity-90">
                Seamlessly connect patients, doctors, and healthcare providers in one platform
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-cyan-400">94.2%</div>
              <div className="text-white/70 text-sm">{t('stats.aiAccuracy')}</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">50K+</div>
              <div className="text-white/70 text-sm">{t('stats.patientsServed')}</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">&lt;2s</div>
              <div className="text-white/70 text-sm">Response Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-400">100%</div>
              <div className="text-white/70 text-sm">Secure</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;