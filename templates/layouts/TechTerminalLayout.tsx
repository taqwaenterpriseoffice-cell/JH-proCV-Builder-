import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig, SectionTitle } from '../primitives';
import { Terminal, Github, Globe, ExternalLink, Code2, Cpu, Server, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const TechTerminalLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'JetBrains Mono',
  language = 'en',
  printOptions,
  accentColor = '#059669',
  fontSize = 'normal',
  templateConfig = {}
}: TemplateRenderProps) => {
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
  const size = getSizeConfig(fontSize);

  const themeMode = templateConfig.mode || 'light'; // 'light' | 'matrix-dark' | 'clean-slate'
  const isDark = themeMode === 'matrix-dark';

  return (
    <div 
      id="resume-content"
      style={{ fontFamily: font || "'JetBrains Mono', monospace" }}
      className={`w-full max-w-[800px] mx-auto ${size.padding} space-y-4 shadow-sm ${
        isDark ? 'bg-slate-950 text-slate-100 border border-emerald-900/50' : 'bg-white text-slate-900 border-t-4'
      }`}
      {...(!isDark ? { style: { borderTopColor: accentColor } } : {})}
    >
      {/* Terminal Title Bar */}
      <div className={`p-4 rounded-xl border space-y-2 ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-slate-400 font-mono ml-2">bash - resume.sh</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
            <Terminal size={11} />
            <span>v2.4.0</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight flex items-center gap-2">
              <span className="text-emerald-500 font-normal">~/</span>
              <span>{data.personal.fullName || 'developer'}</span>
            </h1>
            <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
              $ role --title="{data.personal.title}"
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            {data.personal.email && (
              <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {data.personal.email}
              </span>
            )}
            {data.personal.phone && (
              <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {formatText(data.personal.phone)}
              </span>
            )}
            {options.showSocials && data.socials.github && (
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Github size={10} />
                {data.socials.github}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary & Career Objective */}
      {((options.showSummary && data.personal.summary) || data.personal.careerObjective) && (
        <div className="space-y-2 font-mono">
          {data.personal.careerObjective && (
            <div className="space-y-1">
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span>&gt;</span>
                <span className="uppercase">{language === 'bn' ? 'ক্যারিয়ার অবজেক্টিভ' : 'career_objective'}</span>
              </div>
              <p className={`${size.body} text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-emerald-500/40`}>
                {data.personal.careerObjective}
              </p>
            </div>
          )}
          {options.showSummary && data.personal.summary && (
            <div className="space-y-1">
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span>&gt;</span>
                <span className="uppercase">{t.summary}</span>
              </div>
              <p className={`${size.body} text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-emerald-500/40`}>
                {data.personal.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tech Stack Skills Bar */}
      {options.showSkills && data.skills && data.skills.length > 0 && (
        <div className="space-y-1.5 font-mono">
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span>&gt;</span>
            <span className="uppercase">{t.skills}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-3">
            {data.skills.map((s, idx) => (
              <span 
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
              >
                #{s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {options.showExperience && data.experience && data.experience.length > 0 && (
        <div className="space-y-3 font-mono">
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span>&gt;</span>
            <span className="uppercase">{t.experience}</span>
          </div>
          <div className="space-y-3 pl-3">
            {data.experience.map(exp => (
              <div key={exp.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Code2 size={13} className="text-emerald-500" />
                    <span>{exp.position}</span>
                    <span className="text-slate-500">@ {exp.company}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">[{formatText(exp.duration)}]</span>
                </div>
                <div className={`${size.body} text-slate-700 dark:text-slate-300 font-sans whitespace-pre-line pt-1`}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Projects */}
      {options.showProjects && data.projects && data.projects.length > 0 && (
        <div className="space-y-3 font-mono">
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span>&gt;</span>
            <span className="uppercase">{t.projects}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3">
            {data.projects.map(proj => (
              <div key={proj.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-slate-900 dark:text-slate-100">{proj.title}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                      <ExternalLink size={10} />
                      <span>repo</span>
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">{proj.description}</p>
                {proj.tech && (
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono pt-1">
                    stack: {proj.tech}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono pl-3 pt-1">
        {options.showEducation && data.education && data.education.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span>&gt;</span>
              <span>{t.education}</span>
            </div>
            <div className="space-y-1 text-xs">
              {data.education.map(edu => (
                <div key={edu.id} className="border-l-2 border-slate-300 dark:border-slate-700 pl-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{edu.degree}</div>
                  <div className="text-slate-500 text-[11px]">{edu.institute} ({formatText(edu.year)})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {options.showCertifications && data.certifications && data.certifications.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span>&gt;</span>
              <span>{t.certifications}</span>
            </div>
            <div className="space-y-1 text-xs">
              {data.certifications.map(c => (
                <div key={c.id} className="border-l-2 border-emerald-500 pl-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{c.name}</div>
                  <div className="text-slate-500 text-[11px]">{c.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* References */}
      {options.showReferences !== false && data.references && data.references.length > 0 && (
        <div className="space-y-2 font-mono pl-3 pt-2">
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span>&gt;</span>
            <span className="uppercase">{t.references || (language === 'bn' ? 'রেফারেন্স' : 'references')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {data.references.map(ref => (
              <div key={ref.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="font-bold text-slate-900 dark:text-slate-100">{ref.name}</div>
                <div className="text-slate-600 dark:text-slate-400 text-[11px]">{ref.designation} — {ref.organization}</div>
                {ref.phone && <div className="text-slate-500 text-[10px]">tel: {formatText(ref.phone)}</div>}
                {ref.email && <div className="text-slate-500 text-[10px]">email: {ref.email}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration & Signature */}
      {options.showDeclaration !== false && data.declaration?.enabled !== false && data.declaration?.text && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 font-mono">
          <div className="text-[11px] text-slate-600 dark:text-slate-400 pl-3 border-l-2 border-emerald-500/30">
            // {data.declaration.text}
          </div>
          <div className="flex justify-between items-end text-[10px] text-slate-500 px-3">
            <div>
              {data.declaration.date && <div>date: {formatText(data.declaration.date)}</div>}
              {data.declaration.place && <div>location: {data.declaration.place}</div>}
            </div>
            {options.showSignature !== false && (
              <div className="text-right">
                <div className="font-serif italic text-xs font-bold text-slate-800 dark:text-slate-200 border-t border-slate-400 dark:border-slate-600 pt-0.5 px-3">
                  {data.personal.signature || data.personal.fullName}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">signed_by</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
