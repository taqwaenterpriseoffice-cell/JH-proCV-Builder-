import React, { useState } from 'react';
import { CoverLetterData, ResumeDocument, Language } from '../types';
import { CoverLetterPreview } from './CoverLetterPreview';
import { COVER_LETTER_PRESETS } from '../data/coverLetterPresets';
import { generateCoverLetter } from '../services/aiService';
import { exportAsPDF } from '../utils/exportUtils';
import { 
  Sparkles, Download, Printer, Copy, Check, RefreshCw, 
  ZoomIn, ZoomOut, FileText, Send, Building, Briefcase, 
  Calendar, Layers, ArrowLeft, Wand2, ShieldCheck, ChevronRight 
} from 'lucide-react';

interface CoverLetterStudioProps {
  currentResume: ResumeDocument;
  onUpdateResumeData: (data: ResumeDocument['data']) => void;
  language: Language;
  darkMode: boolean;
  onBackToCV: () => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CoverLetterStudio: React.FC<CoverLetterStudioProps> = ({
  currentResume,
  onUpdateResumeData,
  language,
  darkMode,
  onBackToCV,
  showToast
}) => {
  const resumeData = currentResume.data;

  // Initialize cover letter state from resumeData or preset
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(() => {
    if (resumeData.coverLetter) {
      return resumeData.coverLetter;
    }
    // Default to the first preset matching resume title
    return COVER_LETTER_PRESETS[0].getData(resumeData);
  });

  const [previewZoom, setPreviewZoom] = useState<number>(0.85);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'presets' | 'ai'>('edit');

  // AI Generator Inputs
  const [targetJobTitle, setTargetJobTitle] = useState<string>(coverLetter.jobTitle || resumeData.personal.title || '');
  const [targetCompany, setTargetCompany] = useState<string>(coverLetter.companyName || '');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  // Sync back to resumeData
  const handleUpdateCoverLetter = (updated: Partial<CoverLetterData>) => {
    const newData = { ...coverLetter, ...updated };
    setCoverLetter(newData);
    onUpdateResumeData({
      ...resumeData,
      coverLetter: newData
    });
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = COVER_LETTER_PRESETS.find(p => p.id === presetId);
    if (preset) {
      const generated = preset.getData(resumeData);
      setCoverLetter(generated);
      onUpdateResumeData({
        ...resumeData,
        coverLetter: generated
      });
      if (showToast) {
        showToast(`Applied preset: ${preset.label}`, 'success');
      }
      setActiveTab('edit');
    }
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const generatedBody = await generateCoverLetter(
        resumeData,
        targetJobTitle || coverLetter.jobTitle || 'Executive',
        targetCompany || coverLetter.companyName || 'Esteemed Organization',
        selectedLanguage,
        jobDescription
      );

      if (generatedBody) {
        handleUpdateCoverLetter({
          jobTitle: targetJobTitle || coverLetter.jobTitle,
          companyName: targetCompany || coverLetter.companyName,
          subject: selectedLanguage === 'bn' 
            ? `বিষয়: ‘${targetJobTitle || 'প্রয়োজনীয় পদ'}’ পদে নিয়োগের জন্য আবেদন।`
            : `Subject: Application for the position of ${targetJobTitle || 'Executive'}`,
          letterBody: generatedBody,
          salutation: selectedLanguage === 'bn' ? 'মহোদয়,' : 'Dear Hiring Manager,',
          closing: selectedLanguage === 'bn' ? 'বিনীত নিবেদক,' : 'Sincerely,'
        });

        if (showToast) {
          showToast('Cover letter generated successfully!', 'success');
        }
        setActiveTab('edit');
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast('Failed to generate cover letter. Please try again.', 'error');
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCopyText = () => {
    const formatted = `${coverLetter.date}

${coverLetter.recipientName}
${coverLetter.recipientDesignation}
${coverLetter.companyName}
${coverLetter.companyAddress}

${coverLetter.subject || `Subject: Application for ${coverLetter.jobTitle}`}
${coverLetter.circularReference ? coverLetter.circularReference + '\n' : ''}
${coverLetter.salutation}

${coverLetter.letterBody}

${coverLetter.closing}
${coverLetter.signOffName}
${coverLetter.signOffTitle ? coverLetter.signOffTitle + '\n' : ''}${resumeData.personal.phone || ''}
${resumeData.personal.email || ''}`;

    navigator.clipboard.writeText(formatted);
    setIsCopied(true);
    if (showToast) {
      showToast('Cover letter copied to clipboard!', 'success');
    }
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    if (showToast) {
      showToast('Rendering print-perfect A4 PDF...', 'info');
    }
    try {
      const filename = `${coverLetter.signOffName || 'Candidate'}_Cover_Letter`;
      const ok = await exportAsPDF('cover-letter-content', filename);
      if (ok && showToast) {
        showToast('Cover letter downloaded successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast('Export failed. You can also use Print to PDF.', 'error');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Studio Header Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-xs`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCV}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Resume / CV"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Matching Cover Letter Studio
              </h1>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                1-Page A4
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Matches your active CV's identity, typography ({currentResume.font}), and accent colors.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Preset Switcher Trigger */}
          <button
            onClick={() => setActiveTab(activeTab === 'presets' ? 'edit' : 'presets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border-blue-300'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers size={14} />
            <span>Templates ({COVER_LETTER_PRESETS.length})</span>
          </button>

          {/* AI Generator Trigger */}
          <button
            onClick={() => setActiveTab(activeTab === 'ai' ? 'edit' : 'ai')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-1.5 transition-all"
          >
            <Sparkles size={14} />
            <span>AI Write</span>
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
            title="Copy plain text for BDJobs or email application"
          >
            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
            title="Browser Print Dialog"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          {/* 1-Click PDF Download */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Editor Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Form Editor or AI/Presets Drawer */}
        <div className="lg:col-span-5 space-y-4">
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className={`p-4 rounded-2xl border space-y-3 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select a Pre-Written Industry Template
                </span>
                <button
                  onClick={() => setActiveTab('edit')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Back to Editor
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[70vh] overflow-y-auto pr-1">
                {COVER_LETTER_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {preset.label}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {preset.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AI GENERATOR */}
          {activeTab === 'ai' && (
            <div className={`p-4 rounded-2xl border space-y-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h2 className="text-xs font-extrabold text-slate-900 dark:text-white">AI Cover Letter Drafter</h2>
                    <p className="text-[10px] text-slate-400">Uses your CV experience and the target job description</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('edit')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Job Title *
                  </label>
                  <input
                    type="text"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer or Accounts Officer"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Company / Organization *
                  </label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. BRAC IT Services, Walton, or Grameenphone"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Job Circular / Key Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job circular bullets or requirements to align your experience..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Language
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('en')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedLanguage === 'en'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border-blue-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      English (International)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('bn')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedLanguage === 'bn'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border-blue-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      বাংলা (প্রমিত আবেদন)
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isGeneratingAI ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  <span>{isGeneratingAI ? 'Drafting Cover Letter...' : 'Generate Tailored Cover Letter'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FORM EDITOR */}
          {activeTab === 'edit' && (
            <div className={`p-4 rounded-2xl border space-y-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recipient &amp; Letter Information
                </span>
                <span className="text-[10px] text-slate-400">Auto-saved</span>
              </div>

              {/* Target Job & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    value={coverLetter.jobTitle}
                    onChange={(e) => handleUpdateCoverLetter({ 
                      jobTitle: e.target.value,
                      subject: coverLetter.subject.includes('Application for') 
                        ? `Application for the position of ${e.target.value}` 
                        : coverLetter.subject
                    })}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={coverLetter.companyName}
                    onChange={(e) => handleUpdateCoverLetter({ companyName: e.target.value })}
                    placeholder="e.g. BRAC IT Services Ltd."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Recipient Designation & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Recipient Name / Authority
                  </label>
                  <input
                    type="text"
                    value={coverLetter.recipientName}
                    onChange={(e) => handleUpdateCoverLetter({ recipientName: e.target.value })}
                    placeholder="e.g. The Hiring Manager or বরাবর"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Recipient Designation
                  </label>
                  <input
                    type="text"
                    value={coverLetter.recipientDesignation}
                    onChange={(e) => handleUpdateCoverLetter({ recipientDesignation: e.target.value })}
                    placeholder="e.g. Human Resources Department"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Company Address
                  </label>
                  <input
                    type="text"
                    value={coverLetter.companyAddress}
                    onChange={(e) => handleUpdateCoverLetter({ companyAddress: e.target.value })}
                    placeholder="e.g. Mohakhali, Dhaka-1212"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Circular / Reference No.
                  </label>
                  <input
                    type="text"
                    value={coverLetter.circularReference || ''}
                    onChange={(e) => handleUpdateCoverLetter({ circularReference: e.target.value })}
                    placeholder="e.g. Circular Ref: BDJ-2026-987"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Subject & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={coverLetter.subject || ''}
                    onChange={(e) => handleUpdateCoverLetter({ subject: e.target.value })}
                    placeholder="e.g. Application for the position of..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={coverLetter.date}
                    onChange={(e) => handleUpdateCoverLetter({ date: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Letter Body Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Letter Body Content (Paragraphs)
                  </label>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                  >
                    <Sparkles size={11} />
                    <span>Re-write with AI</span>
                  </button>
                </div>
                <textarea
                  rows={10}
                  value={coverLetter.letterBody}
                  onChange={(e) => handleUpdateCoverLetter({ letterBody: e.target.value })}
                  placeholder="Write your cover letter content here..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs leading-relaxed outline-none focus:border-blue-500 font-sans"
                />
              </div>

              {/* Closing & Sign-off */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Salutation
                  </label>
                  <input
                    type="text"
                    value={coverLetter.salutation}
                    onChange={(e) => handleUpdateCoverLetter({ salutation: e.target.value })}
                    placeholder="e.g. Dear Hiring Manager,"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Closing Phrase
                  </label>
                  <input
                    type="text"
                    value={coverLetter.closing}
                    onChange={(e) => handleUpdateCoverLetter({ closing: e.target.value })}
                    placeholder="e.g. Sincerely,"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live A4 Preview */}
        <div className="lg:col-span-7 space-y-3 sticky top-20">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText size={14} />
                <span>Live A4 Cover Letter Preview</span>
              </h2>
              <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                {Math.round(previewZoom * 100)}%
              </span>
            </div>

            {/* Preview Zoom Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5" role="toolbar" aria-label="Preview zoom controls">
              <button
                type="button"
                onClick={() => setPreviewZoom(prev => Math.max(0.4, prev - 0.1))}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewZoom(0.85)}
                className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Reset Zoom"
              >
                Fit
              </button>
              <button
                type="button"
                onClick={() => setPreviewZoom(1)}
                className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                title="100% Zoom"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => setPreviewZoom(prev => Math.min(1.3, prev + 0.1))}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Scrollable Container with Live A4 Preview */}
          <div className="bg-slate-200/70 dark:bg-slate-900/60 p-2 sm:p-6 rounded-3xl border border-slate-300/80 dark:border-slate-800 overflow-x-auto shadow-inner flex justify-center max-h-[82vh] overflow-y-auto">
            <div 
              style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
              className="w-full flex justify-center"
            >
              <CoverLetterPreview
                data={coverLetter}
                resumeData={resumeData}
                theme={currentResume.theme}
                font={currentResume.font}
                language={selectedLanguage}
                accentColor={currentResume.accentColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
