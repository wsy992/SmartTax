import React from 'react';
import { Role, Page, Language } from '../types';
import { ShieldCheck, LayoutDashboard, FileText, AlertTriangle, Settings, LogOut, Activity } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  role: Role;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSwitchRole: (role: Role) => void;
  onLogout: () => void;
  language: Language;
}

const Layout: React.FC<LayoutProps> = ({ children, role, currentPage, onNavigate, onSwitchRole, onLogout, language }) => {
  const isEnterprise = role === Role.ENTERPRISE;
  const t = TRANSLATIONS[language];

  const navItems = isEnterprise ? [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'list', label: t.nav_list, icon: FileText },
    { id: 'tracking', label: t.nav_tracking, icon: Activity },
    { id: 'settings', label: t.nav_settings, icon: Settings },
  ] : [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'audit', label: t.nav_audit, icon: FileText },
    { id: 'risk', label: t.nav_risk, icon: Activity },
    { id: 'anomalies', label: t.nav_anomalies, icon: AlertTriangle },
    { id: 'settings', label: t.nav_settings, icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-64 flex-shrink-0 flex flex-col transition-colors duration-300 ${isEnterprise ? 'bg-white border-r border-slate-200' : 'bg-slate-900 text-white'}`}>
        <div className="h-16 flex items-center px-6 border-b border-opacity-10 border-black/10">
          <ShieldCheck className={`w-8 h-8 mr-3 ${isEnterprise ? 'text-blue-600' : 'text-purple-400'}`} />
          <span className="font-bold text-lg tracking-tight">{t.app_name}</span>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2">
          <div className="px-3 mb-2 text-xs font-semibold opacity-50 uppercase tracking-wider">
            {isEnterprise ? 'Enterprise Workspace' : 'Authority Control'}
          </div>
          
          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              icon={<item.icon size={20} />} 
              label={item.label} 
              active={currentPage === item.id}
              onClick={() => onNavigate(item.id as Page)}
              dark={!isEnterprise}
            />
          ))}
        </div>

        <div className="p-4 border-t border-opacity-10 border-black/10">
          <div className={`p-4 rounded-xl mb-4 ${isEnterprise ? 'bg-blue-50 text-blue-900' : 'bg-slate-800 text-slate-200'}`}>
            <p className="text-xs font-bold mb-1">{isEnterprise ? 'Role' : 'Role'}</p>
            <p className="text-sm">{isEnterprise ? t.role_enterprise : t.role_official}</p>
            <button 
              onClick={() => onSwitchRole(isEnterprise ? Role.TAX_OFFICIAL : Role.ENTERPRISE)}
              className="mt-3 w-full py-1.5 px-3 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors border border-transparent hover:border-current"
            >
              {t.switch_view}
            </button>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 text-sm opacity-70 hover:opacity-100 transition-opacity w-full px-2"
          >
            <LogOut size={16} />
            <span>{t.sign_out}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h1 className="text-xl font-semibold text-slate-800">
            {isEnterprise ? t.welcome_ent : t.welcome_tax}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isEnterprise ? 'bg-green-500' : 'bg-purple-500'} animate-pulse`}></span>
              <span className="text-sm text-slate-500">{t.system_online}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
              {isEnterprise ? 'EU' : 'TO'}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; dark?: boolean }> = ({ icon, label, active, onClick, dark }) => {
  // Enhanced Active State Logic for "Transparency" feel
  // Light Mode (Enterprise): Blue tint background with left border
  // Dark Mode (Official): White/Glass tint with left border
  
  const activeClass = dark 
    ? 'bg-white/10 text-white border-l-4 border-purple-400 shadow-[0_0_15px_rgba(0,0,0,0.2)] backdrop-blur-sm' 
    : 'bg-blue-600/10 text-blue-700 border-l-4 border-blue-600 shadow-sm';
  
  const inactiveClass = dark 
    ? 'text-slate-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent' 
    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent';

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-3 transition-all duration-200 ${active ? activeClass : inactiveClass}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default Layout;