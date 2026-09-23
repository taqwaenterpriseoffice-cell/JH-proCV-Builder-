import React from 'react';
import { X, Sliders, Check, Eye, EyeOff, Printer, Palette, Type } from 'lucide-react';
import { PrintOptions, FontSize } from '../types';
import { ACCENT_COLORS, FONTS } from '../constants';
import { triggerBrowserPrint } from '../utils/exportUtils';

interface PrintOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: PrintOptions;
  onChangeOptions: (options: PrintOptions) => void;
  accentColor?: string;
  onChangeAccentColor: (colorHex: string) => void;
  font: string;
  onChangeFont: (font: string) => void;
  fontSize?: FontSize;
  onChangeFontSize: (size: FontSize) => void;
  darkMode: boolean;
}

export const PrintOptionsModal: React.FC<PrintOptionsModalProps> = ({
  isOpen,
  onClose,
  options,
  onChangeOptions,
  accentColor = '#2563eb',
  onChangeAccentColor,
  font,
  onChangeFont,
  fontSize = 'normal',
  onChangeFontSize,
  darkMode
}) => {
  if (!isOpen) return null;

  const toggleOption = (key: keyof PrintOptions) => {
    onChangeOptions({
      ...options,
      [key]: !options[key]
    });
  };

  const sections: { key: keyof PrintOptions; label: string; desc: string }[] = [
    { key: 'showPhoto', label: 'Passport Photo', desc: 'Display candidate photo(s)' },
    { key: 'showCareerObjective', label: 'Career Objective', desc: 'Formal Bangladesh opening career goal' },
    { key: 'showBioData', label: 'Personal Bio-Data Table', desc: 'Complete personal details matrix' },
    { key: 'showFatherMother', label: "Father's & Mother's Names", desc: 'Parents information for official records' },
    { key: 'showAddresses', label: 'Present & Permanent Address', desc: 'Full dual residential addresses' },
    { key: 'showReligion', label: 'Religion', desc: 'Faith/Religion field (optional)' },
    { key: 'showMaritalStatus', label: 'Marital Status', desc: 'Single / Married status' },
    { key: 'showOtherPersonal', label: 'NID, Blood Group & Gender', desc: 'National ID, blood group & gender' },
    { key: 'showEducation', label: 'Education & Academics', desc: 'SSC, HSC, University degrees table' },
    { key: 'showExperience', label: 'Work Experience', desc: 'Employment history and achievements' },
    { key: 'showSkills', label: 'Skills & Proficiencies', desc: 'Core technical and domain skills' },
    { key: 'showReferences', label: 'References', desc: 'Professional and academic referees' },
    { key: 'showDeclaration', label: 'Declaration Statement', desc: 'Formal authenticity declaration' },
    { key: 'showSignature', label: 'Candidate Signature', desc: 'Applicant signature and date footer' },
    { key: 'showProjects', label: 'Featured Projects', desc: 'Key initiatives, case studies, and repos' },
    { key: 'showCertifications', label: 'Certifications', desc: 'Professional licenses and credentials' },
    { key: 'showLanguages', label: 'Language Proficiencies', desc: 'Spoken and written language fluencies' },
    { key: 'showAwards', label: 'Honors & Awards', desc: 'Recognitions and industry awards' },
    { key: 'showSocials', label: 'Social & Portfolio Links', desc: 'LinkedIn, GitHub, and website' },
  ];

  const handleApplyPreset = (type: 'bd-standard' | 'ats' | 'full' | 'academic') => {
    if (type === 'bd-standard') {
      onChangeOptions({
        showPhoto: true,
        photoCount: 1,
        showSummary: false,
        showCareerObjective: true,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showSkills: true,
        showCertifications: true,
        showLanguages: true,
        showAwards: true,
        showSocials: true,
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
      onChangeFont('Inter');
      onChangeFontSize('normal');
    } else if (type === 'ats') {
      onChangeOptions({
        showPhoto: false,
        photoCount: 0,
        showSummary: true,
        showCareerObjective: false,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showSkills: true,
        showCertifications: true,
        showLanguages: true,
        showAwards: false,
        showSocials: true,
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
      onChangeFontSize('compact');
    } else if (type === 'full') {
      onChangeOptions({
        showPhoto: true,
        photoCount: 1,
        showSummary: true,
        showCareerObjective: true,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showSkills: true,
        showCertifications: true,
        showLanguages: true,
        showAwards: true,
        showSocials: true,
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
      onChangeFontSize('normal');
    } else if (type === 'academic') {
      onChangeOptions({
        showPhoto: false,
        photoCount: 0,
        showSummary: true,
        showCareerObjective: false,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showSkills: true,
        showCertifications: true,
        showLanguages: true,
        showAwards: true,
        showSocials: false,
        showBioData: false,
        showFatherMother: false,
        showAddresses: false,
        showReligion: false,
        showMaritalStatus: false,
        showOtherPersonal: false,
        showReferences: true,
        showDeclaration: false,
        showSignature: false,
        multiPage: true
      });
      onChangeFont('Libre Baskerville');
      onChangeFontSize('normal');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className={`w-full max-w-2xl rounded-3xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Print &amp; Document Formatting Options
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailor visible sections and layout density before exporting.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Layout Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleApplyPreset('bd-standard')}
                className="p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 text-left text-xs font-semibold bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
              >
                <div className="font-bold text-emerald-800 dark:text-emerald-300">BD Standard CV</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Bio-data, SSC/HSC, Ref</div>
              </button>

              <button
                onClick={() => handleApplyPreset('ats')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-left text-xs font-semibold hover:bg-blue-50/30 dark:hover:bg-slate-800 transition-all"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200">ATS Strict Clean</div>
                <div className="text-[10px] text-slate-400">Hides photo &amp; demographics</div>
              </button>

              <button
                onClick={() => handleApplyPreset('full')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-left text-xs font-semibold hover:bg-blue-50/30 dark:hover:bg-slate-800 transition-all"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200">Executive Full</div>
                <div className="text-[10px] text-slate-400">All sections visible</div>
              </button>

              <button
                onClick={() => handleApplyPreset('academic')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-left text-xs font-semibold hover:bg-blue-50/30 dark:hover:bg-slate-800 transition-all"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200">Academic / Scholar</div>
                <div className="text-[10px] text-slate-400">Serif font, awards focus</div>
              </button>
            </div>
          </div>

          {/* Photo Placements & Multi-Page Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Passport Photo Count */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Passport Photo Placements
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {[
                  { count: 0, label: '0 (No Photo)' },
                  { count: 1, label: '1 (Single)' },
                  { count: 2, label: '2 (Dual)' },
                  { count: 3, label: '3 (Triple)' }
                ].map(({ count, label }) => {
                  const isSelected = (!options.showPhoto && count === 0) || (options.showPhoto && (options.photoCount ?? 1) === count);
                  return (
                    <button
                      key={count}
                      onClick={() => {
                        if (count === 0) {
                          onChangeOptions({ ...options, showPhoto: false, photoCount: 0 });
                        } else {
                          onChangeOptions({ ...options, showPhoto: true, photoCount: count });
                        }
                      }}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Pagination Flow & A4 Page Mode */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  A4 Page Layout Mode
                </span>
                <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {[
                    { id: 'auto', label: 'Auto Flow' },
                    { id: '1-page', label: '1-Page Strict' },
                    { id: '2-page', label: '2-Page A4' },
                    { id: '3-page', label: '3-Page Bio-Data' }
                  ].map(({ id, label }) => {
                    const currentMode = options.pageMode || (options.multiPage === false ? '1-page' : 'auto');
                    const isSelected = currentMode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onChangeOptions({ 
                          ...options, 
                          pageMode: id as any,
                          multiPage: id !== '1-page'
                        })}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                          isSelected 
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* A4 Page Margins */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  A4 Page Margins
                </span>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {[
                    { id: 'compact', label: 'Compact (10mm)' },
                    { id: 'normal', label: 'Normal (15mm)' },
                    { id: 'spacious', label: 'Spacious (20mm)' }
                  ].map(({ id, label }) => {
                    const currentMargin = options.pageMargin || 'normal';
                    const isSelected = currentMargin === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onChangeOptions({ 
                          ...options, 
                          pageMargin: id as any
                        })}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                          isSelected 
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Typography & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Font Family */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Type size={13} />
                Document Font
              </span>
              <select
                value={font}
                onChange={(e) => onChangeFont(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
              >
                {FONTS.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Font Size Density */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Page Density (Fit to 1 Page)
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['compact', 'normal', 'spacious'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => onChangeFontSize(s)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                      fontSize === s 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                        : 'text-slate-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accent Color Picker */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette size={13} />
              Theme Accent Color
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_COLORS.map(c => {
                const isSelected = accentColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => onChangeAccentColor(c.hex)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${c.class} ${
                      isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                    }`}
                    title={c.label}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Visibility Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Section Visibility
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sections.map(sec => {
                const isVisible = options[sec.key] ?? true;
                return (
                  <div
                    key={sec.key}
                    onClick={() => toggleOption(sec.key)}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      isVisible
                        ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20'
                        : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {sec.label}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {sec.desc}
                      </div>
                    </div>

                    <div className={`p-1.5 rounded-lg ${
                      isVisible 
                        ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/60' 
                        : 'text-slate-400 bg-slate-200 dark:bg-slate-700'
                    }`}>
                      {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
          <button
            onClick={() => {
              onClose();
              triggerBrowserPrint();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Printer size={14} />
            <span>Print Now</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
