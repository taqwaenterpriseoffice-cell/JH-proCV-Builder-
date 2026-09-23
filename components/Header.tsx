import React, { useState } from 'react';
import { 
  FileText, Sparkles, Sliders, Moon, Sun, 
  Download, Printer, Share2, Layers, Check, Globe, Layout, Store, Mail, FileUp, QrCode
} from 'lucide-react';
import { ResumeDocument, Language, ActiveView } from '../types';
import { triggerBrowserPrint } from '../utils/exportUtils';
import { ShopUser } from '../services/authService';

interface HeaderProps {
  currentResume: ResumeDocument;
  onUpdateTitle: (newTitle: string) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenAI: () => void;
  onOpenPrintOptions: () => void;
  onExportPDF: () => void;
  onExportImage: () => void;
  isExporting: boolean;
  language: Language;
  onSwitchLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  resumeCount: number;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  currentUser?: ShopUser | null;
  onOpenShopModal?: () => void;
  onOpenImportModal?: () => void;
  onOpenCustomerSlip?: () => void;
  onExportWord?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentResume,
  onUpdateTitle,
  activeView,
  setActiveView,
  onOpenAI,
  onOpenPrintOptions,
  onExportPDF,
  onExportImage,
  isExporting,
  language,
  onSwitchLanguage,
  darkMode,
  setDarkMode,
  resumeCount,
  showToast,
  currentUser,
  onOpenShopModal,
  onOpenImportModal,
  onOpenCustomerSlip,
  onExportWord
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentResume.title);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentResume.title} - JH Soft CV`,
        text: `Created with JH Soft CV (cv.jhsoft.online)`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      if (showToast) {
        showToast('Link copied to clipboard!', 'success');
      }
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-colors border-b ${
      darkMode 
        ? 'bg-slate-900/95 border-slate-800 text-slate-100' 
        : 'bg-white/95 border-slate-200 text-slate-800'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand & Resume Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button 
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0 text-left rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            title="JH Soft CV - Go to Dashboard"
            aria-label="JH Soft CV - Go to Dashboard"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 group-hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 transition-all flex-shrink-0">
              <FileText size={18} className="stroke-[2.2]" />
            </div>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">JH Soft</span>
                <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">CV</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-none">cv.jhsoft.online</span>
            </div>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-0.5 sm:mx-1"></div>

          {/* Document Title with Inline Edit */}
          <div className="min-w-0 flex items-center gap-1.5">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <label htmlFor="header-resume-title-input" className="sr-only">Edit Resume Title</label>
                <input
                  id="header-resume-title-input"
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                  autoFocus
                  className="px-2 py-1 text-xs sm:text-sm font-semibold rounded bg-slate-100 dark:bg-slate-800 border border-blue-500 outline-none w-28 sm:w-56"
                />
                <button 
                  type="button"
                  onClick={handleTitleSubmit}
                  className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded focus-visible:ring-2 focus-visible:ring-emerald-500"
                  aria-label="Save resume title"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => {
                  setTitleInput(currentResume.title);
                  setIsEditingTitle(true);
                }}
                className="group flex items-center gap-1 cursor-pointer max-w-[85px] xs:max-w-[120px] sm:max-w-[220px] text-left rounded focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                title="Click to rename document"
                aria-label={`Current resume: ${currentResume.title}. Click to rename`}
              >
                <span className="text-xs sm:text-sm font-semibold truncate text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {currentResume.title}
                </span>
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline" aria-hidden="true">✎</span>
              </button>
            )}

            <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto-saved
            </span>
          </div>
        </div>

        {/* Center View Switcher (Desktop & Tablet) */}
        <nav aria-label="Desktop Workspace Views" className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'dashboard'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>Dashboard</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-600 px-1.5 py-0.2 rounded-full font-bold">
              {resumeCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'templates'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layout size={14} />
            <span>Templates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'edit'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Editor
          </button>

          <button
            type="button"
            onClick={() => setActiveView('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hidden lg:block ${
              activeView === 'split'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Workspace
          </button>

          <button
            type="button"
            onClick={() => setActiveView('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'preview'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Preview
          </button>

          <button
            type="button"
            onClick={() => setActiveView('cover-letter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'cover-letter'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Create and customize matching cover letter"
          >
            <Mail size={13} className="text-emerald-500" />
            <span>Cover Letter</span>
          </button>
        </nav>

        {/* Right Actions: Shop Account, AI Assistant, Print Options, Export & Theme */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Shop Account & Cloud Sync */}
          {onOpenShopModal && (
            <button
              type="button"
              onClick={onOpenShopModal}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentUser
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/80 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              }`}
              title={currentUser ? `শপ: ${currentUser.shopName} (অনলাইন সিঙ্ক সক্রিয়)` : "শপ অ্যাকাউন্ট ও অনলাইন ডেটাবেজ"}
              aria-label="Shop Account and Online Sync"
            >
              <Store size={15} className={currentUser ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'} />
              <span className="max-w-[100px] truncate hidden sm:inline">
                {currentUser ? currentUser.shopName : 'শপ অ্যাকাউন্ট'}
              </span>
              {currentUser && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="অনলাইন সিঙ্ক চালু" />
              )}
            </button>
          )}

          {/* Import Old CV / PDF Button */}
          {onOpenImportModal && (
            <button
              type="button"
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Import old PDF or paste BDJobs CV"
              aria-label="Import old CV or PDF"
            >
              <FileUp size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">Import CV</span>
            </button>
          )}

          {/* Customer Slip & Mobile QR Button */}
          {onOpenCustomerSlip && (
            <button
              type="button"
              onClick={onOpenCustomerSlip}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all cursor-pointer shadow-xs active:scale-95"
              title="কাস্টমার প্রিন্ট স্লিপ ও মোবাইল কিউআর কোড"
              aria-label="Customer Print Slip and Mobile QR"
            >
              <QrCode size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="hidden xl:inline">স্লিপ / কিউআর</span>
            </button>
          )}

          {/* AI Career Assistant Button */}
          <button
            type="button"
            onClick={onOpenAI}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
            title="Open AI Career Assistant"
            aria-label="Open AI Career Assistant"
          >
            <Sparkles size={14} className="animate-spin-slow" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span className="sm:hidden text-[11px]">AI</span>
          </button>

          {/* Section Options Modal Trigger */}
          <button
            type="button"
            onClick={onOpenPrintOptions}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center border border-slate-200/80 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500"
            title="Custom Sections & Print Visibility"
            aria-label="Document formatting and print options"
          >
            <Sliders size={16} />
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/80 dark:border-slate-700" role="group" aria-label="Language selection">
            <button
              type="button"
              onClick={() => onSwitchLanguage('en')}
              className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onSwitchLanguage('bn')}
              className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all ${
                language === 'bn'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-label="Switch to Bengali"
            >
              বাং
            </button>
          </div>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </button>

          {/* Export Actions Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-1 sm:gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-expanded={showExportMenu}
              aria-haspopup="true"
              aria-label="Export resume options"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>

            {showExportMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowExportMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Export Document
                </div>
                
                {/* Print Vector PDF (ATS Selectable Text) */}
                <button
                  type="button"
                  onClick={() => {
                    triggerBrowserPrint();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  aria-label="Print or save as ATS selectable Vector PDF"
                >
                  <Printer size={15} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <div>Print / Vector PDF</div>
                    <div className="text-[10px] text-slate-400 font-normal">Selectable text &amp; ATS-perfect</div>
                  </div>
                </button>

                {/* Raster PDF */}
                <button
                  type="button"
                  onClick={onExportPDF}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  aria-label="Download PDF document file"
                >
                  <Download size={15} className="text-indigo-600 flex-shrink-0" />
                  <div>
                    <div>Download PDF File</div>
                    <div className="text-[10px] text-slate-400 font-normal">Standard A4 multi-page document</div>
                  </div>
                </button>

                {/* High Res PNG */}
                <button
                  type="button"
                  onClick={onExportImage}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  aria-label="Export resume as high resolution PNG image"
                >
                  <FileText size={15} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <div>Export Image (PNG)</div>
                    <div className="text-[10px] text-slate-400 font-normal">High-DPI for social/portfolios</div>
                  </div>
                </button>

                {/* Microsoft Word DOCX Export */}
                {onExportWord && (
                  <button
                    type="button"
                    onClick={onExportWord}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                    aria-label="Export resume as Microsoft Word Document (.docx)"
                  >
                    <FileText size={15} className="text-blue-700 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">Microsoft Word (.docx)</span>
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 px-1 py-0.2 rounded">DOCX</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">ওয়ার্ডে সম্পূর্ণ এডিটেবল ফাইল</div>
                    </div>
                  </button>
                )}

                {onOpenCustomerSlip && (
                  <button
                    type="button"
                    onClick={onOpenCustomerSlip}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                    aria-label="Customer Print Slip & Mobile QR Transfer"
                  >
                    <QrCode size={15} className="text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>কাস্টমার স্লিপ ও কিউআর</span>
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-1 py-0.2 rounded">দোকান</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">মোবাইলে ডাউনলোড কিউআর ও মানি রিসিট</div>
                    </div>
                  </button>
                )}

                <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>

                <button
                  type="button"
                  onClick={onOpenPrintOptions}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  aria-label="Customize sections and print options"
                >
                  <Sliders size={15} className="text-amber-500 flex-shrink-0" />
                  <div>
                    <div>Section &amp; Print Options...</div>
                    <div className="text-[10px] text-slate-400 font-normal">Toggle visible sections before export</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  aria-label="Share resume link"
                >
                  <Share2 size={15} className="text-slate-500 flex-shrink-0" />
                  <span>Share Resume Link</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
