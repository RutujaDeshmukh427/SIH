import React, { useState } from "react";
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
  AlertCircle,
  UploadCloud,
  Download,
  Edit2,
  FileText,
  Filter
} from "lucide-react";

export default function HomePage({ onStartOfficial, onStartCitizen, userRole }) {
  const [dragActive, setDragActive] = useState(false);
  const [filter, setFilter] = useState("All");

  // Mock recent activity data enriched with thumbnails
  const allActivity = [
    { id: 1, type: "Scan", title: "Organic Energy Pouch", status: "Pass", time: "2m ago", thumbnail: "https://images.unsplash.com/photo-1599021456807-25e0f54518cc?auto=format&fit=crop&w=150&q=80" },
    { id: 2, type: "Scan", title: "Ayurvedic Shampoo", status: "Rule 8 Violation", time: "15m ago", thumbnail: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=150&q=80" },
    { id: 3, type: "Report", title: "Missing MRP - Local Store", status: "Reviewing", time: "1h ago", thumbnail: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=150&q=80" },
    { id: 4, type: "Notice", title: "Notice #LMA-992 Issued", status: "Sent", time: "3h ago", thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=150&q=80" },
  ];

  const recentActivity = filter === "All" ? allActivity : allActivity.filter(a => a.status.includes(filter) || (filter === "Non-Compliant" && a.status === "Rule 8 Violation"));

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Trigger scan in official mode
      onStartOfficial();
    }
  };

  return (
    <div className="w-full space-y-8 pb-16 animate-fadeIn">
      
      {/* Enterprise Hero / Dashboard Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Drag & Drop Zone */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 flex flex-col justify-center shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex justify-between items-start mb-6 z-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-brand">Inspection Intake</h1>
              <p className="text-slate-400 text-sm">Automated triage for LMPC compliance. Supports batch uploads.</p>
            </div>
            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-mono text-slate-300">
              SHA-256 Enabled
            </div>
          </div>

          <div 
            className={`relative z-10 border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all ${
              dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadCloud size={48} className={`mb-4 ${dragActive ? 'text-blue-400' : 'text-slate-400'}`} />
            <h3 className="text-lg font-bold text-white mb-1">Drag & Drop package imagery here</h3>
            <p className="text-slate-400 text-sm mb-6">JPEG, PNG, or PDF formats up to 50MB</p>
            <button
              onClick={onStartOfficial}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Scan size={16} />
              <span>Browse Files</span>
            </button>
          </div>
        </div>

        {/* Right: Visual Analytics & Quick Stats */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">30-Day Compliance Trend</h2>
          
          {/* Simple Visual Graphic */}
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  className="text-slate-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-red-500"
                  strokeDasharray="20, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="60, 100"
                  strokeDashoffset="-20"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-amber-400"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-80"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-slate-900">8.4k</span>
                <span className="text-[10px] uppercase text-slate-500 font-bold">Scans</span>
              </div>
            </div>
            
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 60% Pass</div>
              <div className="flex items-center gap-1.5 text-red-700"><div className="w-2 h-2 rounded-full bg-red-500"></div> 20% Fail</div>
              <div className="flex items-center gap-1.5 text-amber-700"><div className="w-2 h-2 rounded-full bg-amber-400"></div> 20% Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Inspections</div>
          <div className="text-2xl font-bold text-slate-900">1,248</div>
          <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp size={12}/> +12% this week</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Compliant</div>
          <div className="text-2xl font-bold text-slate-900">892</div>
          <div className="text-xs font-medium text-slate-400 mt-2">71% of total</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Non-Compliant</div>
          <div className="text-2xl font-bold text-red-600">214</div>
          <div className="text-xs font-medium text-red-500 mt-2 flex items-center gap-1">Requires action</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Pending Reviews</div>
          <div className="text-2xl font-bold text-slate-900">142</div>
          <div className="text-xs font-medium text-slate-400 mt-2">Awaiting manual triage</div>
        </div>
      </section>

      {/* Services Grid (Role-Based) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 font-brand">Core Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            onClick={onStartOfficial}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Enforcement Suite</h3>
              <p className="text-xs text-slate-500">Full OCR & Rule extraction</p>
            </div>
          </div>

          <div 
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Generate Reports</h3>
              <p className="text-xs text-slate-500">Draft notices and citations</p>
            </div>
          </div>

          {userRole !== "official" ? (
            <div 
              onClick={onStartCitizen}
              className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <Scan size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Citizen Scanner</h3>
                <p className="text-xs text-slate-500">Public reporting tool</p>
              </div>
            </div>
          ) : (
            <div 
              className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pending Violations</h3>
                <p className="text-xs text-slate-500">Review flagged products</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enriched Recent Activity */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-bold text-slate-900 font-brand">Inspection Repository</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="All">All Activity</option>
                <option value="Non-Compliant">Non-Compliant</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Pass">Compliant</option>
              </select>
              <Filter size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <img src={activity.thumbnail} alt={activity.title} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                <div>
                  <div className="font-bold text-sm text-slate-900">{activity.title}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> {activity.time}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[10px] text-slate-400">ID: LMA-{activity.id}892</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                <div className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  activity.status.includes('Violation') ? 'bg-red-50 text-red-700 border border-red-200' :
                  activity.status === 'Reviewing' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  activity.status === 'Sent' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {activity.status}
                </div>
                <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                  <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors" title="Download PDF Report">
                    <Download size={16} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors" title="Edit Record">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors" title="View Evidence">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
