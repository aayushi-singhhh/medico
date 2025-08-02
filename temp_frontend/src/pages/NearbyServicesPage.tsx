import NearbyServices from "@/components/NearbyServices";
import { useTranslation } from 'react-i18next';

const NearbyServicesPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            {t('nearbyServices.title')}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {t('nearbyServices.subtitle')}
          </p>
        </div>
      </section>

      {/* Nearby Services Component */}
      <NearbyServices />
      
      {/* Additional Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {t('nearbyServices.howItWorks')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('nearbyServices.shareLocation')}</h3>
                <p className="text-gray-600">
                  {t('nearbyServices.shareLocationDesc')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('nearbyServices.searchServices')}</h3>
                <p className="text-gray-600">
                  {t('nearbyServices.searchServicesDesc')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('nearbyServices.getDirections')}</h3>
                <p className="text-gray-600">
                  {t('nearbyServices.getDirectionsDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-red-600">
              {t('nearbyServices.emergency')}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {t('nearbyServices.emergencyDesc')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="font-semibold text-red-600">{t('nearbyServices.emergencyNumber')}</h3>
                <p className="text-2xl font-bold">108</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="font-semibold text-red-600">{t('nearbyServices.poisonControl')}</h3>
                <p className="text-lg font-bold">1800-425-1213</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="font-semibold text-red-600">{t('nearbyServices.crisisHelpline')}</h3>
                <p className="text-lg font-bold">988</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NearbyServicesPage;
