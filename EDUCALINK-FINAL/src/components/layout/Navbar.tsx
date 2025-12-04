import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, FileText, LayoutDashboard, Menu, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from './SearchBar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = ({ className }: { className?: string }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Check authentication status on component mount or when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('educalink-current-user');
      setIsAuthenticated(!!user);
      if (user) {
        setCurrentUser(JSON.parse(user));
      } else {
        setCurrentUser(null);
      }
    };
    
    checkAuth();
    
    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('educalink-current-user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login');
  };

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!currentUser || !currentUser.nome) return 'U';
    
    const names = currentUser.nome.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return currentUser.nome.substring(0, 2).toUpperCase();
  };

  const NavLinks = () => (
    <>
      {/* Dashboard link removido daqui */}
      {/* Removido: Link para "/boletim" */}
      
      <Link to="/atividades-pedagogicas" className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
        <BookOpen className="h-5 w-5" />
        <span>Atividades</span>
      </Link>
    </>
  );

  return (
    <header className={className}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">E</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-indigo-600">EducaLink</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {isAuthenticated ? (
            <>
              {/* Desktop navigation links */}
              <div className="hidden md:flex items-center gap-2">
                <NavLinks />
              </div>
              
              {/* Mobile menu button */}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden text-slate-600" aria-label="Menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-16">
                    <div className="flex flex-col gap-4 mt-4">
                      <NavLinks />
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              <SearchBar 
                className="hidden md:flex"
                mobileView={false}
              />
              
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="text-slate-600 hover:text-primary" aria-label="Search">
                  <Search className="h-5 w-5" />
                </Button>
              )}

              <Sheet open={isMenuOpen && isMobile} onOpenChange={setIsMenuOpen}>
                <SheetContent side="top" className="h-auto pt-16">
                  <div className="p-4">
                    <SearchBar mobileView={true} />
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-primary" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              
              {isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full p-0 w-9 h-9">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-edulink-100 text-edulink-600">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-50" forceMount sideOffset={5}>
                    <DropdownMenuItem asChild>
                      <Link to="/perfil">Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/configuracoes">Configurações</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu onOpenChange={setIsProfileMenuOpen} open={isProfileMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full p-0">
                      <div className="w-9 h-9 rounded-full bg-edulink-100 flex items-center justify-center overflow-hidden">
                        {getUserInitials()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-50" forceMount sideOffset={5}>
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="cursor-pointer">Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/configuracoes" className="cursor-pointer">Configurações</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:flex px-3 py-2 text-slate-600 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                Entrar
              </Link>
              
              <Link to="/cadastro">
                <Button className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
                  Cadastre-se
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
