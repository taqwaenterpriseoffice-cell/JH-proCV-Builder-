import React from 'react';
import { 
  Palette, Type, Sliders, Check, Sparkles, Layout, 
  RotateCcw, Eye, ShieldCheck, FileCheck, Layers
} from 'lucide-react';
import { ResumeDocument, ThemeType, FontSize, PrintOptions } from '../types';
import { THEMES, ACCENT_COLORS, FONTS, DEFAULT_PRINT_OPTIONS } from '../constants';

interface CustomizationPanelProps {
  currentResume: ResumeDocument;
  onThemeChange: (theme: ThemeType) => void;
  onFontChange: (font: string) => void;
  onAccentColorChange: (hex: string) => void;
  onFontSizeChange: (size: FontSize) => void;
  onPrintOptionsChange: (options: PrintOptions) => void;
  onOpenTemplateGallery?: () => void;
  darkMode: boolean;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  currentResume,
  onThemeChange,
  onFontChange,
  onAccentColorChange,
  onFontSizeChange,
  onPrintOptionsChange,
  onOpenTemplateGallery,
  darkMode
}) => {
  const currentPrintOptions = currentResume.printOptions || DEFAULT_PRINT_OPTIONS;

  const toggleSection = (key: keyof PrintOptions) => {
    onPrintOptionsChange({
      ...currentPrintOptions,
      [key]: !currentPrintOptions[key]
    });
  };

  // Presets
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
    <div className={`rounded-3xl border p-5 sm:p-6 space-y-6 transition-all ${
      darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200/90 shadow-sm text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Sliders size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Template &amp; Style Customization
            </h3>
            <p className="text-[11px] text-slate-400">
              Adjust typography, color palette, and section layouts
            </p>
          </div>
        </div>

        {onOpenTemplateGallery && (
          <button
            type="button"
            onClick={onOpenTemplateGallery}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Change Template</span>
            <Layout size={12} />
          </button>
        )}
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Quick Formatting Presets
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
            <span className="text-[10px] text-slate-400 font-normal">Zero photo / anti-bias</span>
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
            <span className="text-[10px] text-slate-400 font-normal">Dual address &amp; refs</span>
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
            <span className="text-[10px] text-slate-400 font-normal">Dense 1-page fit</span>
          </button>
        </div>
      </div>

      {/* A4 Page Target Mode (1-Page, 2-Page, 3-Page, Auto) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Layers size={13} />
            <span>Target Page Length</span>
          </label>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 capitalize">
            {currentPrintOptions.pageMode || (currentPrintOptions.multiPage === false ? '1-page' : 'auto')}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          {[
            { id: 'auto', label: 'Auto Flow' },
            { id: '1-page', label: '1-Page' },
            { id: '2-page', label: '2-Page (Balanced)' },
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
                className={`py-1.5 rounded-xl text-xs font-bold transition-all truncate px-1 ${
                  isSelected 
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={label}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* A4 Page Margins (Compact, Normal, Spacious) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Sliders size={13} />
            <span>A4 Page Margins</span>
          </label>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 capitalize">
            {currentPrintOptions.pageMargin || 'normal'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          {[
            { id: 'compact', label: '10mm (Compact)' },
            { id: 'normal', label: '15mm (Standard)' },
            { id: 'spacious', label: '20mm (Spacious)' }
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
                className={`py-1.5 rounded-xl text-xs font-bold transition-all truncate px-1 ${
                  isSelected 
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={label}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Passport Photo Count Selection */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
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

      {/* Active Theme Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Layout size={13} />
            <span>Active Template</span>
          </label>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
            {THEMES.find(t => t.id === currentResume.theme)?.label || 'Modern'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {THEMES.map(tmpl => {
            const isSelected = currentResume.theme === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onThemeChange(tmpl.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2 ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${tmpl.color} flex-shrink-0`}></span>
                <span className="text-xs font-semibold truncate">{tmpl.label}</span>
                {isSelected && <Check size={12} className="ml-auto text-blue-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Customization */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Palette size={13} />
          <span>Accent Color</span>
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

          {/* Custom Hex Color Input */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
            <input
              type="color"
              value={currentResume.accentColor || '#2563eb'}
              onChange={(e) => onAccentColorChange(e.target.value)}
              className="w-8 h-8 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
              title="Custom Hex Picker"
              aria-label="Custom Accent Color Picker"
            />
            <span className="text-[11px] font-mono text-slate-500">
              {currentResume.accentColor || '#2563eb'}
            </span>
          </div>
        </div>
      </div>

      {/* Typography & Font Sizing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Font Family */}
        <div className="space-y-1.5">
          <label htmlFor="custom-font-select" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Type size={13} />
            <span>Typography Font</span>
          </label>
          <select
            id="custom-font-select"
            value={currentResume.font}
            onChange={(e) => onFontChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            {FONTS.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Font Density / Size */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Sliders size={13} />
            <span>Scale &amp; Spacing</span>
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

      {/* Section Visibility Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Eye size={13} />
            <span>Visible Resume Sections</span>
          </label>
          <button
            type="button"
            onClick={() => onPrintOptionsChange(DEFAULT_PRINT_OPTIONS)}
            className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1"
          >
            <RotateCcw size={11} />
            <span>Reset All</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { key: 'showPhoto', label: 'Passport Photo' },
            { key: 'showCareerObjective', label: 'Career Objective' },
            { key: 'showBioData', label: 'Personal Bio-Data' },
            { key: 'showFatherMother', label: "Parents' Names" },
            { key: 'showAddresses', label: 'Present & Perm Address' },
            { key: 'showReligion', label: 'Religion' },
            { key: 'showMaritalStatus', label: 'Marital Status' },
            { key: 'showOtherPersonal', label: 'NID & Blood Group' },
            { key: 'showEducation', label: 'Academic Qualifications' },
            { key: 'showExperience', label: 'Work Experience' },
            { key: 'showSkills', label: 'Skills & Proficiencies' },
            { key: 'showReferences', label: 'References' },
            { key: 'showDeclaration', label: 'Declaration & Signature' },
            { key: 'showProjects', label: 'Projects' },
            { key: 'showCertifications', label: 'Certifications' },
            { key: 'showLanguages', label: 'Languages' },
            { key: 'showAwards', label: 'Awards' },
            { key: 'showSocials', label: 'Social Profiles' },
          ].map(({ key, label }) => {
            const isChecked = Boolean(currentPrintOptions[key as keyof PrintOptions]);
            return (
              <label
                key={key}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-between cursor-pointer transition-colors ${
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
    </div>
  );
};
