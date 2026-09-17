import React from "react";
import { Sparkles, Scan, FileText, Sliders, MapPin, Home, FileClock, AlertTriangle } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, onOpenScanner, userRole }) {
  const officialItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "vision", label: "Enforcement Suite", icon: Sparkles },
    { id: "rulesandbox", label: "Rule Engine", icon: Sliders },
    { id: "notices", label: "Generate Notices", icon: FileText },
    { id: "heatmap", label: "Vigilance Map", icon: MapPin },
  ];

  const citizenItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "citizen", label: "Citizen Scanner", icon: Sparkles },
    { id: "heatmap", label: "Vigilance Map", icon: MapPin },
  ];

  const navItems = userRole === "official" ? officialItems : citizenItems;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 shrink-0">
      {/* Search / Scan prominent action area */}
      <div className="p-4 pt-6 border-b border-slate-800">
        <button
          onClick={onOpenScanner}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors shadow-blue-500/20"
        >
          <Scan size={18} />
          <span>New Inspection</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-blue-600/10 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon size={18} className={isActive ? "text-blue-400" : "text-slate-400"} />
              {item.label}
            </button>
          );
        })}

        {userRole === "official" && (
          <>
            <div className="mt-8 mb-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reports</div>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200">
              <FileClock size={18} className="text-slate-400" />
              Inspection History
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200">
              <AlertTriangle size={18} className="text-slate-400" />
              Pending Violations
            </button>
          </>
        )}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        <div className="font-semibold text-slate-400 mb-1">LabelLens OS</div>
        <div>Version 2.4.1 (Stable)</div>
      </div>
    </aside>
  );
}
