import React, { useState } from 'react';
import { 
  Plus, Copy, Trash2, Edit3, Download, Upload, FileText, 
  CheckCircle2, Clock, Sparkles, LayoutTemplate, ArrowRight, Layout,
  Store, Cloud, Database, ShieldCheck, Mail, FileUp
} from 'lucide-react';
import { ResumeDocument, ThemeType } from '../types';
import { THEMES, DEFAULT_DATA, DEFAULT_PRINT_OPTIONS } from '../constants';
import { exportResumeAsJSON, parseResumeJSON, exportAsWordDocx } from '../utils/exportUtils';
import { TemplateGallery } from './TemplateGallery';
import { ShopUser } from '../services/authService';

interface DashboardProps {
  resumes: ResumeDocument[];
  currentResumeId: string;
  onSelectResume: (id: string) => void;
  onCreateResume: (title?: string, initialTheme?: ThemeType, initialFont?: string, initialAccent?: string) => void;
  onOpenTemplateGallery: () => void;
  onDuplicateResume: (id: string) => void;
  onDeleteResume: (id: string) => void;
  onRenameResume: (id: string, newTitle: string) => void;
  onImportResume: (imported: Partial<ResumeDocument>) => void;
  onExportAllResumes: () => void;
  darkMode: boolean;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  currentUser?: ShopUser | null;
  onOpenShopModal?: () => void;
  onOpenCoverLetter?: (id: string) => void;
  onOpenImportModal?: () => void;
}

