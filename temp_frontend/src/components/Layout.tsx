import { ReactNode } from 'react';
import LangSwitch from './LangSwitch';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen">
      {/* Language Switcher - positioned in top-right corner on all pages */}
      <div className="fixed top-4 right-4 z-50">
        <LangSwitch />
      </div>
      
      {/* Main content */}
      {children}
    </div>
  );
};

export default Layout;
