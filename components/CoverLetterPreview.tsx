import React from 'react';
import { CoverLetterData, ResumeData, ThemeType, Language } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { convertToBengaliDigits } from '../templates/primitives';

interface CoverLetterPreviewProps {
  data: CoverLetterData;
  resumeData: ResumeData;
  theme?: ThemeType;
  font?: string;
  language?: Language;
  accentColor?: string;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  data,
  resumeData,
  theme = 'bd-standard',
  font = 'Inter',
  language = 'en',
  accentColor = '#2563eb'
}) => {
  const formatText = (text: string) => language === 'bn' ? convertToBengaliDigits(text) : text;
  const isBangla = language === 'bn';

  // Determine theme style variant
  const isBDTheme = theme?.startsWith('bd-') || theme === 'bangladesh-cv' || theme === 'bd-govt';
  const isModern = theme === 'modern' || theme === 'corporate' || theme === 'executive' || theme === 'creative';
  const isATS = theme === 'ats' || theme === 'minimal' || theme === 'simple';
  const isTech = theme === 'tech';

  const paragraphs = (data.letterBody || '').split('\n').filter(p => p.trim().length > 0);

  return (
    <div
      id="cover-letter-content"
      className="a4-page-sheet w-[794px] min-h-[1123px] max-h-[1123px] bg-white text-slate-900 shadow-xl mx-auto flex flex-col justify-between overflow-hidden relative"
      style={{ 
        fontFamily: font || (isBangla ? "'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif" : "'Inter', sans-serif"),
        padding: '48px 56px'
      }}
    >
      <div>
        {/* Top Header Section - Synchronized with CV Brand & Identity */}
        {isBDTheme ? (
          // Bangladesh Classic / Formal Header
          <div className="pb-4 mb-6 border-b-2" style={{ borderColor: accentColor || '#059669' }}>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                  {resumeData.personal.fullName || 'Candidate Name'}
                </h1>
                <p className="text-sm font-bold tracking-wide mt-0.5" style={{ color: accentColor || '#059669' }}>
                  {resumeData.personal.title}
                </p>
              </div>

              {resumeData.personal.photo && (
                <img
                  src={resumeData.personal.photo}
                  alt={resumeData.personal.fullName}
                  className="w-16 h-20 object-cover rounded border border-slate-300 shadow-2xs"
                />
              )}
            </div>

            {/* Contact Details Bar */}
            <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
              {resumeData.personal.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={11} className="text-slate-400" />
                  <span>{formatText(resumeData.personal.phone)}</span>
                </span>
              )}
              {resumeData.personal.email && (
                <span className="flex items-center gap-1">
                  <Mail size={11} className="text-slate-400" />
                  <span>{resumeData.personal.email}</span>
                </span>
              )}
              {resumeData.personal.address && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-slate-400" />
                  <span>{resumeData.personal.address}</span>
                </span>
              )}
              {resumeData.personal.website && (
                <span className="flex items-center gap-1">
                  <Globe size={11} className="text-slate-400" />
                  <span>{resumeData.personal.website}</span>
                </span>
              )}
            </div>
          </div>
        ) : isModern ? (
          // Modern / Executive Accent Header
          <div className="pb-5 mb-6 border-b border-slate-200 relative">
            <div 
              className="absolute -top-12 -left-14 -right-14 h-3"
              style={{ backgroundColor: accentColor }}
            />
            <div className="flex justify-between items-baseline">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {resumeData.personal.fullName || 'Candidate Name'}
                </h1>
                <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: accentColor }}>
                  {resumeData.personal.title}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
              {resumeData.personal.phone && <span>{formatText(resumeData.personal.phone)}</span>}
              {resumeData.personal.email && <span>• {resumeData.personal.email}</span>}
              {resumeData.personal.address && <span>• {resumeData.personal.address}</span>}
              {resumeData.socials?.linkedin && <span>• {resumeData.socials.linkedin}</span>}
            </div>
          </div>
        ) : isTech ? (
          // Tech / Monospace Header
          <div className="pb-4 mb-6 border-b-2 border-slate-900">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider">// COVER_LETTER</span>
                <h1 className="text-2xl font-mono font-black text-slate-900">
                  {resumeData.personal.fullName || 'developer'}
                </h1>
                <p className="text-xs font-mono text-slate-600">
                  $ role="{resumeData.personal.title}"
                </p>
              </div>
            </div>
            <div className="mt-2 text-xs font-mono text-slate-600 flex flex-wrap gap-x-3">
              {resumeData.personal.phone && <span>tel: {formatText(resumeData.personal.phone)}</span>}
              {resumeData.personal.email && <span>email: {resumeData.personal.email}</span>}
              {resumeData.socials?.github && <span>github: {resumeData.socials.github}</span>}
            </div>
          </div>
        ) : (
          // ATS / Minimalist Clean
          <div className="pb-4 mb-6 border-b border-slate-300">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              {resumeData.personal.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-0.5">
              {resumeData.personal.title}
            </p>
            <div className="mt-2 text-xs text-slate-600 flex flex-wrap gap-x-3">
              {resumeData.personal.phone && <span>{formatText(resumeData.personal.phone)}</span>}
              {resumeData.personal.email && <span>| {resumeData.personal.email}</span>}
              {resumeData.personal.address && <span>| {resumeData.personal.address}</span>}
            </div>
          </div>
        )}

        {/* Date & Recipient Details */}
        <div className="mb-5 space-y-1 text-xs text-slate-800 leading-relaxed">
          <div className="font-semibold text-slate-600 mb-3">
            {formatText(data.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))}
          </div>

          <div className="space-y-0.5">
            {data.recipientName && <div className="font-bold text-slate-900">{data.recipientName}</div>}
            {data.recipientDesignation && <div className="text-slate-700">{data.recipientDesignation}</div>}
            {data.companyName && <div className="font-bold text-slate-900">{data.companyName}</div>}
            {data.companyAddress && <div className="text-slate-600">{data.companyAddress}</div>}
          </div>
        </div>

        {/* Subject Line & Circular Reference */}
        <div className="mb-4">
          <div className="text-xs font-bold text-slate-900 py-1.5 px-3 bg-slate-100 rounded-lg inline-block border border-slate-200">
            {data.subject || `Subject: Application for the position of ${data.jobTitle || 'Executive'}`}
          </div>
          {data.circularReference && (
            <div className="text-[11px] font-medium text-slate-500 mt-1 pl-1">
              {data.circularReference}
            </div>
          )}
        </div>

        {/* Salutation */}
        <div className="text-xs font-semibold text-slate-900 mb-3">
          {data.salutation || (isBangla ? 'মহোদয়,' : 'Dear Hiring Manager,')}
        </div>

        {/* Letter Body Paragraphs */}
        <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-slate-800 text-justify">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, idx) => (
              <p key={idx} className="indent-4 leading-relaxed">
                {p}
              </p>
            ))
          ) : (
            <p className="italic text-slate-400">
              {isBangla 
                ? 'কভার লেটারের মূল বক্তব্য এখানে লিখুন অথবা উপরের AI বাটনে ক্লিক করে স্বয়ংক্রিয়ভাবে তৈরি করুন।' 
                : 'Enter your cover letter content or click the AI button above to auto-generate a tailored letter.'}
            </p>
          )}
        </div>
      </div>

      {/* Complimentary Close & Signature Block */}
      <div className="pt-6 border-t border-slate-200 mt-6 flex justify-between items-end text-xs">
        <div className="space-y-1">
          <div className="text-slate-700 font-medium">
            {data.closing || (isBangla ? 'বিনীত নিবেদক,' : 'Sincerely,')}
          </div>

          {/* Digital Signature */}
          <div className="py-1">
            {resumeData.personal.signature ? (
              <div className="font-serif italic text-base font-bold text-slate-900">
                {resumeData.personal.signature}
              </div>
            ) : (
              <div className="h-8"></div>
            )}
          </div>

          <div className="border-t border-slate-400 pt-1">
            <div className="font-bold text-slate-900">
              {data.signOffName || resumeData.personal.fullName}
            </div>
            {data.signOffTitle && (
              <div className="text-[11px] text-slate-600">{data.signOffTitle}</div>
            )}
            <div className="text-[10px] text-slate-500 flex flex-wrap gap-x-3 pt-0.5">
              {resumeData.personal.phone && <span>{formatText(resumeData.personal.phone)}</span>}
              {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
            </div>
          </div>
        </div>

        <div className="text-right text-[10px] text-slate-400">
          <div>Enclosure: Curriculum Vitae</div>
          <div>Page 1 of 1</div>
        </div>
      </div>
    </div>
  );
};
