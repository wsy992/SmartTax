import React, { useState } from 'react';
import Layout from './components/Layout';
import EnterpriseView from './views/EnterpriseView';
import TaxView from './views/TaxView';
import LoginView from './views/LoginView';
import { Role, Page, Language } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(Role.ENTERPRISE);
  const [page, setPage] = useState<Page>('dashboard');
  const [language, setLanguage] = useState<Language>('en');

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(Role.ENTERPRISE); // Reset default
    setPage('dashboard');
  };

  const handleRoleSwitch = (newRole: Role) => {
    setRole(newRole);
    setPage('dashboard'); // Reset page when switching roles
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} language={language} />;
  }

  return (
    <Layout 
      role={role} 
      currentPage={page} 
      onNavigate={setPage} 
      onSwitchRole={handleRoleSwitch}
      onLogout={handleLogout}
      language={language}
    >
      {role === Role.ENTERPRISE ? (
        <EnterpriseView page={page} language={language} setLanguage={setLanguage} />
      ) : (
        <TaxView page={page} language={language} setLanguage={setLanguage} />
      )}
    </Layout>
  );
};

export default App;