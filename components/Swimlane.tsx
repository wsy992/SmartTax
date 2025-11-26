import React from 'react';
import { Check, Clock, AlertTriangle, FileSearch } from 'lucide-react';
import { DeclarationStatus, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SwimlaneProps {
  status: DeclarationStatus;
  language?: Language;
}

const Swimlane: React.FC<SwimlaneProps> = ({ status, language = 'en' }) => {
  const t = TRANSLATIONS[language];

  const steps = [
    { id: DeclarationStatus.DRAFT, label: t.step_draft, icon: FileSearch },
    { id: DeclarationStatus.PROCESSING, label: t.step_ocr, icon: Clock },
    { id: DeclarationStatus.VALIDATING, label: t.step_valid, icon: Check },
    { id: DeclarationStatus.RISK_CHECK, label: t.step_risk, icon: AlertTriangle },
    { id: DeclarationStatus.CLEARED, label: t.step_clear, icon: Check },
  ];

  // Determine current step index
  const getCurrentStepIndex = () => {
    if (status === DeclarationStatus.AUDIT_REQUIRED) return 3; // Stops at risk check visually
    const idx = steps.findIndex(s => s.id === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIdx = getCurrentStepIndex();
  const isAudit = status === DeclarationStatus.AUDIT_REQUIRED;

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 transform -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-0 transform -translate-y-1/2 rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const isError = isAudit && idx === 3; // Risk Check failed

          let Icon = step.icon;
          let colorClass = isCompleted ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 border-2 border-slate-200';
          
          if (isError) {
             colorClass = 'bg-red-500 text-white animate-pulse';
             Icon = AlertTriangle;
          } else if (isCurrent && !isCompleted) {
            colorClass = 'bg-blue-600 text-white ring-4 ring-blue-100';
          }

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${colorClass}`}>
                <Icon size={18} />
              </div>
              <div className="absolute top-12 w-32 text-center">
                <p className={`text-xs font-semibold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-[10px] text-blue-600 font-medium block animate-bounce mt-1">
                    {isAudit ? t.status_audit : t.step_valid}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Swimlane;