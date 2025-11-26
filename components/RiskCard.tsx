
import React from 'react';
import { Declaration } from '../types';
import { AlertCircle, ChevronRight, Activity } from 'lucide-react';

interface RiskCardProps {
  declaration: Declaration;
  onInspect: () => void;
  isSelected?: boolean;
}

const RiskCard: React.FC<RiskCardProps> = ({ declaration, onInspect, isSelected }) => {
  const isHighRisk = declaration.riskScore > 80;
  
  // Dynamic base class for selection state
  const baseClasses = `p-4 rounded-xl border-l-4 shadow-sm transition-all cursor-pointer mb-3 ${
    isSelected 
      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-200 shadow-md transform scale-[1.02]' 
      : 'bg-white hover:shadow-md border-transparent hover:bg-slate-50'
  }`;

  // Override border color for risk indication if NOT selected (or keep it subtle)
  // If selected, we use Blue to indicate "Active Selection", but we still show the risk icon color
  const riskBorderColor = isHighRisk ? 'border-red-500' : 'border-yellow-400';
  const finalClasses = isSelected ? baseClasses : `${baseClasses} ${riskBorderColor}`;

  return (
    <div className={finalClasses} onClick={onInspect}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>{declaration.companyName}</h3>
            {isHighRisk && <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">High Risk</span>}
          </div>
          <p className="text-xs text-slate-500 mt-1">ID: {declaration.id}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-lg font-bold text-slate-700">{declaration.riskScore}<span className="text-xs text-slate-400 font-normal">/100</span></div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center space-x-2 text-sm text-slate-600">
        <AlertCircle size={16} className={isHighRisk ? "text-red-500" : "text-yellow-500"} />
        <span className="truncate max-w-[180px] text-xs">{declaration.anomalies.length > 0 ? declaration.anomalies[0] : 'Potential Pattern Match'}</span>
      </div>
    </div>
  );
};

export default RiskCard;
