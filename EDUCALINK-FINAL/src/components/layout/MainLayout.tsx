import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para efeitos visuais no cabeçalho
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Use passive event listener para melhor performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar className={cn(
        "sticky top-0 z-30 w-full transition-all duration-300",
        isScrolled ? "shadow-md bg-white/90 backdrop-blur-sm dark:bg-slate-900/90" : ""
      )} />
      
      <div className={cn("flex", isMobile ? "flex-col" : "flex-row")}>
        <Sidebar />
        <div className={cn("flex-1 overflow-y-auto", isMobile ? "h-[calc(100vh-4rem)]" : "h-[calc(100vh-4rem)]")}>
          <main className={cn("pb-16", className)}>
            <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
