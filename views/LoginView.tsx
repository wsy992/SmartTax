import React from 'react';
import { Role, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { ShieldCheck, Building2, Landmark, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: Role) => void;
  language: Language;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, language }) => {
  const t = TRANSLATIONS[language]; // Default to EN if undefined, though managed in App

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-600/20">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.app_name}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {t.tagline}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enterprise Card */}
          <button 
            onClick={() => onLogin(Role.ENTERPRISE)}
            className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left p-8"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <Building2 className="text-blue-600 group-hover:text-white transition-colors" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t.login_enterprise_title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {t.login_enterprise_desc}
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                {t.login_enterprise_btn} <ArrowRight className="ml-2" size={16} />
              </div>
            </div>
          </button>

          {/* Tax Official Card */}
          <button 
            onClick={() => onLogin(Role.TAX_OFFICIAL)}
            className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border-2 border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 text-left p-8"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Landmark size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <Landmark className="text-purple-600 group-hover:text-white transition-colors" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t.login_official_title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {t.login_official_desc}
              </p>
              <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                {t.login_official_btn} <ArrowRight className="ml-2" size={16} />
              </div>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
            <p className="text-xs text-slate-400">
                System Version v1.2.0 • Powered by DevSecOps Pipeline • Secured by Zero Trust Architecture
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;