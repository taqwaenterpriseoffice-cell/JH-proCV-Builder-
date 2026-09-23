import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig, SectionTitle } from '../primitives';
import { Mail, Phone, MapPin, Linkedin, Globe, Award, ShieldCheck, Stethoscope, BookOpen, Globe2 } from 'lucide-react';

export const SpecializedLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'Inter',
  language = 'en',
  printOptions,
  accentColor = '#0284c7',
  fontSize = 'normal',
  templateConfig = {}
}: TemplateRenderProps) => {
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

  const specType = templateConfig.specType || 'medical'; // 'medical' | 'academic' | 'europass' | 'ngo'

  return (
    <div 
      id="resume-content"
      className={`w-full max-w-[800px] mx-auto bg-white text-slate-900 ${size.padding} space-y-5 shadow-sm border-l-4`}
      style={{ borderLeftColor: accentColor, fontFamily: font }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            {specType === 'medical' && <Stethoscope size={14} />}
            {specType === 'academic' && <BookOpen size={14} />}
            {specType === 'europass' && <Globe2 size={14} />}
            <span>
              {specType === 'medical' ? 'Clinical Curriculum Vitae' : 
               specType === 'academic' ? 'Academic Faculty CV' : 
               specType === 'europass' ? 'Europass Standard Format' : 'International Professional Dossier'}
            </span>
          </div>

          <h1 className={`${size.name} text-slate-900 tracking-tight`}>
            {data.personal.fullName || 'Candidate Name'}
          </h1>
          <p className={`${size.title} font-semibold text-slate-700`}>
            {data.personal.title}
          </p>
        </div>

        {/* Contact Strip */}
        <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{formatText(data.personal.phone)}</div>}
          {data.personal.address && <div>{data.personal.address}</div>}
          {data.personal.website && <div className="text-blue-600">{data.personal.website}</div>}
        </div>
      </div>

      {/* Summary / Practice Statement & Career Objective */}
      {((options.showSummary && data.personal.summary) || data.personal.careerObjective) && (
        <div className="space-y-2">
          {data.personal.careerObjective && (
            <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {language === 'bn' ? 'ক্যারিয়ার অবজেক্টিভ' : 'Career Objective'}
              </h3>
              <p className={`${size.body} text-slate-700 leading-relaxed`}>
                {data.personal.careerObjective}
              </p>
            </div>
          )}
          {options.showSummary && data.personal.summary && (
            <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {specType === 'medical' ? 'Clinical Focus & Philosophy' : 
                 specType === 'academic' ? 'Research Profile & Interests' : t.summary}
              </h3>
              <p className={`${size.body} text-slate-700 leading-relaxed`}>
                {data.personal.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Education (Prominent for Academic/Medical) */}
      {options.showEducation && data.education && data.education.length > 0 && (
        <div className="space-y-2">
          <SectionTitle 
            title={specType === 'academic' ? 'Academic Appointments & Degrees' : t.education} 
            variant="left-bar" 
            accentColor={accentColor} 
          />
          <div className="space-y-2">
            {data.education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institute} {edu.location ? `— ${edu.location}` : ''}</div>
                </div>
                <div className="text-right text-[11px] font-semibold text-slate-500">
                  <div>{formatText(edu.year)}</div>
                  {edu.result && <div className="text-slate-700">{formatText(edu.result)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience / Clinical Practice */}
      {options.showExperience && data.experience && data.experience.length > 0 && (
        <div className="space-y-3">
          <SectionTitle 
            title={specType === 'medical' ? 'Clinical Experience & Practice' : 
                   specType === 'academic' ? 'Teaching & Research Experience' : t.experience} 
            variant="left-bar" 
            accentColor={accentColor} 
          />
          <div className="space-y-3">
            {data.experience.map(exp => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline text-xs sm:text-sm">
                  <div className="font-bold text-slate-900">
                    {exp.position} <span className="font-normal text-slate-600">| {exp.company}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {formatText(exp.duration)}
                  </span>
                </div>
                <div className={`${size.body} text-slate-700 whitespace-pre-line pl-2 border-l border-slate-200`}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications, Licenses, Awards & Languages in 2 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
        {options.showCertifications && data.certifications && data.certifications.length > 0 && (
          <div className="space-y-2">
            <SectionTitle 
              title={specType === 'medical' ? 'Board Certifications & Medical Licenses' : t.certifications} 
              variant="left-bar" 
              accentColor={accentColor} 
            />
            <div className="space-y-1.5 text-xs text-slate-700">
              {data.certifications.map(c => (
                <div key={c.id}>
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.issuer} ({formatText(c.date)})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {options.showLanguages && data.languages && data.languages.length > 0 && (
          <div className="space-y-2">
            <SectionTitle title={t.languages} variant="left-bar" accentColor={accentColor} />
            <div className="space-y-1 text-xs text-slate-700">
              {data.languages.map(l => (
                <div key={l.id} className="flex justify-between">
                  <span className="font-medium text-slate-900">{l.name}</span>
                  <span className="text-slate-500">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills & Competencies */}
      {options.showSkills && data.skills && data.skills.length > 0 && (
        <div className="space-y-2 pt-1">
          <SectionTitle title={t.skills} variant="left-bar" accentColor={accentColor} />
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {options.showReferences !== false && data.references && data.references.length > 0 && (
        <div className="space-y-2 pt-2">
          <SectionTitle 
            title={specType === 'academic' ? 'Academic Referees' : (t.references || (language === 'bn' ? 'রেফারেন্স' : 'Professional References'))} 
            variant="left-bar" 
            accentColor={accentColor} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            {data.references.map(ref => (
              <div key={ref.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-[11px] text-slate-600">{ref.designation} — {ref.organization}</div>
                {ref.phone && <div className="text-[11px] text-slate-500">Phone: {formatText(ref.phone)}</div>}
                {ref.email && <div className="text-[11px] text-slate-500">Email: {ref.email}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration & Signature */}
      {options.showDeclaration !== false && data.declaration?.enabled !== false && data.declaration?.text && (
        <div className="pt-3 border-t border-slate-200 text-xs space-y-2">
          <div className="text-[11px] italic text-slate-600 leading-relaxed">
            {data.declaration.text}
          </div>
          <div className="flex justify-between items-end text-[11px] text-slate-500">
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
