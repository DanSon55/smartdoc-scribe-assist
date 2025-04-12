
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, User, FileText, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r p-4 bg-white">
        <div className="flex items-center gap-2 py-6">
          <Stethoscope className="h-8 w-8 text-medical-primary" />
          <h1 className="text-2xl font-bold text-medical-dark">SmartDoc</h1>
        </div>
        
        <nav className="space-y-2 mt-6">
          <NavLink to="/" icon={<Home size={18} />} text="Главная" />
          <NavLink to="/patients" icon={<User size={18} />} text="Пациенты" />
          <NavLink to="/records" icon={<FileText size={18} />} text="Записи" />
          <NavLink to="/settings" icon={<Settings size={18} />} text="Настройки" />
        </nav>
        
        <div className="mt-auto py-4">
          <div className="flex items-center gap-2 p-2">
            <div className="w-8 h-8 rounded-full bg-medical-primary flex items-center justify-center text-white">
              <span>ДИ</span>
            </div>
            <div>
              <p className="text-sm font-medium">Д-р Иванов</p>
              <p className="text-xs text-muted-foreground">Терапевт</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-white h-16 flex items-center px-4 md:px-6 justify-between">
          <div className="md:hidden flex items-center">
            <Stethoscope className="h-6 w-6 text-medical-primary mr-2" />
            <span className="font-bold text-lg text-medical-dark">SmartDoc</span>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-lg font-medium">Рабочее пространство врача</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden">
              <Settings size={18} />
            </Button>
            <div className="md:hidden w-8 h-8 rounded-full bg-medical-primary flex items-center justify-center text-white">
              <span>ДИ</span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
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
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text }) => {
  const isActive = window.location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-medical-light text-medical-dark font-medium" 
          : "text-muted-foreground hover:bg-medical-light/50 hover:text-medical-primary"
      )}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export default Layout;
