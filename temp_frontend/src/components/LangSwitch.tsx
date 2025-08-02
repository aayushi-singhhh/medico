import React from 'react';
import { useTranslation } from 'react-i18next';
import Switch from './ui/lswitch';

interface LangSwitchProps {
  className?: string;
}

const LangSwitch: React.FC<LangSwitchProps> = ({ className }) => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage);
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <Switch onChange={toggleLanguage} />
    </div>
  );
};

export default LangSwitch;
