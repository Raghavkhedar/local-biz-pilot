
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from './MobileNavigation';
import DesktopNavigation from './DesktopNavigation';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex">
        {!isMobile && <DesktopNavigation />}
        <main className="flex-1 p-4 pb-20 md:pb-4">
          {children}
        </main>
      </div>
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default Layout;
