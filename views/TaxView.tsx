
import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { VOLUME_DATA, RISK_DISTRIBUTION_DATA, MOCK_DECLARATIONS, TRANSLATIONS } from '../constants';
import { Declaration, Page, Language } from '../types';
import RiskCard from '../components/RiskCard';
import { AlertOctagon, TrendingUp, Users, Search, Settings, AlertTriangle, Globe, FileText, Check, Loader2, X, FileCheck, CheckCircle } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

interface TaxViewProps {
  page: Page;
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Simulated Log Entry for Anomalies
interface LogEntry {
    id: number;
    time: string;
    event: string;
    origin: string;
    status: string;
    riskLevel: 'high' | 'medium' | 'low';
}

const TaxView: React.FC<TaxViewProps> = ({ page, language, setLanguage }) => {
  const t = TRANSLATIONS[language];
  
  // State for Risk Queue (Mutable List)
  const [riskQueue, setRiskQueue] = useState<Declaration[]>(
      MOCK_DECLARATIONS.filter(d => d.riskScore > 40)
  );
  
  const [selectedRisk, setSelectedRisk] = useState<Declaration | null>(null);
  
  // Interactions State
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showToast, setShowToast] = useState(false); // Toast State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Initialize selected risk if null and queue has items
  useEffect(() => {
    if (!selectedRisk && riskQueue.length > 0) {
        setSelectedRisk(riskQueue[0]);
    }
  }, []);

  // Reset interactions when selection changes
  useEffect(() => {
    setIsDocsOpen(false);
    setAuditStatus('idle');
  }, [selectedRisk]);

  // Handle Audit Click
  const handleStartAudit = () => {
    setAuditStatus('loading');
    
    // 1. Simulate Processing Time
    setTimeout(() => {
        setAuditStatus('success');
        setShowToast(true); // Show Toast
        
        // Hide Toast after 5 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 5000);

        // 2. Remove Item from Queue after a short delay (so user sees the Success state)
        setTimeout(() => {
            if (selectedRisk) {
                // Remove current item
                const nextQueue = riskQueue.filter(d => d.id !== selectedRisk.id);
                setRiskQueue(nextQueue);
                
                // Auto-select next item or clear
                if (nextQueue.length > 0) {
                    setSelectedRisk(nextQueue[0]);
                } else {
                    setSelectedRisk(null);
                }
                
                // Reset button status for the next item
                setAuditStatus('idle');
            }
        }, 1000); 

    }, 2000);
  };

  // Live Feed Simulation for Anomalies Page
  useEffect(() => {
    if (page === 'anomalies') {
        const events = ['Price Mismatch', 'Invalid HS Code', 'Weight Discrepancy', 'Route Anomaly', 'Doc Missing'];
        const origins = ['Shenzhen Port', 'Ningbo Port', 'Shanghai Air', 'HK Border', 'Tianjin Hub'];
        
        const interval = setInterval(() => {
            const newLog: LogEntry = {
                id: Date.now(),
                time: new Date().toLocaleTimeString('en-GB'),
                event: events[Math.floor(Math.random() * events.length)],
                origin: origins[Math.floor(Math.random() * origins.length)],
                status: Math.random() > 0.5 ? t.feed_status_detected : t.feed_status_analyzing,
                riskLevel: Math.random() > 0.7 ? 'high' : 'medium'
            };
            setLogs(prev => [newLog, ...prev].slice(0, 15)); // Keep last 15
        }, 1500);
        return () => clearInterval(interval);
    }
  }, [page, t]);

