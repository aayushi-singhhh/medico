import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from './ui/lswitch';

interface LanguageSwitcherProps {
  className?: string;
}

export const LangSwitch: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage);
  };

  const isHindi = i18n.language === 'hi';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`text-sm font-medium ${!isHindi ? 'text-blue-600' : 'text-gray-500'}`}>
        EN
      </span>
      <Switch 
        checked={isHindi} 
        onCheckedChange={toggleLanguage}
      />
      <span className={`text-sm font-medium ${isHindi ? 'text-blue-600' : 'text-gray-500'}`}>
        हि
      </span>
    </div>
  );
};
