

import React, { useState, useEffect } from 'react';
import { Declaration, DeclarationStatus, Page, Language } from '../types';
import { MOCK_DECLARATIONS, PENDING_TASKS, TRANSLATIONS } from '../constants';
import { UploadCloud, FileText, CheckCircle, Clock, Bell, RefreshCw, Settings, ShieldCheck, Globe, ChevronRight, X, AlertCircle, Loader2, Check } from 'lucide-react';
import Swimlane from '../components/Swimlane';

interface EnterpriseViewProps {
  page: Page;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const EnterpriseView: React.FC<EnterpriseViewProps> = ({ page, language, setLanguage }) => {
  const [declarations, setDeclarations] = useState<Declaration[]>(MOCK_DECLARATIONS);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('list');
  const [tasks, setTasks] = useState(PENDING_TASKS);
  
  // Modal Logic State
  const [selectedTask, setSelectedTask] = useState<typeof PENDING_TASKS[0] | null>(null);
  const [taskStatus, setTaskStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  
  const t = TRANSLATIONS[language];

  // Sync page prop with local tab state or view
  useEffect(() => {
    if (page === 'list' || page === 'tracking' || page === 'dashboard') {
      setActiveTab('list');
    }
  }, [page]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      // Simulate OCR and Processing
      setTimeout(() => {
        const newDec: Declaration = {
          id: `DEC-2023-${Math.floor(Math.random() * 10000)}`,
          companyName: 'Global Tech Imports Ltd',
          submitDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
          amount: 50000 + Math.floor(Math.random() * 50000),
          currency: 'USD',
          status: DeclarationStatus.PROCESSING,
          riskScore: 0,
          anomalies: [],
          documents: [e.target.files![0].name],
          goodsType: 'Auto Parts',
          hsCode: '8708.99'
        };
        setDeclarations([newDec, ...declarations]);
        setIsUploading(false);
        setActiveTab('list');
        
        // Simulate System Progression
        setTimeout(() => {
            setDeclarations(prev => prev.map(d => d.id === newDec.id ? {...d, status: DeclarationStatus.VALIDATING} : d));
        }, 2000);
        setTimeout(() => {
            setDeclarations(prev => prev.map(d => d.id === newDec.id ? {...d, status: DeclarationStatus.RISK_CHECK} : d));
        }, 4500);
        setTimeout(() => {
            setDeclarations(prev => prev.map(d => d.id === newDec.id ? {...d, status: DeclarationStatus.CLEARED} : d));
        }, 7000);

      }, 1500);
    }
  };

  const handleTaskClick = (task: typeof PENDING_TASKS[0]) => {
      setSelectedTask(task);
      setTaskStatus('idle'); // Reset state when opening a new task
  };

  const handleProcessTask = () => {
    setTaskStatus('processing');
    
    // Simulate API call delay then switch to success
    setTimeout(() => {
      setTaskStatus('success');
    }, 2000);
  };

  const handleTaskDone = () => {
      if (selectedTask) {
        setTasks(prev => prev.filter(task => task.id !== selectedTask.id));
      }
      setSelectedTask(null);
      setTaskStatus('idle');
  };

  if (page === 'settings') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <Settings className="mr-3" /> {t.settings_title}
        </h2>
        <div className="space-y-6">
          {/* Language Toggle */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="text-blue-600" />
              <div>
                <h3 className="font-semibold text-slate-800">{t.settings_lang}</h3>
                <p className="text-sm text-slate-500">{language === 'en' ? 'English' : '中文'}</p>
              </div>
            </div>
            <div className="flex bg-white rounded-lg p-1 border border-slate-200">
               <button 
                 onClick={() => setLanguage('en')}
                 className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 English
               </button>
               <button 
                 onClick={() => setLanguage('cn')}
                 className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === 'cn' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 中文
               </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-2">{t.company_profile}</h3>
            <p className="text-sm text-slate-500">Global Tech Imports Ltd</p>
            <p className="text-sm text-slate-500">{t.tax_id}: 992810293</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-2">{t.notif_pref}</h3>
            <label className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
              <input type="checkbox" checked readOnly className="rounded text-blue-600" />
              <span>{t.notif_email}</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-slate-600">
              <input type="checkbox" checked readOnly className="rounded text-blue-600" />
              <span>{t.notif_sms}</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Pending Task Modal (Advanced) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 min-h-[400px] flex flex-col relative">
              
              {/* STAGE 1: IDLE (Details View) */}
              {taskStatus === 'idle' && (
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                            {selectedTask.status === 'urgent' && (
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                                    {t.modal_urgent}
                                </span>
                            )}
                            <span className="text-slate-400 text-sm">{selectedTask.date}</span>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedTask.title}</h2>
                        
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.modal_description}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                            {selectedTask.fullDesc}
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-start space-x-3 mb-6">
                            <FileText className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                            <div>
                            <h4 className="text-blue-900 font-bold text-sm mb-1">{t.modal_action_req}</h4>
                            <p className="text-blue-700 text-sm">{selectedTask.actionText}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50">
                        <button 
                            onClick={() => setSelectedTask(null)}
                            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white transition-colors"
                        >
                            {t.modal_close}
                        </button>
                        <button 
                            onClick={handleProcessTask}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                        >
                            {t.modal_process} <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                  </div>
              )}

