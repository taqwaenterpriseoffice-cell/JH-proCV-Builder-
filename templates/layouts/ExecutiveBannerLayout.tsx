import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig, SectionTitle } from '../primitives';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, ShieldCheck, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';

export const ExecutiveBannerLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'Montserrat',
  language = 'en',
  printOptions,
  accentColor = '#1e3a8a',
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

  const bannerTheme = templateConfig.bannerTheme || 'navy'; // 'navy' | 'charcoal' | 'accent' | 'gold-border'
  const showStatsPill = templateConfig.showStatsPill || false;
  const bodyLayout = templateConfig.bodyLayout || 'two-col'; // 'two-col' | 'linear'

  let bannerBg = 'bg-slate-900 text-white';
  if (bannerTheme === 'navy') bannerBg = 'bg-[#0f172a] text-white';
  else if (bannerTheme === 'charcoal') bannerBg = 'bg-zinc-900 text-white';
  else if (bannerTheme === 'accent') bannerBg = 'text-white';

  return (
    <div 
      id="resume-content"
      style={{ fontFamily: font }}
      className="w-full max-w-[800px] mx-auto bg-white text-slate-900 shadow-sm overflow-hidden"
    >
      {/* Executive Top Banner */}
      <div 
        className={`${bannerBg} p-6 sm:p-8 space-y-3 relative`}
        {...(bannerTheme === 'accent' ? { style: { backgroundColor: accentColor } } : {})}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {options.showPhoto && data.personal.photo && (
            <img 
              src={data.personal.photo} 
              alt={data.personal.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/40 shadow-md flex-shrink-0"
            />
          )}

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              {data.personal.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-blue-300">
              {data.personal.title}
            </p>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px] text-slate-300 pt-2 border-t border-white/10 mt-2">
              {data.personal.phone && <span>{formatText(data.personal.phone)}</span>}
              {data.personal.email && <span>{data.personal.email}</span>}
              {data.personal.address && <span>{data.personal.address}</span>}
              {data.personal.website && <span>{data.personal.website}</span>}
              {options.showSocials && data.socials.linkedin && <span>{data.socials.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className={`${size.padding} space-y-5`}>
        {/* Executive Summary */}
        {options.showSummary && data.personal.summary && (
          <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-slate-900" style={{ borderLeftColor: accentColor }}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
              {t.summary}
            </h3>
            <p className={`${size.body} text-slate-700 leading-relaxed`}>
              {data.personal.summary}
            </p>
          </div>
        )}

        {bodyLayout === 'two-col' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left 8 Cols: Experience & Projects */}
            <div className="md:col-span-8 space-y-5">
              {/* Experience */}
              {options.showExperience && data.experience && data.experience.length > 0 && (
                <div className="space-y-3">
                  <SectionTitle title={t.experience} variant="boxed" accentColor={accentColor} />
                  <div className="space-y-3">
                    {data.experience.map(exp => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {exp.position}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {formatText(exp.duration)}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-blue-800" style={{ color: accentColor }}>
                          {exp.company} {exp.location ? `• ${exp.location}` : ''}
                        </div>
                        <div className={`${size.body} text-slate-700 whitespace-pre-line pt-0.5`}>
                          {exp.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {options.showProjects && data.projects && data.projects.length > 0 && (
                <div className="space-y-3">
                  <SectionTitle title={t.projects} variant="boxed" accentColor={accentColor} />
                  <div className="space-y-2">
                    {data.projects.map(proj => (
                      <div key={proj.id} className="space-y-0.5">
                        <div className="font-bold text-xs sm:text-sm text-slate-900">
                          {proj.title}
                        </div>
                        <p className={`${size.body} text-slate-700`}>{proj.description}</p>
                        {proj.tech && <div className="text-[10px] text-slate-500">Tech: {proj.tech}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Education, Skills, Certifications, Languages */}
            <div className="md:col-span-4 space-y-5">
              {/* Skills */}
              {options.showSkills && data.skills && data.skills.length > 0 && (
                <div className="space-y-2">
                  <SectionTitle title={t.skills} variant="boxed" accentColor={accentColor} />
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {options.showEducation && data.education && data.education.length > 0 && (
                <div className="space-y-2">
                  <SectionTitle title={t.education} variant="boxed" accentColor={accentColor} />
                  <div className="space-y-2 text-xs">
                    {data.education.map(edu => (
                      <div key={edu.id} className="space-y-0.5">
                        <div className="font-bold text-slate-900">{edu.degree}</div>
                        <div className="text-slate-600 text-[11px]">{edu.institute}</div>
                        <div className="text-slate-400 text-[10px]">{formatText(edu.year)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {options.showCertifications && data.certifications && data.certifications.length > 0 && (
                <div className="space-y-2">
                  <SectionTitle title={t.certifications} variant="boxed" accentColor={accentColor} />
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {data.certifications.map(c => (
                      <div key={c.id}>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.issuer} ({formatText(c.date)})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {options.showLanguages && data.languages && data.languages.length > 0 && (
                <div className="space-y-2">
                  <SectionTitle title={t.languages} variant="boxed" accentColor={accentColor} />
                  <div className="space-y-1 text-xs text-slate-700">
                    {data.languages.map(l => (
                      <div key={l.id} className="flex justify-between">
                        <span className="font-medium">{l.name}</span>
                        <span className="text-slate-400 text-[10px]">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Linear Body */
          <div className="space-y-5">
            {/* Experience */}
            {options.showExperience && data.experience && data.experience.length > 0 && (
              <div className="space-y-3">
                <SectionTitle title={t.experience} variant="boxed" accentColor={accentColor} />
                <div className="space-y-3">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {exp.position} <span className="font-normal text-slate-600">| {exp.company}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {formatText(exp.duration)}
                        </span>
                      </div>
                      <div className={`${size.body} text-slate-700 whitespace-pre-line`}>
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Skills in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {options.showEducation && data.education && data.education.length > 0 && (
                <div className="space-y-2">
                  <SectionTitle title={t.education} variant="boxed" accentColor={accentColor} />
                  <div className="space-y-2 text-xs">
                    {data.education.map(edu => (
                      <div key={edu.id} className="space-y-0.5">
                        <div className="font-bold text-slate-900">{edu.degree}</div>
                        <div className="text-slate-600">{edu.institute}</div>
                        <div className="text-slate-400 text-[10px]">{formatText(edu.year)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {options.showSkills && data.skills && data.skills.length > 0 && (
                <div className="space-y-2">
                  <SectionTitle title={t.skills} variant="boxed" accentColor={accentColor} />
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* References */}
            {options.showReferences !== false && data.references && data.references.length > 0 && (
              <div className="space-y-2 pt-2">
                <SectionTitle title={t.references || 'References'} variant="boxed" accentColor={accentColor} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {data.references.map(ref => (
                    <div key={ref.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                      <div className="font-bold text-slate-900">{ref.name}</div>
                      <div className="text-slate-700 font-medium text-[11px]">{ref.designation} — {ref.organization}</div>
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
        )}
      </div>
    </div>
  );
};