export const ResumeDashboard: React.FC<DashboardProps> = ({
  resumes,
  currentResumeId,
  onSelectResume,
  onCreateResume,
  onOpenTemplateGallery,
  onDuplicateResume,
  onDeleteResume,
  onRenameResume,
  onImportResume,
  onExportAllResumes,
  darkMode,
  showToast,
  currentUser,
  onOpenShopModal,
  onOpenCoverLetter,
  onOpenImportModal
}) => {
  const [activeTab, setActiveTab] = useState<'resumes' | 'templates'>('resumes');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const calculateCompletion = (resume: ResumeDocument): number => {
    let score = 0;
    const d = resume.data;
    if (d.personal.fullName) score += 15;
    if (d.personal.email) score += 10;
    if (d.personal.phone) score += 5;
    if (d.personal.title) score += 10;
    if (d.personal.summary && d.personal.summary.length > 30) score += 15;
    if (d.experience && d.experience.length > 0) score += 20;
    if (d.education && d.education.length > 0) score += 15;
    if (d.skills && d.skills.length >= 3) score += 10;
    return Math.min(score, 100);
  };

  const handleStartRename = (resume: ResumeDocument) => {
    setEditingId(resume.id);
    setEditTitleInput(resume.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitleInput.trim()) {
      onRenameResume(id, editTitleInput.trim());
    }
    setEditingId(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseResumeJSON(file);
      onImportResume(parsed);
      e.target.value = '';
      if (showToast) {
        showToast('Resume imported successfully!', 'success');
      }
    } catch (err: unknown) {
      const errMsg = (err as Error).message || "Failed to import resume.";
      if (showToast) {
        showToast(errMsg, 'error');
      } else {
        console.error(errMsg);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Stats */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        darkMode 
          ? 'bg-slate-900/80 border-slate-800 text-white' 
          : 'bg-white border-slate-200/90 shadow-sm text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              <Sparkles size={13} />
              <span>JH Soft CV Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Resume Document Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Create, organize, and customize multiple tailored resumes for different roles. All drafts remain encrypted in your private browser storage.
            </p>

            {/* Shop & Cloud Sync Status Badge */}
            <div className="pt-2">
              {currentUser ? (
                <div className="inline-flex items-center gap-3 p-2 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Store size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{currentUser.shopName}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                    <Database size={12} />
                    <span>MySQL Cloud Connected</span>
                  </div>
                  {onOpenShopModal && (
                    <button
                      onClick={onOpenShopModal}
                      className="ml-2 font-bold underline hover:text-emerald-900 dark:hover:text-emerald-200 text-[11px]"
                    >
                      Manage Account
                    </button>
                  )}
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 p-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Cloud size={14} className="text-slate-500" />
                    <span>Local Mode (Guest)</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Connect your shop account to sync with MySQL database
                  </span>
                  {onOpenShopModal && (
                    <button
                      onClick={onOpenShopModal}
                      className="ml-1 font-bold text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
                    >
                      Shop Login / Register →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 sm:self-start md:self-center">
            <label className="cursor-pointer flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <Upload size={14} />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" aria-label="Upload resume JSON file" />
            </label>

            <button
              type="button"
              onClick={onExportAllResumes}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Download backup of all saved resumes"
              aria-label="Backup all resumes as JSON"
            >
              <Download size={14} />
              <span>Backup All</span>
            </button>

            {onOpenImportModal && (
              <button
                type="button"
                onClick={onOpenImportModal}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Import old CV or PDF"
              >
                <FileUp size={15} />
                <span>Import Old CV (PDF)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenTemplateGallery}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Create new resume"
            >
              <Plus size={16} />
              <span>New Resume</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-8 border-b border-slate-100 dark:border-slate-800 pt-2" role="tablist" aria-label="Dashboard Views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'resumes'}
            onClick={() => setActiveTab('resumes')}
            className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeTab === 'resumes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            My Resumes ({resumes.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'templates'}
            onClick={() => setActiveTab('templates')}
            className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeTab === 'templates'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Template Gallery ({THEMES.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Resumes List */}
      {activeTab === 'resumes' && (
        <div id="dashboard-resumes-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card */}
          <button 
            type="button"
            onClick={onOpenTemplateGallery}
            className={`min-h-[240px] p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all group focus-visible:ring-2 focus-visible:ring-blue-500 ${
              darkMode 
                ? 'border-slate-800 hover:border-blue-500 bg-slate-900/40 hover:bg-slate-900/80' 
                : 'border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40'
            }`}
            aria-label="Create a new resume document"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm mb-4">
              <Plus size={24} />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">
              Create New Resume
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
              Choose from 12+ modern, recruiter-tested layouts with built-in ATS optimization.
            </p>
          </button>

          {/* Import Old CV / PDF Card */}
          {onOpenImportModal && (
            <button 
              type="button"
              onClick={onOpenImportModal}
              className={`min-h-[240px] p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all group focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                darkMode 
                  ? 'border-slate-800 hover:border-indigo-500 bg-slate-900/40 hover:bg-slate-900/80' 
                  : 'border-slate-200 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/40'
              }`}
              aria-label="Import an existing PDF or BDJobs CV"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm mb-4">
                <FileUp size={24} />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1 group-hover:text-indigo-600 transition-colors">
                Import from Old CV / PDF
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                Upload existing PDF or paste BDJobs profile to auto-fill every field in seconds.
              </p>
            </button>
          )}

          {/* Resume Cards */}
          {resumes.map((resume) => {
            const completion = calculateCompletion(resume);
            const isCurrent = resume.id === currentResumeId;
            const themeInfo = THEMES.find(t => t.id === resume.theme) || THEMES[0];

            return (
              <div
                key={resume.id}
                id={`resume-card-${resume.id}`}
                className={`rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                  isCurrent 
                    ? 'border-blue-500 ring-2 ring-blue-500/20' 
                    : darkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300'
                } ${darkMode ? 'bg-slate-900' : 'bg-white'}`}
              >
                {/* Card Top */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${themeInfo.color}`}></span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {themeInfo.label}
                      </span>
                    </div>

                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Title & Rename */}
                  <div>
                    {editingId === resume.id ? (
                      <div className="flex items-center gap-1">
                        <label htmlFor={`rename-input-${resume.id}`} className="sr-only">Resume Title</label>
                        <input
                          id={`rename-input-${resume.id}`}
                          type="text"
                          value={editTitleInput}
                          onChange={(e) => setEditTitleInput(e.target.value)}
                          onBlur={() => handleSaveRename(resume.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(resume.id)}
                          autoFocus
                          className="w-full text-sm font-bold p-1 rounded border border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <h3 
                          onClick={() => onSelectResume(resume.id)}
                          className="font-bold text-base text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate"
                          title={resume.title}
                          tabIndex={0}
                          role="button"
                          onKeyDown={(e) => e.key === 'Enter' && onSelectResume(resume.id)}
                          aria-label={`Open resume ${resume.title}`}
                        >
                          {resume.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleStartRename(resume)}
                          className="p-1 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                          title="Rename"
                          aria-label={`Rename resume ${resume.title}`}
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                      {resume.data.personal.title || 'Untitled Role'} • {resume.data.personal.fullName || 'No Name'}
                    </p>
                  </div>

                  {/* Progress & Last Updated */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>Completion</span>
                      <span>{completion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100} aria-label="Resume completeness">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          completion >= 80 ? 'bg-emerald-500' : completion >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${completion}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                      <Clock size={11} />
                      <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectResume(resume.id)}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label={`Open editor for resume ${resume.title}`}
                  >
                    <span>Open Editor</span>
                    <ArrowRight size={13} />
                  </button>

                  <div className="flex items-center gap-1">
                    {onOpenCoverLetter && (
                      <button
                        type="button"
                        onClick={() => onOpenCoverLetter(resume.id)}
                        className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
                        title="Create or View Matching Cover Letter"
                        aria-label={`Open cover letter for resume ${resume.title}`}
                      >
                        <Mail size={14} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDuplicateResume(resume.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                      title="Duplicate Resume"
                      aria-label={`Duplicate resume ${resume.title}`}
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => exportResumeAsJSON(resume, resume.title)}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                      title="Export as JSON"
                      aria-label={`Export resume ${resume.title} as JSON`}
                    >
                      <Download size={14} />
                    </button>

                    {resumes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${resume.title}"? This action cannot be undone.`)) {
                            onDeleteResume(resume.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-red-500"
                        title="Delete Resume"
                        aria-label={`Delete resume ${resume.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Templates Showcase */}
      {activeTab === 'templates' && (
        <TemplateGallery
          onSelectTemplate={(themeId, font, accent) => {
            const tmpl = THEMES.find(t => t.id === themeId);
            onCreateResume(`New ${tmpl?.label || 'Professional'} CV`, themeId, font, accent);
          }}
          onBackToDashboard={() => setActiveTab('resumes')}
          darkMode={darkMode}
          activeResumeTheme={resumes.find(r => r.id === currentResumeId)?.theme}
        />
      )}
    </div>
  );
};
