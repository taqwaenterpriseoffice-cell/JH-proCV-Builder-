import React, { useState } from 'react';
import { 
  X, Check, Sparkles, ZoomIn, ZoomOut, Maximize2, 
  ShieldCheck, Briefcase, Layout, ArrowRight
} from 'lucide-react';
import { ThemeOption, ThemeType, ResumeData } from '../types';
import { ResumePreview } from './ResumePreview';
import { ACCENT_COLORS, FONTS, DEFAULT_PRINT_OPTIONS, DEFAULT_DATA } from '../constants';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ThemeOption;
  onUseTemplate: (themeId: ThemeType, initialFont?: string, initialAccent?: string) => void;
  sampleData?: ResumeData;
  darkMode: boolean;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate,
  sampleData = DEFAULT_DATA,
  darkMode
}) => {
  const [accentColor, setAccentColor] = useState<string>('#2563eb');
  const [font, setFont] = useState<string>('Inter');
  const [zoom, setZoom] = useState<number>(0.85);

  if (!isOpen) return null;

  const handleUse = () => {
    onUseTemplate(template.id, font, accentColor);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
    >
      <div className={`w-full max-w-6xl h-[92vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-all ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Top Bar */}
        <div className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-4 flex-shrink-0 ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-200'
        }`}>
          {/* Template Info */}
          <div className="flex items-center gap-3 min-w-0">
            <span className={`w-3.5 h-3.5 rounded-full ${template.color} shadow-sm flex-shrink-0`}></span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="template-preview-title" className="text-base sm:text-lg font-black truncate">
                  {template.label}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                  {template.category}
                </span>
                {template.atsScore && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck size={11} />
                    <span>ATS: {template.atsScore}%</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden md:block">
                {template.description}
              </p>
            </div>
          </div>

          {/* Quick Customization Controls & Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Font Picker */}
            <div className="hidden lg:flex items-center gap-1 text-xs">
              <label htmlFor="preview-font-select" className="sr-only">Font</label>
              <select
                id="preview-font-select"
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                aria-label="Preview font family"
              >
                {FONTS.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Accent Color Presets */}
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
              {ACCENT_COLORS.slice(0, 5).map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAccentColor(c.hex)}
                  className={`w-5 h-5 rounded-full ${c.class} transition-transform ${
                    accentColor.toLowerCase() === c.hex.toLowerCase() ? 'ring-2 ring-blue-500 scale-125' : 'hover:scale-110'
                  }`}
                  title={`Test ${c.label}`}
                  aria-label={`Test ${c.label} accent`}
                />
              ))}
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
                title="Zoom Out"
                aria-label="Zoom out"
              >
                <ZoomOut size={13} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(0.85)}
                className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Fit to Height"
                aria-label="Fit preview"
              >
                <Maximize2 size={11} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(1.3, prev + 0.1))}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
                title="Zoom In"
                aria-label="Zoom in"
              >
                <ZoomIn size={13} />
              </button>
            </div>

            {/* Use Template Button */}
            <button
              type="button"
              onClick={handleUse}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/25 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label={`Use ${template.label} template`}
            >
              <Sparkles size={13} />
              <span>Use This Template</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Canvas: Large Zoomable Live Preview */}
          <div className="flex-1 bg-slate-200/80 dark:bg-slate-950 p-4 sm:p-8 overflow-auto flex justify-center items-start shadow-inner">
            <div 
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
              className="shadow-2xl rounded-sm overflow-hidden"
            >
              <ResumePreview
                data={sampleData}
                theme={template.id}
                font={font}
                language="en"
                printOptions={DEFAULT_PRINT_OPTIONS}
                accentColor={accentColor}
                fontSize="normal"
              />
            </div>
          </div>

          {/* Details Sidebar */}
          <aside className={`w-full md:w-72 border-t md:border-t-0 md:border-l p-5 sm:p-6 space-y-5 overflow-y-auto flex-shrink-0 ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/70 border-slate-200'
          }`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Template Profile
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {template.label}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {template.description}
              </p>
            </div>

            {template.recommendedFor && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <Briefcase size={13} />
                  <span>Recommended For</span>
                </div>
                <p className="text-xs text-blue-900 dark:text-blue-200 font-medium">
                  {template.recommendedFor}
                </p>
              </div>
            )}

            {template.layoutType && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Layout size={13} />
                  <span>Layout Architecture</span>
                </div>
                <p className="text-xs text-slate-500 capitalize">
                  {template.layoutType.replace('-', ' ')} structure
                </p>
              </div>
            )}

            {template.tags && template.tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Key Highlights
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <button
                type="button"
                onClick={handleUse}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                aria-label={`Confirm and customize template using ${template.label}`}
              >
                <span>Select Template & Customize</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition-colors"
                aria-label="Return to template gallery"
              >
                Back to Gallery
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
