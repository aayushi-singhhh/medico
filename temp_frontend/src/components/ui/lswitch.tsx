import React from 'react';
import { useTranslation } from 'react-i18next';

interface SwitchProps {
  onChange?: () => void;
}

const Switch: React.FC<SwitchProps> = ({ onChange }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const handleChange = () => {
    if (onChange) {
      onChange();
    }
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        className="sr-only peer" 
        type="checkbox" 
        checked={isHindi}
        onChange={handleChange}
      />
      <div className="peer rounded-full outline-none duration-300 w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:bg-blue-500 after:content-['EN'] after:absolute after:outline-none after:rounded-full after:h-6 after:w-6 after:bg-white after:top-0.5 after:left-0.5 after:flex after:justify-center after:items-center after:text-xs after:font-semibold after:text-blue-600 after:transition-all after:duration-300 peer-checked:after:translate-x-5 peer-checked:after:content-['हि'] peer-checked:after:text-white peer-checked:after:bg-blue-600 shadow-sm">
      </div>
    </label>
  );
};

export default Switch;
