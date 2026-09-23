import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { ResumeDashboard } from './components/ResumeDashboard';
import { TemplateGallery } from './components/TemplateGallery';
import { CustomizationStudio } from './components/CustomizationStudio';
import { CustomizationPanel } from './components/CustomizationPanel';
import { AIAssistantModal } from './components/AIAssistantModal';
import { PrintOptionsModal } from './components/PrintOptionsModal';
import { ShopAccountModal } from './components/ShopAccountModal';
import { CoverLetterStudio } from './components/CoverLetterStudio';
import { CVImportModal } from './components/CVImportModal';
import { CustomerSlipModal } from './components/CustomerSlipModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { authService, ShopUser } from './services/authService';
import { cloudResumeService } from './services/cloudResumeService';
import { ResumeDocument, ResumeData, ThemeType, Language, PrintOptions, FontSize, ActiveView } from './types';
import { 
  DEFAULT_DATA, 
  THEMES, 
  FONTS, 
  ACCENT_COLORS, 
  DEFAULT_PRINT_OPTIONS, 
  INITIAL_RESUMES 
} from './constants';
import { exportAsPDF, exportAsImage, exportResumeAsJSON, exportAsWordDocx } from './utils/exportUtils';
import { 
  Sparkles, Sliders, Palette, ZoomIn, ZoomOut, 
  RotateCcw, Eye, Edit3, Layers, CheckCircle2, 
  FileText, ArrowRight, Download, RefreshCw, Layout, Mail 
} from 'lucide-react';

