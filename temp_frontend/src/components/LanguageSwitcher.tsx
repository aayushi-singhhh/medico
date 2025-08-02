import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Switch from '@/components/ui/lswitch';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-xs font-bold w-8 text-right">
          {i18n.language === 'en' ? "EN" : "हि"}
        </div>
        <div className="cursor-pointer transform">
          <Switch onChange={changeLanguage} />
        </div>
        <div className="text-xs font-bold w-8 text-left">
          {i18n.language === 'en' ? "हि" : "EN"}
        </div>
      </div>
      <div className="flex items-center justify-between w-full text-[9px] px-1">
        <span>🌞 {t('settings.english')}</span>
        <span>{t('settings.hindi')} 🌙</span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
