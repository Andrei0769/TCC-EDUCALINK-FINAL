
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Home, 
  Settings, 
  Users,
  LogOut,
  PenTool,
  GraduationCap,
  BookOpen,
  Menu,
  X,
  Search,
  Bell,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  userType?: string[];
};

type UserData = {
  nome: string;
  email: string;
  userType: string;
  [key: string]: any;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home, userType: ['responsavel'] },
  { label: 'Dashboard Professor', href: '/dashboard-professor', icon: Home, userType: ['professor'] },
  { label: 'Boletim', href: '/boletim', icon: FileText, userType: ['responsavel'] },
  { label: 'Progresso Acadêmico', href: '/progresso-academico', icon: TrendingUp, userType: ['responsavel'] },
  { label: 'Gerenciar Notas', href: '/gerenciar-notas', icon: PenTool, userType: ['professor'] },
  { label: 'Calendário', href: '/calendario', icon: Calendar, userType: ['responsavel'] },
  { label: 'Calendário Escolar', href: '/calendario-professor', icon: Calendar, userType: ['professor'] },
  { label: 'Alunos', href: '/alunos', icon: GraduationCap, userType: ['professor'] },
  { label: 'Atividades Pedagógicas', href: '/atividades-pedagogicas', icon: BookOpen },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState('/dashboard');
  const [user, setUser] = useState<UserData | null>(null);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const storedUser = localStorage.getItem('educalink-current-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('educalink-current-user');
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item => {
    if (!item.userType) return true;
    return !user || item.userType.includes(user.userType);
  });

  useEffect(() => {
    if (user?.userType === 'professor' && location.pathname === '/dashboard') {
      navigate('/dashboard-professor');
    }
  }, [user, location, navigate]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        {/* Eliminamos o texto "EducaLink" para o usuário de tipo "responsavel" */}
        {user?.userType === 'professor' && (
          <>
            <h2 className="text-xl font-semibold text-edulink-800">EducaLink</h2>
            <p className="text-sm text-slate-500">Plataforma Educacional</p>
          </>
        )}
      </div>
      
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => (
            <li key={item.href + item.label}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeItem === item.href 
                    ? "bg-edulink-100 text-edulink-900 dark:bg-edulink-900/20 dark:text-edulink-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  activeItem === item.href 
                    ? "text-edulink-600" 
                    : "text-slate-500"
                )} />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <ProfileSection user={user} onLogout={handleLogout} />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="sm"
          className="fixed bottom-5 left-5 z-50 rounded-full bg-white/90 shadow-lg backdrop-blur-sm p-3 md:hidden"
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 h-[calc(100vh-4rem)]">
      <SidebarContent />
    </aside>
  );
};

const ProfileSection = ({ 
  user, 
  onLogout,
}: { 
  user: UserData | null;
  onLogout: () => void;
}) => {
  const getUserInitials = () => {
    if (!user || !user.nome) return 'U';
    
    const names = user.nome.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.nome.substring(0, 2).toUpperCase();
  };

  const isResponsavel = user?.userType === 'responsavel';
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 w-full rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Avatar className="w-10 h-10 border border-slate-200 dark:border-slate-700">
            <AvatarFallback className="bg-edulink-100 text-edulink-600">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium">{user?.nome || 'Usuário'}</p>
            <p className="text-xs text-slate-500">
              {user?.userType === 'responsavel' ? 'Responsável' : 'Professor'}
            </p>
          </div>
          <Settings className="h-4 w-4 text-slate-500 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 z-40 bg-white dark:bg-gray-800"
        sideOffset={8}
      >
        <DropdownMenuItem asChild>
          <Link to="/perfil" className="cursor-pointer" onClick={() => setIsOpen(false)}>
            Visualizar Perfil
          </Link>
        </DropdownMenuItem>
        {!isResponsavel && (
          <DropdownMenuItem asChild>
            <Link to="/perfil/editar" className="cursor-pointer" onClick={() => setIsOpen(false)}>
              Editar Informações
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/configuracoes" className="cursor-pointer" onClick={() => setIsOpen(false)}>
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => {
          onLogout();
          setIsOpen(false);
        }}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Sidebar;
