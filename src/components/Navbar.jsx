import React from "react";
import LogoMark from "./LogoMark";
import { UserCircle, Globe, Search } from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  userRole,
  onOpenProfile,
  language,
  setLanguage,
  onOpenLogin,
  isLoggedIn,
  currentUser,
  onLogout,
  onSwitchRole,
}) {

  return (
    <header className="border-b border-panel-line bg-panel/85 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Home Link */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer select-none active:scale-98 transition-transform py-1 px-2 rounded-xl hover:bg-panel-darker/60"
            onClick={() => setActiveTab("home")}
            title="Return to Home"
          >
            <LogoMark size={32} />
            <div className="flex items-center text-[25px] font-brand tracking-[-0.03em] select-none leading-none">
              <span className="font-semibold text-brass">Label</span>
              <span className="font-extrabold text-slate-900 ml-[1px]">Lens</span>
            </div>
          </div>

          {activeTab !== "home" && (
            <button
              onClick={() => setActiveTab("home")}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <span>← Home</span>
            </button>
          )}

        </div>

        {/* Center: Global Search Bar (Enterprise feature) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search products, manufacturers, or inspection IDs..." 
            className="w-full bg-slate-100 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl py-1.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass/50 transition-all placeholder:text-slate-400 shadow-inner"
          />
        </div>

        {/* Right Controls: Language Selector, Login Button & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex items-center bg-white border border-panel-line rounded-lg px-2.5 sm:px-3 py-1.5 hover:border-brass/50 transition-colors shadow-sm">
            <Globe size={15} className="text-brass mr-1.5 sm:mr-2 shrink-0" />
            <select
              value={language || "English"}
              onChange={(e) => setLanguage && setLanguage(e.target.value)}
              className="bg-transparent text-text-1 text-xs font-semibold focus:outline-none cursor-pointer appearance-none outline-none"
              style={{ background: 'transparent' }}
            >
              <option className="bg-panel text-text-1" value="English">EN - English</option>
              <option className="bg-panel text-text-1" value="Hindi">HI - हिन्दी</option>
              <option className="bg-panel text-text-1" value="Marathi">MR - मराठी</option>
              <option className="bg-panel text-text-1" value="Gujarati">GU - ગુજરાતી</option>
              <option className="bg-panel text-text-1" value="Tamil">TA - தமிழ்</option>
              <option className="bg-panel text-text-1" value="Telugu">TE - తెలుగు</option>
              <option className="bg-panel text-text-1" value="Kannada">KN - ಕನ್ನಡ</option>
              <option className="bg-panel text-text-1" value="Malayalam">ML - മലയാളം</option>
              <option className="bg-panel text-text-1" value="Bengali">BN - বাংলা</option>
              <option className="bg-panel text-text-1" value="Punjabi">PA - ਪੰਜਾਬੀ</option>
              <option className="bg-panel text-text-1" value="Urdu">UR - اردو</option>
              <option className="bg-panel text-text-1" value="Odia">OR - ଓଡ଼ିଆ</option>
              <option className="bg-panel text-text-1" value="Assamese">AS - অসমীয়া</option>
            </select>
          </div>

          {/* Auth Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-700">
                Hi, {currentUser?.name || "Officer"}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all border border-slate-200"
                title="Log out"
              >
                <span>Log out</span>
              </button>
            </div>
          ) : (
            onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-black active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all"
                title="Log in to LabelLens"
              >
                <span>Log in</span>
              </button>
            )
          )}

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center justify-center p-2 rounded-lg bg-white border border-panel-line text-text-2 hover:text-brass hover:border-brass/40 transition-all shadow-sm"
              title="User Profile & Settings"
            >
              <UserCircle size={19} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
