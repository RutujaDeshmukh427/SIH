import React from 'react';
import VisionInspector from './VisionInspector';
import { AlertTriangle, MapPin } from 'lucide-react';

export default function CitizenScanner({ onReportSubmitted }) {
  return (
    <div className="w-full mx-auto font-sans animate-fadeIn pb-20">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-text-3 bg-panel-darker inline-flex px-3 py-1.5 rounded-md border border-panel-line">
          <MapPin size={14} className="text-citizen-primary" />
          <span>Location: Maharashtra (Auto-detected)</span>
        </div>
      </div>

      <VisionInspector />

      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm text-center mt-6">
        <p className="text-sm font-medium text-slate-700 mb-3">Help enforce Legal Metrology standards and protect fellow consumers.</p>
        <button
          onClick={() => {
            if (onReportSubmitted) {
              onReportSubmitted({
                id: `AUD-${Math.floor(Math.random() * 100) + 9000}`,
                timestamp: "Just now",
                platform: "Citizen Report (Mobile)",
                product: "Citizen Uploaded Package",
                seller: "Unknown Local Seller",
                status: "violation",
                issue: "Missing / Illegible Mandatory Info",
                citation: "Rule 6 & 7",
                action: "Citizen Report - Pending Inspector Review",
                isCitizenReport: true,
              });
            }
          }}
          className="w-full max-w-sm mx-auto bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          <AlertTriangle size={17} className="text-amber-400" />
          <span className="tracking-wide">Report Violation to Authority</span>
        </button>
      </div>
    </div>
  );
}