export const App: React.FC = () => {
  // 1. Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jh_soft_cv_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('jh_soft_cv_dark_mode', String(darkMode));
  }, [darkMode]);

  // 2. Multi-Resume State with Legacy Migration
  const [resumes, setResumes] = useState<ResumeDocument[]>(() => {
    try {
      const saved = localStorage.getItem('jh_soft_cv_resumes_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Check legacy procv data
      const legacyData = localStorage.getItem('pro_cv_data');
      if (legacyData) {
        const parsedData = JSON.parse(legacyData);
        const legacyTheme = (localStorage.getItem('pro_cv_theme') as ThemeType) || 'modern';
        const legacyFont = localStorage.getItem('pro_cv_font') || 'Inter';
        const legacyLang = (localStorage.getItem('pro_cv_lang') as Language) || 'en';
        return [{
          id: 'imported-procv-1',
          title: parsedData.personal?.title ? `${parsedData.personal.title} CV` : 'My Resume',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          data: parsedData,
          theme: legacyTheme,
          font: legacyFont,
          language: legacyLang,
          printOptions: DEFAULT_PRINT_OPTIONS,
          accentColor: '#2563eb',
          fontSize: 'normal'
        }];
      }
    } catch (e) {
      console.error("Failed to load saved resumes", e);
    }
    return INITIAL_RESUMES;
  });

  const [currentResumeId, setCurrentResumeId] = useState<string>(() => {
    return localStorage.getItem('jh_soft_cv_active_id') || resumes[0]?.id || 'default-resume-1';
  });

  // Current active resume document
  const currentResume = resumes.find(r => r.id === currentResumeId) || resumes[0] || INITIAL_RESUMES[0];

  // Debounced Save to LocalStorage to prevent typing stutter
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('jh_soft_cv_resumes_v2', JSON.stringify(resumes));
    }, 400);
    return () => clearTimeout(timer);
  }, [resumes]);

  useEffect(() => {
    localStorage.setItem('jh_soft_cv_active_id', currentResumeId);
  }, [currentResumeId]);

  // 3. UI Navigation & View State (Default to Dashboard on first visit / load)
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCustomerSlipModalOpen, setIsCustomerSlipModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  const [currentUser, setCurrentUser] = useState<ShopUser | null>(() => authService.getCurrentUser());
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);

  // Restore session and load cloud resumes
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile) {
          setCurrentUser(profile);
          const cloudResumes = await cloudResumeService.fetchUserResumes();
          if (cloudResumes && cloudResumes.length > 0) {
            setResumes(cloudResumes);
            setCurrentResumeId(cloudResumes[0].id);
          }
        }
      } catch (e) {
        console.error('Session restore error:', e);
      }
    };
    restoreSession();
  }, []);

  // Auto-sync active resume to cloud when logged in (debounced)
  useEffect(() => {
    if (currentUser && currentResume) {
      const timer = setTimeout(() => {
        cloudResumeService.saveResumeToCloud(currentResume).catch(() => {});
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentResume, currentUser]);

  const [previewZoom, setPreviewZoom] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return Math.max(0.38, Math.min(1, (window.innerWidth - 32) / 800));
    }
    return 1;
  });

  const handleFitToScreen = () => {
    if (typeof window !== 'undefined') {
      const screenW = window.innerWidth;
      if (screenW < 640) {
        setPreviewZoom(Math.max(0.38, Math.min(1, (screenW - 32) / 800)));
      } else if (screenW < 1024) {
        setPreviewZoom(Math.max(0.55, Math.min(1, (screenW - 64) / 800)));
      } else {
        setPreviewZoom(0.85);
      }
    }
  };

  // Resume Document Update Handlers
  const updateCurrentResume = (updates: Partial<ResumeDocument>) => {
    setResumes(prev => prev.map(r => {
      if (r.id === currentResume.id) {
        return {
          ...r,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  const handleUpdateResumeData = (newData: ResumeData) => {
    updateCurrentResume({ data: newData });
  };

  const handleUpdateTitle = (newTitle: string) => {
    updateCurrentResume({ title: newTitle });
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    updateCurrentResume({ theme: newTheme });
  };

  const handleFontChange = (newFont: string) => {
    updateCurrentResume({ font: newFont });
  };

  const handleAccentColorChange = (hex: string) => {
    updateCurrentResume({ accentColor: hex });
  };

  const handleFontSizeChange = (size: FontSize) => {
    updateCurrentResume({ fontSize: size });
  };

  const handleLanguageSwitch = (newLang: Language) => {
    updateCurrentResume({ language: newLang });
  };

  const handlePrintOptionsChange = (newOptions: PrintOptions) => {
    updateCurrentResume({ printOptions: newOptions });
  };

  // Apply parsed CV data (either creating new CV or merging into current CV)
  const handleApplyParsedCV = (parsed: Partial<ResumeData>, createNew: boolean = false) => {
    if (createNew) {
      const newId = `resume-${Date.now()}`;
      const candidateName = parsed.personal?.fullName?.trim() || 'Imported Candidate';
      const newDoc: ResumeDocument = {
        id: newId,
        title: `${candidateName}'s CV`,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        theme: 'modern',
        font: 'Inter',
        accentColor: '#2563eb',
        fontSize: 'normal',
        language: 'en',
        printOptions: { ...DEFAULT_PRINT_OPTIONS },
        data: {
          ...DEFAULT_DATA,
          ...parsed,
          personal: {
            ...DEFAULT_DATA.personal,
            ...(parsed.personal || {})
          },
          education: parsed.education && parsed.education.length > 0 ? parsed.education : DEFAULT_DATA.education,
          experience: parsed.experience && parsed.experience.length > 0 ? parsed.experience : DEFAULT_DATA.experience,
          skills: parsed.skills && parsed.skills.length > 0 ? parsed.skills : DEFAULT_DATA.skills,
          references: parsed.references && parsed.references.length > 0 ? parsed.references : DEFAULT_DATA.references,
        }
      };

      setResumes(prev => [newDoc, ...prev]);
      setCurrentResumeId(newId);
      setActiveView(typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'split' : 'edit');
      showToast(`Created new CV for ${candidateName}!`, 'success');
    } else {
      // Merge into current resume
      const mergedData: ResumeData = {
        ...currentResume.data,
        ...parsed,
        personal: {
          ...currentResume.data.personal,
          ...(parsed.personal || {})
        },
        education: parsed.education && parsed.education.length > 0 ? parsed.education : currentResume.data.education,
        experience: parsed.experience && parsed.experience.length > 0 ? parsed.experience : currentResume.data.experience,
        skills: parsed.skills && parsed.skills.length > 0 ? parsed.skills : currentResume.data.skills,
        references: parsed.references && parsed.references.length > 0 ? parsed.references : currentResume.data.references,
      };

      handleUpdateResumeData(mergedData);
      if (parsed.personal?.fullName) {
        handleUpdateTitle(`${parsed.personal.fullName}'s CV`);
      }
      setActiveView(typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'split' : 'edit');
      showToast('Auto-filled current resume from old CV!', 'success');
    }
  };

  // Resume Management Operations
  const handleCreateResume = (
    title?: string, 
    initialTheme?: ThemeType, 
    initialFont?: string, 
    initialAccent?: string,
    targetView: ActiveView = 'customize'
  ) => {
    const newId = `resume-${Date.now()}`;
    const chosenTheme = initialTheme || 'modern';
    const themeMeta = THEMES.find(t => t.id === chosenTheme);
    const newDoc: ResumeDocument = {
      id: newId,
      title: title || `${themeMeta?.label || 'Professional'} Resume`,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      data: DEFAULT_DATA,
      theme: chosenTheme,
      font: initialFont || 'Inter',
      language: 'en',
      printOptions: DEFAULT_PRINT_OPTIONS,
      accentColor: initialAccent || '#2563eb',
      fontSize: 'normal'
    };
    setResumes(prev => [newDoc, ...prev]);
    setCurrentResumeId(newId);
    setActiveView(targetView);
  };

  const handleDuplicateResume = (id: string) => {
    const target = resumes.find(r => r.id === id);
    if (!target) return;
    const newId = `resume-${Date.now()}`;
    const duplicated: ResumeDocument = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setResumes(prev => [duplicated, ...prev]);
    setCurrentResumeId(newId);
    showToast("Resume duplicated successfully!", 'success');
  };

  const handleDeleteResume = (id: string) => {
    if (resumes.length <= 1) {
      showToast("You must maintain at least one resume document.", 'error');
      return;
    }
    setResumes(prev => prev.filter(r => r.id !== id));
    if (currentResumeId === id) {
      const remaining = resumes.filter(r => r.id !== id);
      setCurrentResumeId(remaining[0].id);
    }
    if (currentUser) {
      cloudResumeService.deleteResumeFromCloud(id).catch(() => {});
    }
    showToast("Resume deleted.", 'info');
  };

  const handleRenameResume = (id: string, newTitle: string) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, title: newTitle, updatedAt: new Date().toISOString() } : r));
    showToast("Resume renamed.", 'success');
  };

  const handleImportResume = (imported: Partial<ResumeDocument>) => {
    const newId = `imported-${Date.now()}`;
    const newDoc: ResumeDocument = {
      id: newId,
      title: imported.title || 'Imported Resume',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      data: imported.data || DEFAULT_DATA,
      theme: (imported.theme as ThemeType) || 'modern',
      font: imported.font || 'Inter',
      language: imported.language || 'en',
      printOptions: imported.printOptions || DEFAULT_PRINT_OPTIONS,
      accentColor: imported.accentColor || '#2563eb',
      fontSize: imported.fontSize || 'normal'
    };
    setResumes(prev => [newDoc, ...prev]);
    setCurrentResumeId(newId);
    setActiveView('edit');
    showToast("Resume imported successfully!", 'success');
  };

  const handleExportAllResumes = () => {
    exportResumeAsJSON(resumes as any, 'JH_Soft_CV_Backup_All');
    showToast("All resumes exported as backup!", 'success');
  };

  // Export PDF & Image
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportAsPDF('resume-content', currentResume.title || 'JH_Soft_Resume');
      showToast("PDF downloaded successfully!", 'success');
    } catch (e) {
      console.error(e);
      showToast("PDF generation encountered an error. Please try direct Print.", 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportAsImage('resume-content', currentResume.title || 'JH_Soft_Resume');
      showToast("Resume image exported!", 'success');
    } catch (e) {
      console.error(e);
      showToast("Image export encountered an error.", 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      const ok = await exportAsWordDocx(currentResume, currentResume.title || 'JH_Soft_Resume');
      if (ok) {
        showToast("Word (.docx) ফাইল সফলভাবে ডাউনলোড হয়েছে!", 'success');
      } else {
        showToast("Word ফাইল তৈরিতে সমস্যা হয়েছে।", 'error');
      }
    } catch (e) {
      console.error(e);
      showToast("Word ফাইল তৈরিতে সমস্যা হয়েছে।", 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Reset to sample template data
  const handleResetToSample = () => {
    if (window.confirm("Reset this resume to sample professional data? Existing edits will be overwritten.")) {
      handleUpdateResumeData(DEFAULT_DATA);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header
        currentResume={currentResume}
        onUpdateTitle={handleUpdateTitle}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenPrintOptions={() => setIsPrintModalOpen(true)}
        onExportPDF={handleExportPDF}
        onExportImage={handleExportImage}
        onExportWord={handleExportWord}
        isExporting={isExporting}
        language={currentResume.language}
        onSwitchLanguage={handleLanguageSwitch}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        resumeCount={resumes.length}
        showToast={showToast}
        currentUser={currentUser}
        onOpenShopModal={() => setIsShopModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenCustomerSlip={() => setIsCustomerSlipModalOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-28 md:pb-6 flex flex-col">
        {/* VIEW 1: DASHBOARD */}
        {activeView === 'dashboard' && (
          <ResumeDashboard
            resumes={resumes}
            currentResumeId={currentResumeId}
            onSelectResume={(id) => {
              setCurrentResumeId(id);
              setActiveView('split');
            }}
            onCreateResume={handleCreateResume}
            onOpenTemplateGallery={() => setActiveView('templates')}
            onDuplicateResume={handleDuplicateResume}
            onDeleteResume={handleDeleteResume}
            onRenameResume={handleRenameResume}
            onImportResume={handleImportResume}
            onExportAllResumes={handleExportAllResumes}
            darkMode={darkMode}
            showToast={showToast}
            currentUser={currentUser}
            onOpenShopModal={() => setIsShopModalOpen(true)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenCoverLetter={(id) => {
              setCurrentResumeId(id);
              setActiveView('cover-letter');
            }}
          />
        )}

        {/* VIEW 2: TEMPLATE GALLERY */}
        {activeView === 'templates' && (
          <TemplateGallery
            onSelectTemplate={(themeId, font, accent) => {
              const tmpl = THEMES.find(t => t.id === themeId);
              handleCreateResume(
                `New ${tmpl?.label || 'Professional'} CV`,
                themeId,
                font,
                accent,
                'customize'
              );
            }}
            onBackToDashboard={() => setActiveView('dashboard')}
            darkMode={darkMode}
            activeResumeTheme={currentResume.theme}
          />
        )}

        {/* VIEW 3: TEMPLATE CUSTOMIZATION STUDIO (Left controls, Right large live preview) */}
        {activeView === 'customize' && (
          <CustomizationStudio
            currentResume={currentResume}
            onThemeChange={handleThemeChange}
            onFontChange={handleFontChange}
            onAccentColorChange={handleAccentColorChange}
            onFontSizeChange={handleFontSizeChange}
            onPrintOptionsChange={handlePrintOptionsChange}
            onBackToTemplates={() => setActiveView('templates')}
            onContinueToEditor={() => {
              setActiveView(typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'split' : 'edit');
            }}
            darkMode={darkMode}
          />
        )}

        {/* VIEW 3.5: MATCHING COVER LETTER STUDIO */}
        {activeView === 'cover-letter' && (
          <CoverLetterStudio
            currentResume={currentResume}
            onUpdateResumeData={handleUpdateResumeData}
            language={currentResume.language}
            darkMode={darkMode}
            onBackToCV={() => {
              setActiveView(typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'split' : 'edit');
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 4, 5, 6: WORKSPACE (EDITOR, PREVIEW & SPLIT VIEW) */}
        {activeView !== 'dashboard' && activeView !== 'templates' && activeView !== 'customize' && activeView !== 'cover-letter' && (
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Clean Professional Workspace Action Bar (No cluttered carousel) */}
            <div className={`px-4 py-3 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
            }`}>
              {/* Left: Resume Title & Active Template Badge */}
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="text"
                  value={currentResume.title}
                  onChange={(e) => handleUpdateTitle(e.target.value)}
                  className="font-extrabold text-sm sm:text-base bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 outline-none text-slate-900 dark:text-slate-100 max-w-[200px] sm:max-w-xs truncate transition-colors"
                  placeholder="Resume Title"
                  title="Click to rename resume"
                />

                <span className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></span>

                <button
                  type="button"
                  onClick={() => setActiveView('customize')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700 transition-colors"
                  title="Open Template Customization Studio"
                >
                  <span className={`w-2 h-2 rounded-full ${THEMES.find(t => t.id === currentResume.theme)?.color || 'bg-blue-600'}`}></span>
                  <span>{THEMES.find(t => t.id === currentResume.theme)?.label || 'Modern'}</span>
                  <Sliders size={11} className="opacity-60 ml-0.5" />
                </button>
              </div>

              {/* Right: Quick actions to Customization Studio, Template Gallery & AI Assist */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('cover-letter')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-1.5 transition-colors"
                  title="Create matching cover letter with your CV's font & colors"
                >
                  <Mail size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Cover Letter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('customize')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Customize Colors, Typography & Sections"
                >
                  <Palette size={13} className="text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">Customize Style</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('templates')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Switch to another template in Gallery"
                >
                  <Layout size={13} className="text-slate-500" />
                  <span className="hidden sm:inline">Change Template</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAIModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-900/40 flex items-center gap-1.5 transition-colors"
                  title="Open AI Career Assistant"
                >
                  <Sparkles size={13} />
                  <span>AI Assist</span>
                </button>
              </div>
            </div>

            {/* Content Work Area */}
            <div className="flex-1">
              {/* SPLIT VIEW (Desktop) */}
              {activeView === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Form Editor (5 cols) */}
                  <div className="lg:col-span-6 xl:col-span-5 space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Edit3 size={14} />
                        <span>Resume Sections</span>
                      </h2>
                      <button
                        onClick={() => setIsAIModalOpen(true)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                      >
                        <Sparkles size={12} />
                        <span>Open AI Tools</span>
                      </button>
                    </div>

                    <ResumeForm
                      data={currentResume.data}
                      onChange={handleUpdateResumeData}
                      language={currentResume.language}
                      onOpenAIModal={() => setIsAIModalOpen(true)}
                      onOpenCoverLetter={() => setActiveView('cover-letter')}
                      onOpenImportModal={() => setIsImportModalOpen(true)}
                      darkMode={darkMode}
                    />
                  </div>

                  {/* Right: Live Preview (7 cols, Sticky) */}
                  <div className="lg:col-span-6 xl:col-span-7 space-y-3 sticky top-20">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Eye size={14} />
                          <span>Live A4 Preview</span>
                        </h2>
                        <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                          {Math.round(previewZoom * 100)}%
                        </span>
                      </div>

                      {/* Zoom Controls */}
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5" role="toolbar" aria-label="Preview zoom controls">
                        <button
                          type="button"
                          onClick={() => setPreviewZoom(prev => Math.max(0.35, prev - 0.1))}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                          title="Zoom Out"
                          aria-label="Zoom out preview"
                        >
                          <ZoomOut size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={handleFitToScreen}
                          className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                          title="Fit preview to screen width"
                          aria-label="Fit preview to screen width"
                        >
                          Fit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewZoom(1)}
                          className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                          title="Reset Zoom"
                          aria-label="Reset zoom to 100%"
                        >
                          100%
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewZoom(prev => Math.min(1.4, prev + 0.1))}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                          title="Zoom In"
                          aria-label="Zoom in preview"
                        >
                          <ZoomIn size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Preview Scrollable Container */}
                    <div className="bg-slate-200/70 dark:bg-slate-900/60 p-2 sm:p-6 rounded-3xl border border-slate-300/80 dark:border-slate-800 overflow-x-auto shadow-inner flex justify-center max-h-[82vh] overflow-y-auto">
                      <div 
                        style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
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
              )}

              {/* EDITOR ONLY VIEW */}
              {activeView === 'edit' && (
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Edit3 size={14} />
                      <span>Resume Content Editor</span>
                    </h2>
                    <button
                      onClick={() => setActiveView('preview')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      <span>Switch to Preview</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <ResumeForm
                    data={currentResume.data}
                    onChange={handleUpdateResumeData}
                    language={currentResume.language}
                    onOpenAIModal={() => setIsAIModalOpen(true)}
                    onOpenCoverLetter={() => setActiveView('cover-letter')}
                    onOpenImportModal={() => setIsImportModalOpen(true)}
                    darkMode={darkMode}
                  />
                </div>
              )}

              {/* PREVIEW ONLY VIEW */}
              {activeView === 'preview' && (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="w-full max-w-4xl flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={() => setActiveView('edit')}
                      className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1 px-2 py-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Back to Editor"
                    >
                      <span>← Back to Editor</span>
                    </button>

                    {/* Preview Zoom Controls */}
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5" role="toolbar" aria-label="Preview zoom controls">
                      <button
                        type="button"
                        onClick={() => setPreviewZoom(prev => Math.max(0.35, prev - 0.1))}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                        title="Zoom Out"
                        aria-label="Zoom out preview"
                      >
                        <ZoomOut size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={handleFitToScreen}
                        className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                        title="Fit preview to screen width"
                        aria-label="Fit preview to screen width"
                      >
                        Fit
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewZoom(1)}
                        className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                        title="Reset Zoom"
                        aria-label="Reset zoom to 100%"
                      >
                        100%
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewZoom(prev => Math.min(1.4, prev + 0.1))}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded focus-visible:ring-2 focus-visible:ring-blue-500"
                        title="Zoom In"
                        aria-label="Zoom in preview"
                      >
                        <ZoomIn size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
                        aria-label="Download PDF document"
                      >
                        <Download size={14} />
                        <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full max-w-4xl bg-slate-200/70 dark:bg-slate-900/60 p-2 sm:p-8 rounded-3xl border border-slate-300/80 dark:border-slate-800 overflow-x-auto shadow-inner flex justify-center">
                    <div 
                      style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
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
              )}
            </div>
          </div>
        )}

        {/* Hidden Print & Export Mount: Ensured present for instant PDF/Image export and Print even on edit/dashboard/templates views */}
        {activeView !== 'split' && activeView !== 'preview' && activeView !== 'customize' && activeView !== 'cover-letter' && (
          <div 
            id="resume-print-mount" 
            className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 print:opacity-100 print:relative print:left-auto print:top-auto print:pointer-events-auto"
            aria-hidden="true"
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
        )}
      </main>

      {/* Footer with JH Soft Branding */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 py-6 px-4 mb-20 md:mb-0 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>JH Soft CV</span>
            <span className="text-slate-400 font-normal">•</span>
            <a 
              href="https://cv.jhsoft.online" 
              target="_blank" 
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              cv.jhsoft.online
            </a>
          </div>

          <p className="text-[11px] text-slate-400">
            Built by <strong className="text-slate-700 dark:text-slate-300">JH Soft</strong> (jhsoft.online). Private, local-first browser storage.
          </p>
        </div>
      </footer>

      {/* Floating Mobile Bottom Navigation */}
      <nav id="mobile-bottom-nav" aria-label="Mobile Navigation" className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 flex items-center justify-around">
        <button
          type="button"
          onClick={() => setActiveView('dashboard')}
          className={`flex-1 min-h-[44px] py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
            activeView === 'dashboard' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : 'text-slate-500 dark:text-slate-400'
          }`}
          aria-label="Switch to Resumes Dashboard"
        >
          <Layers size={16} />
          <span>Resumes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('templates')}
          className={`flex-1 min-h-[44px] py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
            activeView === 'templates' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : 'text-slate-500 dark:text-slate-400'
          }`}
          aria-label="Switch to Templates Gallery"
        >
          <Layout size={16} />
          <span>Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('edit')}
          className={`flex-1 min-h-[44px] py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
            activeView === 'edit' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : 'text-slate-500 dark:text-slate-400'
          }`}
          aria-label="Switch to Resume Editor"
        >
          <Edit3 size={16} />
          <span>Editor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('preview')}
          className={`flex-1 min-h-[44px] py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
            activeView === 'preview' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : 'text-slate-500 dark:text-slate-400'
          }`}
          aria-label="Switch to Full Preview"
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('cover-letter')}
          className={`flex-1 min-h-[44px] py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
            activeView === 'cover-letter' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' : 'text-slate-500 dark:text-slate-400'
          }`}
          aria-label="Switch to Cover Letter Studio"
        >
          <Mail size={16} />
          <span>Letter</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAIModalOpen(true)}
          className="flex-1 min-h-[44px] py-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Open AI Career Assistant"
        >
          <Sparkles size={17} />
          <span>AI Assist</span>
        </button>
      </nav>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        data={currentResume.data}
        onUpdateData={handleUpdateResumeData}
        language={currentResume.language}
        onSwitchLanguage={handleLanguageSwitch}
        darkMode={darkMode}
      />

      {/* Print & Formatting Options Modal */}
      <PrintOptionsModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        options={currentResume.printOptions}
        onChangeOptions={handlePrintOptionsChange}
        accentColor={currentResume.accentColor}
        onChangeAccentColor={handleAccentColorChange}
        font={currentResume.font}
        onChangeFont={handleFontChange}
        fontSize={currentResume.fontSize}
        onChangeFontSize={handleFontSizeChange}
        darkMode={darkMode}
      />

      {/* Shop Account & MySQL Cloud Sync Modal */}
      <ShopAccountModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        resumes={resumes}
        onResumesLoadedFromCloud={(loaded) => {
          setResumes(loaded);
          if (loaded.length > 0) {
            setCurrentResumeId(loaded[0].id);
          }
        }}
        showToast={showToast}
      />

      {/* Smart CV & PDF Auto-Importer Modal */}
      <CVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApplyData={handleApplyParsedCV}
        darkMode={darkMode}
      />

      {/* Cyber Cafe Customer Print Slip & Mobile QR Modal */}
      <CustomerSlipModal
        isOpen={isCustomerSlipModalOpen}
        onClose={() => setIsCustomerSlipModalOpen(false)}
        currentResume={currentResume}
        currentUser={currentUser}
        darkMode={darkMode}
        showToast={showToast}
      />

      {/* In-App Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
