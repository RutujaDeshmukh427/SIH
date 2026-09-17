import React from "react";
import {
  ShieldCheck,
  Eye,
  Scan,
  Activity,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function HomePage({ onStartOfficial, onStartCitizen }) {
  // Mock recent activity data
  const recentActivity = [
    { id: 1, type: "Scan", title: "Organic Energy Pouch", status: "Pass", time: "2m ago" },
    { id: 2, type: "Report", title: "Missing MRP - Local Store", status: "Reviewing", time: "15m ago" },
    { id: 3, type: "Notice", title: "Notice #LMA-992 Issued", status: "Sent", time: "1h ago" },
  ];

  return (
    <div className="w-full space-y-12 pb-16 animate-fadeIn">
      
      {/* Premium Hero Banner (Amazon/Myntra style) */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-[11px] font-semibold tracking-wider uppercase mb-5 backdrop-blur-md">
              <Sparkles size={14} className="text-blue-300" />
              <span>LabelLens Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-brand mb-4 leading-tight">
              Welcome back to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">Intelligent Enforcement</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              Monitor compliance, inspect packaging, and issue notices instantly. Your AI-powered workspace for the Legal Metrology Act.
            </p>
            
            <button
              onClick={onStartOfficial}
              className="bg-white hover:bg-slate-50 text-slate-900 active:scale-95 font-bold text-sm px-8 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(56,189,248,0.2)] transition-all flex items-center justify-center gap-3 group"
            >
              <Scan size={18} className="text-blue-600" />
              <span>Start New Inspection</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-slate-400" />
            </button>
          </div>

          {/* Quick Stats Widget */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4 w-64">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1,204</div>
                <div className="text-xs text-slate-300">Compliant Scans</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4 w-64">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertCircle size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">43</div>
                <div className="text-xs text-slate-300">Notices Issued (Today)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (E-commerce Categories Style) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 font-brand flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Core Services
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service 1 */}
          <div 
            onClick={onStartOfficial}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Eye size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Enforcement Suite</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              Optical OCR, Rule 7 font calibration, and automated sub-millimeter measurements.
            </p>
            <div className="flex items-center text-blue-600 text-xs font-semibold uppercase tracking-wider">
              Launch Suite <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Service 2 */}
          <div 
            onClick={onStartCitizen}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Scan size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Citizen Scanner</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              Crowdsourced reporting and instant label verification for consumers.
            </p>
            <div className="flex items-center text-emerald-600 text-xs font-semibold uppercase tracking-wider">
              Open Scanner <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Service 3 */}
          <div 
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Vigilance Heatmap</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              Geographic monitoring of retail districts and packaging non-compliance clusters.
            </p>
            <div className="flex items-center text-amber-600 text-xs font-semibold uppercase tracking-wider">
              View Map <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity (Dashboard Style) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 font-brand flex items-center gap-2">
            <TrendingUp size={18} className="text-slate-700" />
            Recent Activity
          </h2>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'Scan' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'Report' ? 'bg-amber-100 text-amber-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}>
                  {activity.type === 'Scan' ? <Scan size={16} /> : 
                   activity.type === 'Report' ? <AlertCircle size={16} /> : 
                   <ShieldCheck size={16} />}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">{activity.title}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock size={12} /> {activity.time}
                  </div>
                </div>
              </div>
              <div className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                activity.status === 'Pass' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                activity.status === 'Reviewing' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {activity.status}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
