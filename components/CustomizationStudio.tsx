import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRight, Sparkles, Sliders, Palette, 
  Type, Eye, Check, ZoomIn, ZoomOut, Maximize2, ShieldCheck, 
  FileCheck, RotateCcw, Layout, Search
} from 'lucide-react';
import { ResumeDocument, ThemeType, FontSize, PrintOptions } from '../types';
import { THEMES, ACCENT_COLORS, FONTS, DEFAULT_PRINT_OPTIONS } from '../constants';
import { ResumePreview } from './ResumePreview';

interface CustomizationStudioProps {
  currentResume: ResumeDocument;
  onThemeChange: (theme: ThemeType) => void;
  onFontChange: (font: string) => void;
  onAccentColorChange: (hex: string) => void;
  onFontSizeChange: (size: FontSize) => void;
  onPrintOptionsChange: (options: PrintOptions) => void;
  onBackToTemplates: () => void;
  onContinueToEditor: () => void;
  darkMode: boolean;
}

export const CustomizationStudio: React.FC<CustomizationStudioProps> = ({
  currentResume,
  onThemeChange,
  onFontChange,
  onAccentColorChange,
  onFontSizeChange,
  onPrintOptionsChange,
  onBackToTemplates,
  onContinueToEditor,
  darkMode
}) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const [activeTab, setActiveTab] = useState<'style' | 'templates' | 'sections'>('style');
  const [templateSearch, setTemplateSearch] = useState<string>('');

  const currentPrintOptions = currentResume.printOptions || DEFAULT_PRINT_OPTIONS;
  const currentThemeObj = THEMES.find(t => t.id === currentResume.theme) || THEMES[0];

  const filteredStudioTemplates = useMemo(() => {
    if (!templateSearch.trim()) return THEMES;
    const q = templateSearch.toLowerCase().trim();
    return THEMES.filter(t => 
      t.label.toLowerCase().includes(q) || 
      t.category.toLowerCase().includes(q) || 
      t.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  }, [templateSearch]);

  const toggleSection = (key: keyof PrintOptions) => {
    onPrintOptionsChange({
      ...currentPrintOptions,
      [key]: !currentPrintOptions[key]
    });
  };

  // One-click presets
  const applyPreset = (type: 'bd-standard' | 'ats' | 'executive' | 'compact') => {
    if (type === 'bd-standard') {
      onThemeChange('bd-standard' as ThemeType);
      onFontChange('Inter');
      onFontSizeChange('normal');
      onAccentColorChange('#047857');
      onPrintOptionsChange({
        showPhoto: true,
        photoCount: 1,
        showSummary: false,
        showCareerObjective: true,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showSkills: true,
        showSocials: true,
        showCertifications: true,
        showLanguages: true,
        showAwards: true,
        showBioData: true,
        showFatherMother: true,
        showAddresses: true,
        showReligion: true,
        showMaritalStatus: true,
        showOtherPersonal: true,
        showReferences: true,
        showDeclaration: true,
        showSignature: true,
        multiPage: true
      });
    } else if (type === 'ats') {
      onThemeChange('ats-international' as ThemeType);
      onFontChange('Inter');
      onFontSizeChange('compact');
      onAccentColorChange('#18181b');
      onPrintOptionsChange({
        showPhoto: false,
        photoCount: 0,
        showSummary: true,
        showCareerObjective: false,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showSkills: true,
        showSocials: false,
        showCertifications: true,
        showLanguages: true,
        showAwards: true,
        showBioData: false,
        showFatherMother: false,
        showAddresses: false,
        showReligion: false,
        showMaritalStatus: false,
        showOtherPersonal: false,
        showReferences: false,
        showDeclaration: false,
        showSignature: false,
        multiPage: false
      });
    } else if (type === 'executive') {
      onThemeChange('bd-executive' as ThemeType);
      onFontChange('Montserrat');
      onFontSizeChange('normal');
      onAccentColorChange('#1e3a8a');
      onPrintOptionsChange({
        showPhoto: true,
        photoCount: 1,
        showSummary: true,
        showCareerObjective: true,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showSkills: true,
        showSocials: true,
        showCertifications: true,
        showLanguages: true,
        showAwards: true,
        showBioData: true,
        showFatherMother: true,
        showAddresses: true,
        showReligion: true,
        showMaritalStatus: true,
        showOtherPersonal: true,
        showReferences: true,
        showDeclaration: true,
        showSignature: true,
        multiPage: true
      });
    } else if (type === 'compact') {
      onThemeChange('compact');
      onFontChange('Roboto');
      onFontSizeChange('compact');
      onAccentColorChange('#0d9488');
      onPrintOptionsChange({
        showPhoto: true,
        photoCount: 1,
        showSummary: true,
        showCareerObjective: false,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showSkills: true,
        showSocials: true,
        showCertifications: true,
        showLanguages: true,
        showAwards: true,
        showBioData: false,
        showFatherMother: false,
        showAddresses: false,
        showReligion: false,
        showMaritalStatus: false,
        showOtherPersonal: false,
        showReferences: false,
        showDeclaration: false,
        showSignature: false,
        multiPage: false
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col space-y-5 animate-in fade-in duration-200">
      {/* Top Header Bar: Steps, Back to Gallery, Continue to Editor */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all shadow-sm ${
        darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200/90 text-slate-900'
      }`}>
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={onBackToTemplates}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Back to template gallery"
          >
            <ArrowLeft size={14} />
            <span>Templates</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Step 2 of 3
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Customization Studio
            </span>
            <span className="hidden md:inline text-xs text-slate-400">
              ({currentThemeObj.label})
            </span>
          </div>
        </div>

        {/* Right: Primary Action to Editor */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 hidden lg:inline">
            Live preview updates instantly
          </span>
          <button
            type="button"
            onClick={onContinueToEditor}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Continue to Resume Editor"
          >
            <span>Continue to Resume Editor</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Customization Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customization Controls (5 cols on lg, 4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className={`rounded-3xl border overflow-hidden transition-all shadow-sm ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            {/* Control Tabs */}
            <div className="p-1.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'style'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Palette size={13} />
                <span>Style &amp; Colors</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'templates'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layout size={13} />
                <span>Template</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sections')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'sections'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye size={13} />
                <span>Sections</span>
              </button>
            </div>

            {/* TAB 1: STYLE & COLORS */}
            {activeTab === 'style' && (
              <div className="p-5 sm:p-6 space-y-6">
                {/* Formatting Presets */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>Quick Presets</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset('bd-standard')}
                      className="p-2.5 rounded-2xl border text-left hover:border-emerald-500 transition-all text-xs font-bold flex flex-col gap-0.5 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                    >
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                        <Sparkles size={13} />
                        <span>BD Standard</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Bio-Data + SSC/HSC</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset('ats')}
                      className="p-2.5 rounded-2xl border text-left hover:border-blue-500 transition-all text-xs font-bold flex flex-col gap-0.5 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                        <ShieldCheck size={13} />
                        <span>Pure ATS</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Zero photo / clean</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset('executive')}
                      className="p-2.5 rounded-2xl border text-left hover:border-blue-500 transition-all text-xs font-bold flex flex-col gap-0.5 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <Sparkles size={13} />
                        <span>BD Executive</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Dual address</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset('compact')}
                      className="p-2.5 rounded-2xl border text-left hover:border-blue-500 transition-all text-xs font-bold flex flex-col gap-0.5 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                        <FileCheck size={13} />
                        <span>1-Page Fit</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Dense fit</span>
                    </button>
                  </div>
                </div>

                {/* Passport Photo Count Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <span>Passport Photos (Optional)</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    {[
                      { count: 0, label: '0 (None)' },
                      { count: 1, label: '1 Photo' },
                      { count: 2, label: '2 Photos' },
                      { count: 3, label: '3 Photos' }
                    ].map(({ count, label }) => {
                      const isSelected = (!currentPrintOptions.showPhoto && count === 0) || (currentPrintOptions.showPhoto && (currentPrintOptions.photoCount ?? 1) === count);
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            if (count === 0) {
                              onPrintOptionsChange({ ...currentPrintOptions, showPhoto: false, photoCount: 0 });
                            } else {
                              onPrintOptionsChange({ ...currentPrintOptions, showPhoto: true, photoCount: count });
                            }
                          }}
                          className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected 
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* A4 Page Layout Mode */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                    <span>A4 Page Layout Mode</span>
                    <span className="text-[10px] text-blue-500 font-bold capitalize">
                      {currentPrintOptions.pageMode || (currentPrintOptions.multiPage === false ? '1-Page' : 'Auto')}
                    </span>
                  </label>
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    {[
                      { id: 'auto', label: 'Auto' },
                      { id: '1-page', label: '1-Page' },
                      { id: '2-page', label: '2-Page' },
                      { id: '3-page', label: '3-Page' }
                    ].map(({ id, label }) => {
                      const currentMode = currentPrintOptions.pageMode || (currentPrintOptions.multiPage === false ? '1-page' : 'auto');
                      const isSelected = currentMode === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => onPrintOptionsChange({
                            ...currentPrintOptions,
                            pageMode: id as any,
                            multiPage: id !== '1-page'
                          })}
                          className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected 
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* A4 Page Margins */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                    <span>A4 Margins</span>
                    <span className="text-[10px] text-emerald-500 font-bold capitalize">
                      {currentPrintOptions.pageMargin || 'Normal (15mm)'}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    {[
                      { id: 'compact', label: '10mm Compact' },
                      { id: 'normal', label: '15mm Normal' },
                      { id: 'spacious', label: '20mm Wide' }
                    ].map(({ id, label }) => {
                      const currentMargin = currentPrintOptions.pageMargin || 'normal';
                      const isSelected = currentMargin === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => onPrintOptionsChange({
                            ...currentPrintOptions,
                            pageMargin: id as any
                          })}
                          className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected 
                              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Color Palette */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Palette size={12} />
                    <span>Accent Palette</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {ACCENT_COLORS.map(c => {
                      const isSelected = (currentResume.accentColor || '#2563eb').toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => onAccentColorChange(c.hex)}
                          className={`w-8 h-8 rounded-full ${c.class} transition-all flex items-center justify-center shadow-xs ${
                            isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                          }`}
                          title={c.label}
                          aria-label={`Select accent color ${c.label}`}
                        >
                          {isSelected && <Check size={14} className="text-white drop-shadow-sm" />}
                        </button>
                      );
                    })}

                    {/* Custom Hex Color Picker */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
                      <input
                        type="color"
                        value={currentResume.accentColor || '#2563eb'}
                        onChange={(e) => onAccentColorChange(e.target.value)}
                        className="w-8 h-8 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
                        title="Custom Hex Picker"
                        aria-label="Custom Hex Picker"
                      />
                      <span className="text-[11px] font-mono text-slate-500">
                        {currentResume.accentColor || '#2563eb'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Typography Font */}
                <div className="space-y-1.5">
                  <label htmlFor="studio-font-select" className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Type size={12} />
                    <span>Typography Font</span>
                  </label>
                  <select
                    id="studio-font-select"
                    value={currentResume.font}
                    onChange={(e) => onFontChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                  >
                    {FONTS.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>

                {/* Layout Density / Scale */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Sliders size={12} />
                    <span>Layout Scale &amp; Density</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    {(['compact', 'normal', 'spacious'] as FontSize[]).map(size => {
                      const isSelected = (currentResume.fontSize || 'normal') === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => onFontSizeChange(size)}
                          className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                            isSelected 
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TEMPLATE SELECTOR */}
            {activeTab === 'templates' && (
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Switch Active Template
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate max-w-[140px]">
                    {currentThemeObj.label}
                  </span>
                </div>

                {/* Quick Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={13} />
                  </div>
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Search 70+ templates..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {templateSearch && (
                    <button
                      type="button"
                      onClick={() => setTemplateSearch('')}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                  {filteredStudioTemplates.map(tmpl => {
                    const isSelected = currentResume.theme === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => onThemeChange(tmpl.id)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-3 h-3 rounded-full ${tmpl.color} flex-shrink-0`}></span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{tmpl.label}</div>
                            <div className="text-[10px] text-slate-400 truncate">{tmpl.category}</div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white flex-shrink-0">
                            Active
                          </span>
                        ) : tmpl.atsScore ? (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                            ATS {tmpl.atsScore}%
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                  {filteredStudioTemplates.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No templates match "{templateSearch}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: SECTION VISIBILITY */}
            {activeTab === 'sections' && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Visible Resume Sections
                  </span>
                  <button
                    type="button"
                    onClick={() => onPrintOptionsChange(DEFAULT_PRINT_OPTIONS)}
                    className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1"
                  >
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {[
                    { key: 'showPhoto', label: 'Passport Photo' },
                    { key: 'showCareerObjective', label: 'Career Objective' },
                    { key: 'showBioData', label: 'Personal Bio-Data Details' },
                    { key: 'showFatherMother', label: "Parents' Names" },
                    { key: 'showAddresses', label: 'Dual Addresses (Present & Permanent)' },
                    { key: 'showReligion', label: 'Religion' },
                    { key: 'showMaritalStatus', label: 'Marital Status' },
                    { key: 'showOtherPersonal', label: 'NID, Blood Group & Gender' },
                    { key: 'showEducation', label: 'Academic Qualifications (SSC, HSC, Univ)' },
                    { key: 'showExperience', label: 'Work Experience' },
                    { key: 'showSkills', label: 'Technical & Soft Skills' },
                    { key: 'showReferences', label: 'References & Referees' },
                    { key: 'showDeclaration', label: 'Declaration & Signature' },
                    { key: 'showProjects', label: 'Projects & Highlights' },
                    { key: 'showCertifications', label: 'Certifications' },
                    { key: 'showLanguages', label: 'Languages' },
                    { key: 'showAwards', label: 'Awards & Honors' },
                    { key: 'showSocials', label: 'Social Profiles & Links' },
                  ].map(({ key, label }) => {
                    const isChecked = Boolean(currentPrintOptions[key as keyof PrintOptions]);
                    return (
                      <label
                        key={key}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                            : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span>{label}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSection(key as keyof PrintOptions)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Continue Action on Mobile & Tablet */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={onContinueToEditor}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                aria-label="Continue to Resume Editor"
              >
                <span>Continue to Resume Editor</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Large Live CV Preview (7 cols on lg, 8 cols on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3 sticky top-20">
          {/* Zoom Toolbar for Live Preview */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Eye size={14} />
                <span>Live Studio Preview</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
                title="Zoom Out"
                aria-label="Zoom out live preview"
              >
                <ZoomOut size={13} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(0.85)}
                className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Fit to Screen"
                aria-label="Fit live preview"
              >
                <Maximize2 size={11} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(1.3, prev + 0.1))}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
                title="Zoom In"
                aria-label="Zoom in live preview"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Large Live Paper Canvas */}
          <div className="bg-slate-200/80 dark:bg-slate-950 p-3 sm:p-6 rounded-3xl border border-slate-300/80 dark:border-slate-800 overflow-x-auto shadow-inner flex justify-center max-h-[82vh] overflow-y-auto">
            <div 
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
              className="w-full flex justify-center"
            >
              <ResumePreview
                data={currentResume.data}
                theme={currentResume.theme}
                font={currentResume.font}
                language={currentResume.language}
                printOptions={currentResume.printOptions}
                accentColor={currentResume.accentColor}
                fontSize={currentResume.fontSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
