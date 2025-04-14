import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Stethoscope, User, FileText, Settings, Home, Menu, X, Bell, Search, TestTube, FileSymlink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTherapist } from '@/contexts/TherapistContext';
import { usePatient } from '@/contexts/PatientContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTherapist } = useTherapist();
  const { userType } = usePatient();

  // Get first letters for avatar fallback
  const getInitials = () => {
    if (!currentTherapist) return 'ДИ';
    
    const nameParts = currentTherapist.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  // Redirect to user type selection if no user type is set
  useEffect(() => {
    if (userType === null && location.pathname !== '/') {
      navigate('/');
    }
  }, [userType, navigate, location.pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-20 flex flex-col w-64 transition-transform duration-300 transform bg-white border-r shadow-sm",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-medical-primary" />
            {isSidebarOpen && <h1 className="text-xl font-bold bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">SmartDoc</h1>}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1">
          {userType === 'doctor' ? (
            // Doctor navigation
            <>
              <NavLink to="/doctor-dashboard" icon={<Home size={20} />} text="Главная" expanded={isSidebarOpen} active={location.pathname === '/doctor-dashboard'} />
              <NavLink to="/patients" icon={<User size={20} />} text="Пациенты" expanded={isSidebarOpen} active={location.pathname === '/patients'} />
              <NavLink to="/records" icon={<FileText size={20} />} text="Записи" expanded={isSidebarOpen} active={location.pathname === '/records'} />
              <NavLink to="/settings" icon={<Settings size={20} />} text="Настройки" expanded={isSidebarOpen} active={location.pathname === '/settings'} />
            </>
          ) : (
            // Patient navigation
            <>
              <NavLink to="/patient-dashboard" icon={<Home size={20} />} text="Главная" expanded={isSidebarOpen} active={location.pathname === '/patient-dashboard'} />
              <NavLink to="/patient-dashboard" icon={<Stethoscope size={20} />} text="Найти врача" expanded={isSidebarOpen} active={false} />
              <NavLink to="/patient-dashboard" icon={<FileText size={20} />} text="Медкарта" expanded={isSidebarOpen} active={false} />
              <NavLink to="/patient-dashboard" icon={<TestTube size={20} />} text="Анализы" expanded={isSidebarOpen} active={false} />
            </>
          )}
        </nav>
        
        <div className="p-4 border-t">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <Avatar className="h-9 w-9 border-2 border-medical-light">
              {currentTherapist?.avatarUrl ? (
                <AvatarImage src={currentTherapist.avatarUrl} />
              ) : (
                <AvatarFallback className="bg-medical-primary text-white text-sm">{getInitials()}</AvatarFallback>
              )}
            </Avatar>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  {currentTherapist ? currentTherapist.name : userType === 'patient' ? 'Пациент' : 'Гость'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentTherapist ? currentTherapist.specialty : userType === 'patient' ? 'Личный кабинет' : 'Не указано'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md h-16 flex items-center px-4 md:px-6 justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
            </Button>
            
            <div className="hidden md:flex relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Поиск..." 
                className="pl-10 h-9 bg-muted/50 focus-visible:ring-medical-primary" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                2
              </Badge>
            </Button>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medical-accent"></div>
                <span className="text-sm font-medium">В сети</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  expanded: boolean;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, expanded, active }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        active 
          ? "bg-medical-light text-medical-primary font-medium" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        !expanded && "justify-center px-2"
      )}
    >
      {icon}
      {expanded && <span>{text}</span>}
    </Link>
  );
};

export default Layout;
