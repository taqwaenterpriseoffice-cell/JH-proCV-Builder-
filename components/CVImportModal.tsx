import React, { useState, useRef } from 'react';
import { ResumeData } from '../types';
import { parseCVFromFile, parseCVFromText, CVParseResult } from '../services/cvImportService';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, 
  Sparkles, X, ArrowRight, ShieldCheck, Copy, FileUp, Cpu
} from 'lucide-react';

interface CVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: Partial<ResumeData>, createNew?: boolean) => void;
  darkMode?: boolean;
}

export const CVImportModal: React.FC<CVImportModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
  darkMode
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<CVParseResult | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setParseError(null);
      setParsedResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setParseError(null);
      setParsedResult(null);
    }
  };

  const handleStartParse = async () => {
    setIsParsing(true);
    setParseError(null);
    setParsedResult(null);

    try {
      let result: CVParseResult;
      if (activeTab === 'upload') {
        if (!selectedFile) {
          throw new Error('Please select a PDF or TXT file to upload.');
        }
        result = await parseCVFromFile(selectedFile);
      } else {
        if (!pastedText.trim()) {
          throw new Error('Please paste your CV or BDJobs text before parsing.');
        }
        result = await parseCVFromText(pastedText);
      }

      setParsedResult(result);
    } catch (err: any) {
      console.error(err);
      setParseError(err?.message || 'Failed to parse CV. Please check the file or text and try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleLoadSampleText = () => {
    const sample = `CURRICULUM VITAE
Md. Tanvir Ahmed
Full-Stack Web Developer & Software Engineer
Email: tanvir.ahmed@example.com
Phone: +880 1712-345678
Address: House #42, Road #11, Sector-4, Uttara, Dhaka-1230

CAREER OBJECTIVE
Enthusiastic and detail-oriented Software Engineer with 3+ years of professional hands-on experience in building scalable web applications. Eager to contribute to forward-thinking digital products.

PERSONAL DETAILS
Father's Name: Md. Rafiqul Islam
Mother's Name: Begum Rokeya Sultana
Date of Birth: 15 October 1997
Blood Group: B+
Religion: Islam
Marital Status: Single
National ID: 19972691234567890
Nationality: Bangladeshi

ACADEMIC QUALIFICATIONS
B.Sc in Computer Science and Engineering
American International University-Bangladesh (AIUB)
Passing Year: 2021
CGPA: 3.82 / 4.00

Higher Secondary Certificate (HSC) - Science
Dhaka City College
Board: Dhaka
Passing Year: 2016
GPA: 5.00 / 5.00

Secondary School Certificate (SSC) - Science
Motijheel Model High School
Board: Dhaka
Passing Year: 2014
GPA: 5.00 / 5.00

WORK EXPERIENCE
Software Engineer
Brain Station 23 Ltd., Dhaka
2022 - Present
- Architected enterprise React and Node.js solutions serving over 200,000 active users.
- Reduced API response latency by 35% using Redis caching and MySQL indexing.

Junior Web Developer
TechnoNext Systems
2021 - 2022
- Developed responsive web interfaces using Tailwind CSS and TypeScript.

SKILLS
JavaScript, TypeScript, React.js, Node.js, Express, MySQL, PostgreSQL, Docker, Git, REST APIs, Tailwind CSS

REFERENCES
Dr. Mohammad Ali
Associate Professor, Dept. of CSE, AIUB
Phone: +880 1819-998877
Email: mali@aiub.edu`;

    setPastedText(sample);
    setActiveTab('paste');
    setParseError(null);
  };

  const handleConfirmApply = (createNew: boolean = false) => {
    if (parsedResult?.data) {
      onApplyData(parsedResult.data, createNew);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>Smart CV &amp; PDF Auto-Importer</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  AI + Fast Heuristic
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload old PDF CV or paste BDJobs profile to auto-fill all form fields in 5 seconds.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Navigation Tabs */}
          {!parsedResult && (
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => { setActiveTab('upload'); setParseError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'upload'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileUp size={15} />
                <span>Upload PDF Document</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('paste'); setParseError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'paste'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Copy size={15} />
                <span>Paste Text / BDJobs</span>
              </button>
            </div>
          )}

          {/* TAB 1: FILE UPLOAD */}
          {activeTab === 'upload' && !parsedResult && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                    : selectedFile
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  selectedFile 
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                }`}>
                  {selectedFile ? <FileText size={28} /> : <Upload size={28} />}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {selectedFile ? selectedFile.name : 'Click to select or drag & drop PDF CV'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedFile 
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB • Ready to extract`
                      : 'Supports standard PDF, scanned documents, and plain text files'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Tip: Works with 1-page or multi-page Bangladeshi &amp; International CVs</span>
                <button
                  type="button"
                  onClick={handleLoadSampleText}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Or try sample text
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE TEXT */}
          {activeTab === 'paste' && !parsedResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Paste CV Content / BDJobs Profile Text:
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleText}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles size={12} />
                  <span>Insert Sample CV</span>
                </button>
              </div>

              <textarea
                rows={9}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Copy and paste entire text from BDJobs CV, MS Word, or LinkedIn summary here..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs leading-relaxed font-sans outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* PARSING PROGRESS INDICATOR */}
          {isParsing && (
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col items-center justify-center gap-3 text-center animate-pulse">
              <RefreshCw size={28} className="animate-spin text-blue-600" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                  Scanning &amp; Extracting Resume Data...
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Parsing names, parents info, address, SSC/HSC boards, GPA, employment and skills
                </p>
              </div>
            </div>
          )}

          {/* ERROR ALERT */}
          {parseError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Extraction Notice</div>
                <div className="mt-0.5">{parseError}</div>
              </div>
            </div>
          )}

          {/* PARSED PREVIEW & VERIFICATION */}
          {parsedResult && parsedResult.data && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">
                      Extraction Successful!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Method: {parsedResult.source === 'ai' ? 'Gemini 2.5 Flash Deep Engine' : 'Fast Smart Heuristic Engine'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setParsedResult(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Re-scan
                </button>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Personal Information
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {parsedResult.data.personal?.fullName || 'Full Name not detected'}
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    {parsedResult.data.personal?.email && <div>✉ {parsedResult.data.personal.email}</div>}
                    {parsedResult.data.personal?.phone && <div>📞 {parsedResult.data.personal.phone}</div>}
                    {parsedResult.data.personal?.address && <div>📍 {parsedResult.data.personal.address}</div>}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Bangladesh Bio-Data Matrix
                  </span>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                    {parsedResult.data.personal?.fathersName && (
                      <div>Father: <span className="font-semibold">{parsedResult.data.personal.fathersName}</span></div>
                    )}
                    {parsedResult.data.personal?.mothersName && (
                      <div>Mother: <span className="font-semibold">{parsedResult.data.personal.mothersName}</span></div>
                    )}
                    {parsedResult.data.personal?.bloodGroup && (
                      <div>Blood: <span className="font-semibold">{parsedResult.data.personal.bloodGroup}</span></div>
                    )}
                    {parsedResult.data.personal?.religion && (
                      <div>Religion: <span className="font-semibold">{parsedResult.data.personal.religion}</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic & Work items badges */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                  🎓 {parsedResult.data.education?.length || 0} Education Degrees
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold">
                  💼 {parsedResult.data.experience?.length || 0} Work Roles
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold">
                  ⚡ {parsedResult.data.skills?.length || 0} Skills Detected
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold">
                  👥 {parsedResult.data.references?.length || 0} References
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          {!parsedResult ? (
            <button
              type="button"
              onClick={handleStartParse}
              disabled={isParsing || (activeTab === 'upload' && !selectedFile) || (activeTab === 'paste' && !pastedText.trim())}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isParsing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>{isParsing ? 'Parsing Document...' : 'Start Extraction'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleConfirmApply(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
              >
                <span>Fill Current Resume</span>
                <ArrowRight size={13} />
              </button>

              <button
                type="button"
                onClick={() => handleConfirmApply(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
              >
                <span>Create New Resume</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