  // Settings Page
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
             <h3 className="font-semibold text-slate-800 mb-4">{t.settings_algo}</h3>
             <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-600">{t.settings_threshold}</span>
                     <div className="flex items-center space-x-3">
                        <input type="range" className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <span className="font-mono bg-white px-2 py-1 rounded border min-w-[3rem] text-center">80%</span>
                     </div>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-600">{t.settings_sampling}</span>
                     <div className="flex items-center space-x-3">
                        <input type="range" className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <span className="font-mono bg-white px-2 py-1 rounded border min-w-[3rem] text-center">5%</span>
                     </div>
                 </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Anomalies Page (Live Feed)
  if (page === 'anomalies') {
      return (
          <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 p-6 text-slate-100 min-h-[600px] font-mono">
              <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                  <div className="flex items-center space-x-3">
                      <div className="relative">
                          <AlertTriangle className="text-yellow-500 animate-pulse" />
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                          </span>
                      </div>
                      <h2 className="text-xl font-bold">{t.anomalies_title}</h2>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      LIVE STREAM
                  </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-xs font-bold text-slate-500 mb-2 px-4">
                  <div>{t.feed_col_time}</div>
                  <div>{t.feed_col_event}</div>
                  <div>{t.feed_col_origin}</div>
                  <div>{t.feed_col_status}</div>
              </div>

              <div className="space-y-1">
                  {logs.map((log) => (
                      <div key={log.id} className="grid grid-cols-4 gap-4 text-sm px-4 py-3 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors border-l-2 border-transparent hover:border-blue-500 animate-in fade-in slide-in-from-right-4 duration-300">
                          <div className="text-slate-400">{log.time}</div>
                          <div className={`${log.riskLevel === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>{log.event}</div>
                          <div className="text-slate-300">{log.origin}</div>
                          <div>
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${log.status === t.feed_status_detected ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                  {log.status}
                              </span>
                          </div>
                      </div>
                  ))}
                  {logs.length === 0 && <div className="text-center py-10 text-slate-600">Initializing Sensor Stream...</div>}
              </div>
          </div>
      );
  }

  const showDashboard = page === 'dashboard';
  const showRisk = page === 'dashboard' || page === 'risk';
  const showAudit = page === 'dashboard' || page === 'audit';

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {showToast && (
          <div className="fixed bottom-8 right-8 z-50 bg-white border-l-4 border-green-500 shadow-2xl rounded-r-lg p-5 flex items-start space-x-4 animate-in fade-in slide-in-from-bottom-6 duration-300 max-w-sm">
              <div className="p-2 bg-green-50 rounded-full text-green-600">
                  <FileCheck size={24} />
              </div>
              <div>
                  <h4 className="text-slate-800 font-bold">Audit Completed</h4>
                  <p className="text-slate-500 text-sm mt-1">{t.toast_audit_complete}</p>
              </div>
          </div>
      )}

      {/* Modal for Documents */}
      {isDocsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 transform scale-100 transition-transform">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-lg text-slate-800">{t.doc_viewer_title}</h3>
                      <button onClick={() => setIsDocsOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="space-y-3">
                      {selectedRisk?.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group">
                              <FileText className="text-slate-400 group-hover:text-blue-500 mr-3" size={20} />
                              <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-700">{doc}</p>
                                  <p className="text-xs text-slate-400">PDF • 2.4 MB</p>
                              </div>
                              <div className="text-blue-600 opacity-0 group-hover:opacity-100 text-xs font-semibold">
                                  OPEN
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                      <button onClick={() => setIsDocsOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200">
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* KPI Cards - Only on Dashboard */}
      {showDashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-slate-500">{t.kpi_total}</h3>
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
            </div>
            <p className="text-3xl font-bold text-slate-800">1,284</p>
            <p className="text-xs text-green-600 font-medium mt-1">+12.5% from yesterday</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-slate-500">{t.kpi_high}</h3>
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertOctagon size={20} /></div>
            </div>
            <p className="text-3xl font-bold text-slate-800">23</p>
            <p className="text-xs text-red-600 font-medium mt-1">Requires immediate attention</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-slate-500">{t.kpi_auto}</h3>
                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Users size={20} /></div>
            </div>
            <p className="text-3xl font-bold text-slate-800">94.2%</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Target: 95%</p>
            </div>
        </div>
      )}

      {/* Charts Section */}
      {showRisk && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">{t.chart_vol}</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VOLUME_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{t.chart_risk}</h3>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={RISK_DISTRIBUTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {RISK_DISTRIBUTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                {RISK_DISTRIBUTION_DATA.map((entry, index) => (
                    <div key={index} className="flex items-center text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: COLORS[index]}}></span>
                        {entry.name.split(' ')[0]}
                    </div>
                ))}
            </div>
            </div>
        </div>
      )}

      {/* Risk Queue & Detail Split View */}
      {showAudit && (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${page === 'audit' ? 'h-[70vh]' : 'h-[500px]'}`}>
            {/* List */}
            <div className="bg-slate-50 rounded-xl p-4 overflow-y-auto border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">{t.audit_queue}</h3>
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{riskQueue.length}</span>
                </div>
                <div className="space-y-3">
                    {riskQueue.length > 0 ? (
                        riskQueue.map(dec => (
                            <RiskCard 
                                key={dec.id} 
                                declaration={dec} 
                                onInspect={() => setSelectedRisk(dec)} 
                                isSelected={selectedRisk?.id === dec.id}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                            <CheckCircle size={32} className="mb-2 text-green-500 opacity-50" />
                            <p className="text-sm">Queue Cleared</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8 overflow-y-auto relative">
                {selectedRisk ? (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedRisk.companyName}</h2>
                                <p className="text-slate-500 mt-1">Ref: {selectedRisk.id}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => setIsDocsOpen(true)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center"
                                >
                                    <FileText size={16} className="mr-2" />
                                    {t.btn_view_docs}
                                </button>
                                <button 
                                    onClick={handleStartAudit}
                                    disabled={auditStatus !== 'idle'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all min-w-[120px] justify-center ${
                                        auditStatus === 'success' 
                                            ? 'bg-green-600 text-white cursor-default'
                                            : auditStatus === 'loading'
                                                ? 'bg-blue-400 text-white cursor-wait'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {auditStatus === 'loading' && <Loader2 className="animate-spin mr-2" size={16} />}
                                    {auditStatus === 'success' && <Check className="mr-2" size={16} />}
                                    {auditStatus === 'idle' ? t.btn_start_audit : (auditStatus === 'loading' ? t.btn_auditing : t.btn_audited)}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.model_expl}</h4>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">HS Code Consistency</span>
                                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="bg-green-500 h-full w-[90%]"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Price Deviation</span>
                                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="bg-red-500 h-full w-[85%]"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Route Logic</span>
                                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="bg-yellow-500 h-full w-[60%]"></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 italic">Based on Isolation Forest Algorithm results.</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.dec_summary}</h4>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between py-1 border-b border-slate-50">
                                        <dt className="text-slate-500">Amount</dt>
                                        <dd className="font-medium text-slate-900">{selectedRisk.currency} {selectedRisk.amount.toLocaleString()}</dd>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-slate-50">
                                        <dt className="text-slate-500">Goods Type</dt>
                                        <dd className="font-medium text-slate-900">{selectedRisk.goodsType}</dd>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-slate-50">
                                        <dt className="text-slate-500">HS Code</dt>
                                        <dd className="font-medium text-slate-900">{selectedRisk.hsCode}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center"><Search size={16} className="mr-2"/> {t.rec_action}</h4>
                            <p className="text-sm text-yellow-700">
                                The declared value for <strong>{selectedRisk.goodsType}</strong> deviates significantly from the historical average for this origin port. Request "Proof of Value" documents or initiate a physical inspection.
                            </p>
                        </div>

                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <CheckCircle size={48} className="mb-4 opacity-20" />
                        <p>No high-risk declarations pending review.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default TaxView;
