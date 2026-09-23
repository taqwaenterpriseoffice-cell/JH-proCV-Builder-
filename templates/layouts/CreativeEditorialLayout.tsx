import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig, SectionTitle } from '../primitives';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink, Sparkles } from 'lucide-react';

export const CreativeEditorialLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'Libre Baskerville',
  language = 'en',
  printOptions,
  accentColor = '#e11d48',
  fontSize = 'normal',
  templateConfig = {} as any
}) => {
  const options = printOptions || {
    showPhoto: true,
    showSummary: true,
    showEducation: true,
    showExperience: true,
    showProjects: true,
    showSkills: true,
    showSocials: true,
    showCertifications: true,
    showLanguages: true,
    showAwards: true,
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const formatText = (text: string) => language === 'bn' ? convertToBengaliDigits(text) : text;
  const size = getSizeConfig(fontSize);

  const styleType = templateConfig.styleType || 'editorial'; // 'editorial' | 'bauhaus' | 'warm-paper' | 'vogue'
  const isWarmPaper = styleType === 'warm-paper' || styleType === 'editorial';

  return (
    <div 
      id="resume-content"
      style={{ fontFamily: font || "'Libre Baskerville', serif" }}
      className={`w-full max-w-[800px] mx-auto ${size.padding} ${size.gap} shadow-sm ${
        isWarmPaper ? 'bg-[#fcfaf7] text-stone-900' : 'bg-white text-slate-900'
      }`}
    >
      {/* Header: Editorial Asymmetric */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-stone-300">
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">
            Curriculum Vitae / Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-stone-900 font-serif">
            {data.personal.fullName || 'Creative Name'}
          </h1>
          <p 
            style={{ color: accentColor }}
            className="text-xs sm:text-sm italic font-serif font-medium tracking-wide"
          >
            {data.personal.title}
          </p>
        </div>

        {options.showPhoto && data.personal.photo && (
          <img 
            src={data.personal.photo} 
            alt={data.personal.fullName}
            className="w-20 h-20 object-cover rounded-xl shadow-xs border border-stone-200"
          />
        )}
      </div>

      {/* Contact Bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 font-sans py-1 border-b border-stone-200">
        {data.personal.phone && <span>{formatText(data.personal.phone)}</span>}
        {data.personal.email && <span>{data.personal.email}</span>}
        {data.personal.address && <span>{data.personal.address}</span>}
        {data.personal.website && <span className="font-semibold">{data.personal.website}</span>}
        {options.showSocials && data.socials.linkedin && <span>{data.socials.linkedin}</span>}
      </div>

      {/* Statement / Summary & Career Objective */}
      {((options.showSummary && data.personal.summary) || data.personal.careerObjective) && (
        <div className="py-2 space-y-2">
          {data.personal.careerObjective && (
            <div className="border-l-2 border-stone-300 pl-3">
              <div className="text-[10px] uppercase font-sans tracking-widest text-stone-400 font-bold mb-0.5">
                {language === 'bn' ? 'ক্যারিয়ার অবজেক্টিভ' : 'Career Objective'}
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-stone-800 leading-relaxed">
                "{data.personal.careerObjective}"
              </p>
            </div>
          )}
          {options.showSummary && data.personal.summary && (
            <div className={data.personal.careerObjective ? 'border-l-2 border-stone-200 pl-3' : ''}>
              <p className="text-sm sm:text-base font-serif italic text-stone-800 leading-relaxed max-w-2xl">
                "{data.personal.summary}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        {/* Main Experience Column (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          {options.showExperience && data.experience && data.experience.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">
                  01 // {t.experience}
                </span>
                <div className="flex-1 h-px bg-stone-200"></div>
              </div>

              <div className="space-y-4">
                {data.experience.map(exp => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline font-sans">
                      <div className="font-bold text-xs sm:text-sm text-stone-900">
                        {exp.position}
                      </div>
                      <span className="text-[11px] text-stone-400 font-medium">
                        {formatText(exp.duration)}
                      </span>
                    </div>
                    <div className="text-xs italic text-stone-600 font-serif">
                      {exp.company} {exp.location ? `— ${exp.location}` : ''}
                    </div>
                    <p className={`${size.body} text-stone-700 leading-relaxed pt-1`}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.showProjects && data.projects && data.projects.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">
                  02 // {t.projects}
                </span>
                <div className="flex-1 h-px bg-stone-200"></div>
              </div>

              <div className="space-y-3">
                {data.projects.map(proj => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between font-sans text-xs font-bold text-stone-900">
                      <span>{proj.title}</span>
                      {proj.link && <span className="text-[10px] text-rose-600 font-normal">{proj.link}</span>}
                    </div>
                    <p className={`${size.body} text-stone-600`}>{proj.description}</p>
                    {proj.tech && <div className="text-[10px] text-stone-400 font-sans">{proj.tech}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          {/* Skills */}
          {options.showSkills && data.skills && data.skills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">
                  {t.skills}
                </span>
                <div className="flex-1 h-px bg-stone-200"></div>
              </div>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {data.skills.map((s, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] px-2.5 py-1 rounded-full border border-stone-300 text-stone-800 bg-white font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {options.showEducation && data.education && data.education.length > 0 && (
            <div className="space-y-2 font-sans">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  {t.education}
                </span>
                <div className="flex-1 h-px bg-stone-200"></div>
              </div>
              <div className="space-y-2 text-xs">
                {data.education.map(edu => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="font-bold text-stone-900">{edu.degree}</div>
                    <div className="text-stone-600 text-[11px]">{edu.institute}</div>
                    <div className="text-stone-400 text-[10px]">{formatText(edu.year)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages & Certifications */}
          {options.showLanguages && data.languages && data.languages.length > 0 && (
            <div className="space-y-2 font-sans">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  {t.languages}
                </span>
                <div className="flex-1 h-px bg-stone-200"></div>
              </div>
              <div className="space-y-1 text-xs">
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between">
                    <span className="text-stone-800">{l.name}</span>
                    <span className="text-stone-400 text-[10px]">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* References */}
      {options.showReferences !== false && data.references && data.references.length > 0 && (
        <div className="pt-4 border-t border-stone-200 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">
              {t.references || (language === 'bn' ? 'রেফারেন্স' : 'References')}
            </span>
            <div className="flex-1 h-px bg-stone-200"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
            {data.references.map(ref => (
              <div key={ref.id} className="p-2.5 rounded-lg border border-stone-200 bg-white shadow-2xs">
                <div className="font-bold text-stone-900">{ref.name}</div>
                <div className="text-stone-700 text-[11px]">{ref.designation} — {ref.organization}</div>
                {ref.phone && <div className="text-stone-500 text-[11px]">Phone: {formatText(ref.phone)}</div>}
                {ref.email && <div className="text-stone-500 text-[11px]">Email: {ref.email}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration & Signature */}
      {options.showDeclaration !== false && data.declaration?.enabled !== false && data.declaration?.text && (
        <div className="pt-4 border-t border-stone-200 text-xs space-y-2 font-sans">
          <div className="text-[11px] italic font-serif text-stone-700 leading-relaxed">
            {data.declaration.text}
          </div>
          <div className="flex justify-between items-end text-[11px] text-stone-500">
            <div>
              {data.declaration.date && <div>Date: {formatText(data.declaration.date)}</div>}
              {data.declaration.place && <div>Place: {data.declaration.place}</div>}
            </div>
            {options.showSignature !== false && (
              <div className="text-right">
                <div className="font-serif italic text-xs font-bold text-stone-800 border-t border-stone-400 pt-0.5 px-3">
                  {data.personal.signature || data.personal.fullName}
                </div>
                <div className="text-[9px] text-stone-400">Signature</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
