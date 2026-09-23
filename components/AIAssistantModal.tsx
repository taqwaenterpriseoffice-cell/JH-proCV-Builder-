import React, { useState } from 'react';
import { 
  Sparkles, X, Check, Copy, RefreshCw, FileText, 
  CheckCircle, AlertCircle, Key, Languages, Briefcase, 
  Target, Send, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';
import { ResumeData, Language } from '../types';
import { 
  generateProfessionalSummary, 
  suggestSkills, 
  improveExperienceBullets, 
  tailorResumeToJob, 
  generateCoverLetter, 
  polishGrammarAndStyle, 
  translateResumeData,
  getGeminiApiKey 
} from '../services/aiService';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onUpdateData: (newData: ResumeData) => void;
  language: Language;
  onSwitchLanguage: (lang: Language) => void;
  darkMode: boolean;
}

type AITab = 'summary' | 'bullets' | 'skills' | 'tailor' | 'coverletter' | 'polish' | 'translate' | 'settings';

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  data,
  onUpdateData,
  language,
  onSwitchLanguage,
  darkMode
}) => {
  const [activeTab, setActiveTab] = useState<AITab>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Summary Generator state
  const [summaryTone, setSummaryTone] = useState<'modern' | 'executive' | 'technical' | 'entry'>('modern');
  const [generatedSummary, setGeneratedSummary] = useState(data.personal.summary || '');

  // Bullet Point Improver state
  const [selectedExpId, setSelectedExpId] = useState<string>(data.experience[0]?.id || '');
  const [bulletInput, setBulletInput] = useState<string>(data.experience[0]?.description || '');
  const [improvedBullets, setImprovedBullets] = useState<string>('');

  // Skills state
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  // Job Tailoring state
  const [jobDescription, setJobDescription] = useState<string>('');
  const [tailorResult, setTailorResult] = useState<{
    matchScore: number;
    missingKeywords: string[];
    suggestedSummary: string;
    advice: string;
  } | null>(null);

  // Cover letter state
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState(data.personal.title || '');
  const [coverLetterOutput, setCoverLetterOutput] = useState('');

  // Polish state
  const [polishInput, setPolishInput] = useState(data.personal.summary || '');
  const [polishedOutput, setPolishedOutput] = useState('');

  // API Key Settings
  const [userApiKey, setUserApiKey] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('jh_soft_cv_user_api_key') || '' : '';
  });

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Generate Summary
  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const result = await generateProfessionalSummary(data, language, summaryTone);
      if (result) {
        setGeneratedSummary(result);
      } else {
        showNotification("Failed to generate summary. Please check your API key.");
      }
    } catch {
      showNotification("Error during summary generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySummary = () => {
    onUpdateData({
      ...data,
      personal: { ...data.personal, summary: generatedSummary }
    });
    showNotification("Summary applied to resume!");
  };

  // 2. Improve Bullets
  const handleImproveBullets = async () => {
    setIsLoading(true);
    const exp = data.experience.find(e => e.id === selectedExpId);
    try {
      const result = await improveExperienceBullets(
        exp?.position || data.personal.title,
        exp?.company || '',
        bulletInput,
        language
      );
      setImprovedBullets(result);
    } catch {
      showNotification("Error improving bullets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyBullets = () => {
    if (!selectedExpId) return;
    const updated = data.experience.map(e => 
      e.id === selectedExpId ? { ...e, description: improvedBullets } : e
    );
    onUpdateData({ ...data, experience: updated });
    showNotification("Bullets applied to work experience item!");
  };

  // 3. Suggest Skills
  const handleSuggestSkills = async () => {
    setIsLoading(true);
    try {
      const skills = await suggestSkills(data, language);
      const unique = skills.filter(s => !data.skills.some(existing => existing.toLowerCase() === s.toLowerCase()));
      setSuggestedSkills(unique);
    } catch {
      showNotification("Error suggesting skills.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    if (!data.skills.includes(skill)) {
      onUpdateData({ ...data, skills: [...data.skills, skill] });
      setSuggestedSkills(prev => prev.filter(s => s !== skill));
    }
  };

  const handleAddAllSkills = () => {
    const toAdd = suggestedSkills.filter(s => !data.skills.includes(s));
    onUpdateData({ ...data, skills: [...data.skills, ...toAdd] });
    setSuggestedSkills([]);
    showNotification(`Added ${toAdd.length} skills to resume!`);
  };

  // 4. Tailor to Job
  const handleTailorJob = async () => {
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    try {
      const result = await tailorResumeToJob(data, jobDescription, language);
      setTailorResult(result);
    } catch {
      showNotification("Tailoring analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    setIsLoading(true);
    try {
      const result = await generateCoverLetter(data, targetRole, targetCompany, language);
      setCoverLetterOutput(result);
    } catch {
      showNotification("Cover letter generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Polish Grammar
  const handlePolish = async () => {
    if (!polishInput.trim()) return;
    setIsLoading(true);
    try {
      const result = await polishGrammarAndStyle(polishInput, language);
      setPolishedOutput(result);
    } catch {
      showNotification("Proofreading failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Full Translate
  const handleTranslateAll = async (targetLang: Language) => {
    if (targetLang === language) return;
    if (!window.confirm(`Translate the entire resume into ${targetLang === 'bn' ? 'Bengali (বাংলা)' : 'English'}?`)) return;
    setIsLoading(true);
    try {
      const translated = await translateResumeData(data, targetLang);
      onUpdateData(translated);
      onSwitchLanguage(targetLang);
      showNotification(`Resume successfully translated to ${targetLang === 'bn' ? 'Bengali' : 'English'}!`);
    } catch {
      showNotification("Translation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // 8. Save API Key
  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jh_soft_cv_user_api_key', userApiKey.trim());
      showNotification("Gemini API key saved to browser storage.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl rounded-3xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                  JH Soft AI Career Assistant
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enhance, tailor, and polish your resume documents with AI.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-200">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)}>✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-slate-50/30 dark:bg-slate-900/30 flex-shrink-0 gap-1 sm:gap-2">
          {[
            { id: 'summary', label: 'Summary Generator', icon: FileText },
            { id: 'bullets', label: 'STAR Bullets', icon: Briefcase },
            { id: 'skills', label: 'Skill Recommender', icon: Sparkles },
            { id: 'tailor', label: 'Job Tailoring / ATS', icon: Target },
            { id: 'coverletter', label: 'Cover Letter', icon: Send },
            { id: 'polish', label: 'Proofreader', icon: CheckCircle },
            { id: 'translate', label: 'Translate', icon: Languages },
            { id: 'settings', label: 'API Key', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AITab)}
                className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SUMMARY GENERATOR */}
          {activeTab === 'summary' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold">Executive Summary Generator</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Draft a high-impact opening summary tailored to your experience and skills.
                  </p>
                </div>

                {/* Tone Select */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  {(['modern', 'executive', 'technical', 'entry'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSummaryTone(t)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                        summaryTone === t
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Summary Preview &amp; Editor
                  </span>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                    <span>{isLoading ? 'Drafting...' : 'Generate New Draft'}</span>
                  </button>
                </div>

                <textarea
                  value={generatedSummary}
                  onChange={(e) => setGeneratedSummary(e.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                  placeholder="Click 'Generate New Draft' to generate with Gemini AI..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleCopy(generatedSummary)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <Copy size={13} />
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleApplySummary}
                  disabled={!generatedSummary.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>Apply to Resume</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STAR BULLETS */}
          {activeTab === 'bullets' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold">STAR Method Bullet Point Optimizer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transform raw task descriptions into quantifiable, action-verb achievement bullets (Situation, Task, Action, Result).
                </p>
              </div>

              {/* Select Experience Item */}
              {data.experience.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Work Experience to Improve
                  </label>
                  <select
                    value={selectedExpId}
                    onChange={(e) => {
                      setSelectedExpId(e.target.value);
                      const exp = data.experience.find(item => item.id === e.target.value);
                      if (exp) setBulletInput(exp.description);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                  >
                    {data.experience.map(exp => (
                      <option key={exp.id} value={exp.id}>
                        {exp.position || 'Position'} at {exp.company || 'Company'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Original Description
                  </span>
                  <textarea
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter raw job responsibilities or draft notes..."
                  />
                  <button
                    onClick={handleImproveBullets}
                    disabled={isLoading || !bulletInput.trim()}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                  >
                    <Sparkles size={13} />
                    <span>{isLoading ? 'Optimizing with STAR...' : 'Optimize Bullets'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Suggested STAR Bullets
                  </span>
                  <textarea
                    value={improvedBullets}
                    onChange={(e) => setImprovedBullets(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/20 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optimized bullet points will appear here..."
                  />
                  <button
                    onClick={handleApplyBullets}
                    disabled={!improvedBullets.trim()}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>Apply to Selected Experience</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILL RECOMMENDER */}
          {activeTab === 'skills' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold">Skills Recommender</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Identifies high-value skills and tools based on your candidate title and project experiences.
                  </p>
                </div>

                <button
                  onClick={handleSuggestSkills}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50 self-start sm:self-auto"
                >
                  <Sparkles size={13} />
                  <span>{isLoading ? 'Analyzing...' : 'Discover Skills'}</span>
                </button>
              </div>

              {suggestedSkills.length > 0 ? (
                <div className="p-5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                      Recommended Skills ({suggestedSkills.length})
                    </span>
                    <button
                      onClick={handleAddAllSkills}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      + Add All to Resume
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleAddSkill(skill)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                        title="Click to add to resume"
                      >
                        <span>+ {skill}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                  <Sparkles className="mx-auto text-slate-400" size={24} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click &quot;Discover Skills&quot; to receive tailored suggestions matching your profile.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: JOB TAILORING / ATS */}
          {activeTab === 'tailor' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold">Target Job Tailoring &amp; ATS Matcher</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paste the job posting description you are applying for. The AI will evaluate qualification match, pinpoint missing keywords, and draft an ATS-aligned summary.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Job Posting Description
                </span>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste the requirements, responsibilities, or qualification sections of the target job..."
                />
                <button
                  onClick={handleTailorJob}
                  disabled={isLoading || !jobDescription.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  <Target size={14} />
                  <span>{isLoading ? 'Analyzing ATS Alignment...' : 'Analyze Match & Tailor'}</span>
                </button>
              </div>

              {tailorResult && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 bg-slate-50/40 dark:bg-slate-800/40 animate-in fade-in">
                  {/* Score */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center font-black shadow-md">
                      <span className="text-xl leading-none">{tailorResult.matchScore}%</span>
                      <span className="text-[9px] uppercase font-bold tracking-tight">Match</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Estimated ATS Alignment</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{tailorResult.advice}</p>
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  {tailorResult.missingKeywords.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle size={13} />
                        Recommended Keywords to Integrate:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tailorResult.missingKeywords.map((kw) => (
                          <span
                            key={kw}
                            onClick={() => handleAddSkill(kw)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 cursor-pointer hover:bg-amber-100"
                            title="Click to add as skill tag"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tailored Summary */}
                  {tailorResult.suggestedSummary && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Tailored Summary for this Role:
                        </span>
                        <button
                          onClick={() => {
                            onUpdateData({
                              ...data,
                              personal: { ...data.personal, summary: tailorResult.suggestedSummary }
                            });
                            showNotification("Tailored summary applied to resume!");
                          }}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Apply to Resume
                        </button>
                      </div>
                      <p className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        {tailorResult.suggestedSummary}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: COVER LETTER */}
          {activeTab === 'coverletter' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold">1-Page Matching Cover Letter Generator</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Generate a structured cover letter aligned with your resume experience and achievements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                    placeholder="e.g. Senior Frontend Architect"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Company Name
                  </label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateCoverLetter}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <Send size={14} />
                <span>{isLoading ? 'Drafting Cover Letter...' : 'Draft Cover Letter'}</span>
              </button>

              {coverLetterOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Generated Cover Letter
                    </span>
                    <button
                      onClick={() => handleCopy(coverLetterOutput)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>{copied ? 'Copied!' : 'Copy Cover Letter'}</span>
                    </button>
                  </div>
                  <textarea
                    value={coverLetterOutput}
                    onChange={(e) => setCoverLetterOutput(e.target.value)}
                    rows={10}
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-mono leading-relaxed outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PROOFREADER */}
          {activeTab === 'polish' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold">Grammar &amp; Style Proofreader</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Elevates vocabulary, fixes punctuation, and ensures sharp professional phrasing.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Draft Text to Polish
                </span>
                <textarea
                  value={polishInput}
                  onChange={(e) => setPolishInput(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs leading-relaxed outline-none"
                  placeholder="Paste text here to polish..."
                />
                <button
                  onClick={handlePolish}
                  disabled={isLoading || !polishInput.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  <span>{isLoading ? 'Polishing...' : 'Proofread & Enhance'}</span>
                </button>
              </div>

              {polishedOutput && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Polished Result
                    </span>
                    <button
                      onClick={() => handleCopy(polishedOutput)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    {polishedOutput}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: TRANSLATE */}
          {activeTab === 'translate' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold">Bilingual Translation Engine</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Translate your complete resume content seamlessly between English and Bengali (বাংলা) while preserving formatting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/40 dark:bg-slate-800/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Translate to Bengali
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Converts all work experience, summaries, and skill names into fluent Bengali (বাংলা).
                  </p>
                  <button
                    onClick={() => handleTranslateAll('bn')}
                    disabled={isLoading || language === 'bn'}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Languages size={14} />
                    <span>{isLoading ? 'Translating...' : 'Translate to বাংলা'}</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/40 dark:bg-slate-800/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Translate to English
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Converts Bengali text into polished global standard English.
                  </p>
                  <button
                    onClick={() => handleTranslateAll('en')}
                    disabled={isLoading || language === 'en'}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Languages size={14} />
                    <span>{isLoading ? 'Translating...' : 'Translate to English'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: API KEY & PRIVACY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold">API Key &amp; Privacy Configuration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  JH Soft CV works out of the box with the platform key. You can also provide your own personal Google Gemini API key.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>Privacy-First Architecture</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your custom key is stored strictly within your browser&apos;s local storage and is never transmitted to any third party server.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Optional Custom Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Active key status: {getGeminiApiKey() ? 'Configured' : 'Not set'}
                  </span>
                  <button
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <HelpCircle size={13} />
            <span>AI never overwrites resume content without explicit user confirmation.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
