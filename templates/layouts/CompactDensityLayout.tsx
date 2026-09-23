import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig } from '../primitives';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

export const CompactDensityLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'Roboto Condensed',
  language = 'en',
  printOptions,
  accentColor = '#0f766e',
  fontSize = 'compact',
  templateConfig = {}
}) => {
  const options = printOptions || {
    showPhoto: false,
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
  const size = getSizeConfig(fontSize || 'compact');

  return (
    <div 
      id="resume-content"
      style={{ fontFamily: font }}
      className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-5 sm:p-6 space-y-3 shadow-sm border-t-2 border-slate-800"
    >
      {/* Dense Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-slate-300 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            {data.personal.fullName || 'Candidate Name'}
          </h1>
          <p 
            style={{ color: accentColor }}
            className="text-xs font-bold uppercase tracking-wider"
          >
            {data.personal.title}
          </p>
        </div>

        {/* Compact Right-Aligned Contact Block */}
        <div className="text-right text-[10px] text-slate-600 space-y-0.5 mt-1 sm:mt-0 font-medium">
          <div className="flex flex-wrap gap-x-2 justify-start sm:justify-end">
            {data.personal.phone && <span>{formatText(data.personal.phone)}</span>}
            {data.personal.email && <span>• {data.personal.email}</span>}
            {data.personal.address && <span>• {data.personal.address}</span>}
          </div>
          <div className="flex flex-wrap gap-x-2 justify-start sm:justify-end">
            {data.personal.website && <span>{data.personal.website}</span>}
            {options.showSocials && data.socials.linkedin && <span>• {data.socials.linkedin}</span>}
            {options.showSocials && data.socials.github && <span>• {data.socials.github}</span>}
          </div>
        </div>
      </div>

      {/* Summary & Career Objective */}
      {((options.showSummary && data.personal.summary) || data.personal.careerObjective) && (
        <div className="space-y-1">
          {data.personal.careerObjective && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {language === 'bn' ? 'ক্যারিয়ার অবজেক্টিভ' : 'Career Objective'}
              </div>
              <p className="text-[11px] leading-snug text-slate-800">
                {data.personal.careerObjective}
              </p>
            </div>
          )}
          {options.showSummary && data.personal.summary && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {t.summary}
              </div>
              <p className="text-[11px] leading-snug text-slate-800">
                {data.personal.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Experience - Tabular Dense Chronology */}
      {options.showExperience && data.experience && data.experience.length > 0 && (
        <div className="space-y-1.5">
          <div 
            style={{ borderBottomColor: accentColor }}
            className="border-b pb-0.5 text-[11px] font-black uppercase tracking-wider text-slate-900 flex justify-between"
          >
            <span>{t.experience}</span>
            <span className="text-[9px] font-normal text-slate-500">Chronological</span>
          </div>

          <div className="space-y-2">
            {data.experience.map(exp => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline text-xs">
                  <div className="font-bold text-slate-900">
                    {exp.position} <span className="font-semibold text-slate-700">| {exp.company}</span>
                    {exp.location && <span className="text-[10px] text-slate-400 font-normal"> ({exp.location})</span>}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 flex-shrink-0">
                    {formatText(exp.duration)}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-slate-700 whitespace-pre-line pl-1 border-l border-slate-200">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Projects */}
      {options.showProjects && data.projects && data.projects.length > 0 && (
        <div className="space-y-1.5">
          <div 
            style={{ borderBottomColor: accentColor }}
            className="border-b pb-0.5 text-[11px] font-black uppercase tracking-wider text-slate-900"
          >
            {t.projects}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.projects.map(proj => (
              <div key={proj.id} className="p-1.5 rounded bg-slate-50 border border-slate-200/80 space-y-0.5">
                <div className="flex justify-between items-baseline text-[11px] font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-[9px] text-blue-600 font-normal truncate max-w-[120px]">{proj.link}</span>}
                </div>
                <p className="text-[10px] leading-tight text-slate-600">{proj.description}</p>
                {proj.tech && <div className="text-[9px] text-slate-500 font-mono">Tech: {proj.tech}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-Column Footer Grid: Education, Skills, Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-200">
        {/* Col 1: Education */}
        {options.showEducation && data.education && data.education.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-700">
              {t.education}
            </div>
            <div className="space-y-1 text-[11px]">
              {data.education.map(edu => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="font-bold text-slate-900 leading-tight">{edu.degree}</div>
                  <div className="text-[10px] text-slate-600">{edu.institute}</div>
                  <div className="text-[9px] text-slate-400">{formatText(edu.year)} {edu.result ? `• ${formatText(edu.result)}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Col 2: Skills */}
        {options.showSkills && data.skills && data.skills.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-700">
              {t.skills}
            </div>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((s, idx) => (
                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Col 3: Languages & Certifications */}
        <div className="space-y-2">
          {options.showLanguages && data.languages && data.languages.length > 0 && (
            <div className="space-y-0.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                {t.languages}
              </div>
              <div className="space-y-0.5 text-[10px] text-slate-600">
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-semibold text-slate-800">{l.name}</span>
                    <span>{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.showCertifications && data.certifications && data.certifications.length > 0 && (
            <div className="space-y-0.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                {t.certifications}
              </div>
              <div className="space-y-0.5 text-[9px] text-slate-600">
                {data.certifications.slice(0, 2).map(c => (
                  <div key={c.id}>
                    <span className="font-bold text-slate-800">{c.name}</span> ({c.issuer})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* References */}
      {options.showReferences !== false && data.references && data.references.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-slate-200">
          <div 
            style={{ borderBottomColor: accentColor }}
            className="border-b pb-0.5 text-[11px] font-black uppercase tracking-wider text-slate-900"
          >
            {t.references || (language === 'bn' ? 'রেফারেন্স' : 'References')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {data.references.map(ref => (
              <div key={ref.id} className="p-1.5 rounded bg-slate-50 border border-slate-200 text-[10px]">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-slate-700">{ref.designation} — {ref.organization}</div>
                {ref.phone && <div className="text-slate-500">Phone: {formatText(ref.phone)}</div>}
                {ref.email && <div className="text-slate-500">Email: {ref.email}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration & Signature */}
      {options.showDeclaration !== false && data.declaration?.enabled !== false && data.declaration?.text && (
        <div className="pt-2 border-t border-slate-200 text-xs space-y-1.5">
          <div className="text-[10px] italic text-slate-600 leading-snug">
            {data.declaration.text}
          </div>
          <div className="flex justify-between items-end text-[10px] text-slate-500">
            <div>
              {data.declaration.date && <div>Date: {formatText(data.declaration.date)}</div>}
              {data.declaration.place && <div>Place: {data.declaration.place}</div>}
            </div>
            {options.showSignature !== false && (
              <div className="text-right">
                <div className="font-serif italic text-xs font-bold text-slate-800 border-t border-slate-400 pt-0.5 px-3">
                  {data.personal.signature || data.personal.fullName}
                </div>
                <div className="text-[9px] text-slate-400">Signature</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
