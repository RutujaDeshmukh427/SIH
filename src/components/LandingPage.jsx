import React, { useState } from "react";
import { Sparkles, Scan, Scale, LogIn, ChevronRight, KeyRound, ShieldCheck, Building2, User } from "lucide-react";
import LogoMark from "./LogoMark";

export default function LandingPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("official");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email,
        role: selectedRole,
        name: email.split("@")[0] || "Officer",
      });
    }, 600);
  };

  const handleQuickLogin = (role) => {
    setSelectedRole(role);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: role === "official" ? "officer@doca.gov.in" : "citizen@labellens.in",
        role,
        name: role === "official" ? "Legal Metrology Inspector" : "Verified Citizen",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col md:flex-row font-sans selection:bg-blue-600/15 selection:text-blue-900 bg-grid-mesh relative">
      
      {/* Left Column: Branding and Value Proposition */}
      <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative">
        <div className="flex items-center gap-3">
          <LogoMark size={40} />
          <div className="flex items-center text-3xl font-brand tracking-[-0.03em] select-none leading-none">
            <span className="font-semibold text-brass">Label</span>
            <span className="font-extrabold text-slate-900 ml-[1px]">Lens</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center mt-12 mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold shadow-2xs w-fit mb-6">
            <Scale size={14} className="text-blue-600" />
            <span>Legal Metrology Act, 2009 & PCR 2011</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-brand mb-6">
            Automated AI Inspection for <span className="text-blue-600">Packaged Commodities</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal mb-10">
            Empowering enforcement agencies and citizens with computer-vision label analysis. 
            Automatically detect, extract, and validate mandatory packaging declarations, verify sub-millimeter 
            font heights, and generate legally enforceable notices.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-slate-900 font-brand">8 / 8</div>
              <div className="text-sm text-slate-500 mt-0.5">Mandatory Declarations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 font-brand">23 mm</div>
              <div className="text-sm text-slate-500 mt-0.5">₹5 Coin Fiducial</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 font-brand">SHA-256</div>
              <div className="text-sm text-slate-500 mt-0.5">Legal Evidence</div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-slate-400 font-mono">
          Department of Consumer Affairs (DoCA) • Ministry of Consumer Affairs, Food & Public Distribution
        </div>
      </div>

      {/* Right Column: Authentication */}
      <div className="w-full md:w-2/5 lg:w-1/3 bg-white border-l border-panel-line shadow-2xl flex flex-col justify-center p-8 sm:p-12 relative z-10">
        
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
              Welcome
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Log in to access the LabelLens suite.
            </p>
          </div>

          {/* Role Segmented Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setSelectedRole("official")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === "official"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 size={15} className={selectedRole === "official" ? "text-blue-600" : ""} />
              <span>Official</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("citizen")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === "citizen"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User size={15} className={selectedRole === "citizen" ? "text-blue-600" : ""} />
              <span>Citizen</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === "official" ? "officer@doca.gov.in" : "citizen@example.com"}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-slate-900 hover:bg-black active:scale-[0.98] text-white font-medium py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Continue with Email</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Quick Logins */}
          <button
            type="button"
            onClick={() => handleQuickLogin(selectedRole)}
            className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-sm mb-3"
          >
            <KeyRound size={16} className="text-slate-600" />
            <span>Quick Login (Passkey)</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleQuickLogin(selectedRole)}
            className="w-full bg-blue-50 hover:bg-blue-100 active:scale-[0.98] text-blue-800 font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-blue-200 shadow-sm"
          >
            <ShieldCheck size={16} className="text-blue-600" />
            <span>Login with DigiLocker</span>
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-8 leading-relaxed max-w-[250px] mx-auto">
            By continuing, you agree to our <span className="text-slate-600 font-medium cursor-pointer hover:underline">Terms of Service</span> and <span className="text-slate-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
