import HeroSection from "../components/HeroSection";
import RoleSelection from "../components/RoleSelection";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <HeroSection />
      <RoleSelection />
      
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">94.2%</div>
              <div className="text-blue-100">{t('stats.aiAccuracy')}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">50K+</div>
              <div className="text-blue-100">{t('stats.patientsServed')}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">1000+</div>
              <div className="text-blue-100">{t('stats.healthcareProviders')}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">5+</div>
              <div className="text-blue-100">{t('stats.diseaseModels')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              {t('cta.startJourney')}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
              {t('cta.scheduleDemo')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