              {/* STAGE 2: PROCESSING (Large Loader) */}
              {taskStatus === 'processing' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 animate-in fade-in duration-300 text-center p-8">
                      <div className="relative mb-6">
                          <Loader2 size={64} className="text-blue-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{t.modal_processing_title}</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">
                         {t.modal_processing_desc}
                      </p>
                  </div>
              )}

              {/* STAGE 3: SUCCESS (Completion) */}
              {taskStatus === 'success' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 animate-in fade-in zoom-in-95 duration-300 text-center p-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                          <Check size={48} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{t.modal_success_title}</h3>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                          {t.modal_success_desc}
                      </p>
                      
                      <div className="bg-slate-100 px-4 py-2 rounded font-mono text-slate-600 text-sm mb-8 border border-slate-200">
                          {t.modal_trans_id}: TXN-{Math.floor(Math.random()*1000000)}
                      </div>

                      <button 
                          onClick={handleTaskDone}
                          className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                          {t.btn_done} <Check size={18} className="ml-2" />
                      </button>
                  </div>
              )}

           </div>
        </div>
      )}

      {/* Dashboard Top Section - Pending Tasks & Compliance Score */}
      {page === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Pending Tasks - Spans 2 cols */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-800">{t.pending_tasks}</h3>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
                  {tasks.length} {t.task_active}
                </span>
             </div>
             {tasks.length > 0 ? (
               <div className="space-y-4">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => handleTaskClick(task)}
                      className="flex items-start justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                         <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'urgent' ? 'bg-red-500 animate-pulse' : 'bg-blue-400'}`}></div>
                         <div>
                            <p className={`text-sm font-medium group-hover:text-blue-600 transition-colors ${task.status === 'urgent' ? 'text-blue-600' : 'text-slate-800'}`}>{task.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.desc}</p>
                         </div>
                      </div>
                      <div className="flex items-center text-slate-400 text-xs whitespace-nowrap ml-4">
                         <span>{task.date}</span>
                         <ChevronRight size={14} className="ml-1 text-slate-300 group-hover:text-blue-400" />
                      </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-8 text-center text-slate-400 flex flex-col items-center">
                  <CheckCircle size={32} className="mb-2 text-green-500 opacity-50" />
                  <p>All tasks completed!</p>
               </div>
             )}
          </div>

          {/* Compliance Score - Spans 1 col */}
          <div className="bg-slate-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <ShieldCheck size={80} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4 opacity-90">
                   <FileText size={16} />
                   <span className="text-sm font-semibold">{t.compliance_score}</span>
                </div>
                <div className="flex items-baseline mb-4">
                   <span className="text-5xl font-bold">94</span>
                   <span className="text-slate-400 text-lg ml-1">/100</span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
                   <div className="bg-green-500 h-full rounded-full w-[94%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                   {t.compliance_desc}
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
        >
            {page === 'tracking' ? t.btn_active : t.btn_my_dec}
        </button>
        <button 
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'upload' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
        >
            {t.btn_new}
        </button>
      </div>

      {activeTab === 'upload' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-10">
                <RefreshCw className="animate-spin text-blue-500 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-slate-800">{t.processing}</h3>
                <p className="text-slate-500 mt-2">{t.ocr_running}</p>
                <div className="w-64 h-2 bg-slate-100 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse w-2/3"></div>
                </div>
            </div>
          ) : (
            <>
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UploadCloud size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.upload_title}</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    {t.upload_desc}
                </p>
                <label className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-md hover:shadow-lg">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.png" />
                    {t.upload_btn}
                </label>
            </>
          )}
        </div>
      )}

      {activeTab === 'list' && (
        <div className="space-y-6">
          {page === 'tracking' && (
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center text-blue-800 mb-4">
               <ShieldCheck className="mr-3" />
               <p className="text-sm">Viewing active process flows. Use the swimlanes to track real-time status.</p>
             </div>
          )}
          
          {declarations.map((dec) => (
            <div key={dec.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{dec.goodsType} Declaration</h3>
                    <p className="text-sm text-slate-500 font-mono mt-1">{dec.id} • {dec.submitDate}</p>
                    <div className="flex gap-2 mt-2">
                        {dec.documents.map((doc, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{doc}</span>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{dec.currency} {dec.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">{t.declared_value}</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t.live_status}</h4>
                <Swimlane status={dec.status} language={language} />
              </div>

              {/* Validation Feedback */}
              {dec.status === DeclarationStatus.AUDIT_REQUIRED && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center border border-red-100">
                      <Clock className="mr-2" size={16} />
                      Pending Manual Audit: Risk model flagged {dec.anomalies.join(', ')}
                  </div>
              )}
               {dec.status === DeclarationStatus.CLEARED && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center border border-green-100">
                      <CheckCircle className="mr-2" size={16} />
                      Clearance Successful. Digital release note generated.
                  </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnterpriseView;