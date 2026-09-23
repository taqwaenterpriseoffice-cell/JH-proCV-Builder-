import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig, SectionTitle } from '../primitives';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, ShieldCheck, GraduationCap, Briefcase, ExternalLink } from 'lucide-react';

export const SidebarLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'Inter',
  language = 'en',
  printOptions,
  accentColor = '#2563eb',
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

  // Configuration
  const sidebarPosition = templateConfig.sidebarPosition || 'left'; // 'left' | 'right'
  const sidebarTheme = templateConfig.sidebarTheme || 'light'; // 'light' | 'dark' | 'accent' | 'stone' | 'nordic'
  const sidebarWidth = templateConfig.sidebarWidth || 'w-[32%]'; // 'w-[30%]' | 'w-[35%]'
  const titleVariant = templateConfig.titleVariant || 'left-bar';
  const photoShape = templateConfig.photoShape || 'rounded-full';

  const isDarkSidebar = sidebarTheme === 'dark';
  const isAccentSidebar = sidebarTheme === 'accent';
  const isStoneSidebar = sidebarTheme === 'stone';

  let sidebarBg = 'bg-slate-50 border-r border-slate-200 text-slate-800';
  if (isDarkSidebar) {
    sidebarBg = 'bg-slate-900 border-r border-slate-800 text-slate-100';
  } else if (isAccentSidebar) {
    sidebarBg = 'text-white border-r border-white/20';
  } else if (isStoneSidebar) {
    sidebarBg = 'bg-[#f4f1ea] border-r border-stone-300 text-stone-900';
  }

  // Sidebar content (Contact, Skills, Education, Languages, Certifications)
  const sidebarContent = (
    <div 
      className={`${sidebarWidth} p-5 sm:p-6 space-y-5 flex-shrink-0 ${sidebarBg}`}
      {...(isAccentSidebar ? { style: { backgroundColor: accentColor } } : {})}
    >
      {/* Profile Photo */}
      {options.showPhoto && data.personal.photo && (
        <div className="flex justify-center pb-2">
          <img 
            src={data.personal.photo} 
            alt={data.personal.fullName}
            className={`w-28 h-28 object-cover border-2 shadow-sm ${photoShape} ${
              isDarkSidebar ? 'border-slate-700' : 'border-white'
            }`}
          />
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-2.5">
        <h3 className={`text-[10px] font-black uppercase tracking-widest ${
          isDarkSidebar ? 'text-slate-400' : isAccentSidebar ? 'text-white/80' : 'text-slate-400'
        }`}>
          {t.contact}
        </h3>
        <div className="space-y-2 text-xs">
          {data.personal.phone && (
            <div className="flex items-center gap-2">
              <Phone size={13} className={isDarkSidebar ? 'text-blue-400' : isAccentSidebar ? 'text-white' : 'text-blue-600'} />
              <span>{formatText(data.personal.phone)}</span>
            </div>
          )}
          {data.personal.email && (
            <div className="flex items-center gap-2 truncate">
              <Mail size={13} className={isDarkSidebar ? 'text-blue-400' : isAccentSidebar ? 'text-white' : 'text-blue-600'} />
              <span className="truncate">{data.personal.email}</span>
            </div>
          )}
          {data.personal.address && (
            <div className="flex items-center gap-2">
              <MapPin size={13} className={isDarkSidebar ? 'text-blue-400' : isAccentSidebar ? 'text-white' : 'text-blue-600'} />
              <span>{data.personal.address}</span>
            </div>
          )}
          {data.personal.website && (
            <div className="flex items-center gap-2 truncate">
              <Globe size={13} className={isDarkSidebar ? 'text-blue-400' : isAccentSidebar ? 'text-white' : 'text-blue-600'} />
              <span className="truncate">{data.personal.website}</span>
            </div>
          )}
          {options.showSocials && data.socials.linkedin && (
            <div className="flex items-center gap-2 truncate">
              <Linkedin size={13} className={isDarkSidebar ? 'text-blue-400' : isAccentSidebar ? 'text-white' : 'text-blue-600'} />
              <span className="truncate">{data.socials.linkedin}</span>
            </div>
          )}
          {options.showSocials && data.socials.github && (
            <div className="flex items-center gap-2 truncate">
              <Github size={13} className={isDarkSidebar ? 'text-blue-400' : isAccentSidebar ? 'text-white' : 'text-blue-600'} />
              <span className="truncate">{data.socials.github}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills in Sidebar */}
      {options.showSkills && data.skills && data.skills.length > 0 && (
        <div className="space-y-2">
          <h3 className={`text-[10px] font-black uppercase tracking-widest ${
            isDarkSidebar ? 'text-slate-400' : isAccentSidebar ? 'text-white/80' : 'text-slate-400'
          }`}>
            {t.skills}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, idx) => (
              <span 
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  isDarkSidebar 
                    ? 'bg-slate-800 text-slate-200 border border-slate-700' 
                    : isAccentSidebar 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education in Sidebar */}
      {options.showEducation && data.education && data.education.length > 0 && (
        <div className="space-y-2">
          <h3 className={`text-[10px] font-black uppercase tracking-widest ${
            isDarkSidebar ? 'text-slate-400' : isAccentSidebar ? 'text-white/80' : 'text-slate-400'
          }`}>
            {t.education}
          </h3>
          <div className="space-y-2">
            {data.education.map(edu => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="font-bold">{edu.degree}</div>
                <div className={isDarkSidebar ? 'text-slate-400 text-[11px]' : isAccentSidebar ? 'text-white/90 text-[11px]' : 'text-slate-600 text-[11px]'}>
                  {edu.institute}
                </div>
                <div className={isDarkSidebar ? 'text-slate-500 text-[10px]' : isAccentSidebar ? 'text-white/75 text-[10px]' : 'text-slate-400 text-[10px]'}>
                  {formatText(edu.year)} {edu.result ? `• ${formatText(edu.result)}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages in Sidebar */}
      {options.showLanguages && data.languages && data.languages.length > 0 && (
        <div className="space-y-2">
          <h3 className={`text-[10px] font-black uppercase tracking-widest ${
            isDarkSidebar ? 'text-slate-400' : isAccentSidebar ? 'text-white/80' : 'text-slate-400'
          }`}>
            {t.languages}
          </h3>
          <div className="space-y-1 text-xs">
            {data.languages.map(l => (
              <div key={l.id} className="flex justify-between items-baseline">
                <span className="font-medium">{l.name}</span>
                <span className={`text-[10px] ${isDarkSidebar ? 'text-slate-400' : isAccentSidebar ? 'text-white/80' : 'text-slate-500'}`}>
                  {l.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Main Content (Name/Header, Summary, Experience, Projects, Awards)
  const mainContent = (
    <div className="flex-1 p-6 sm:p-7 space-y-5 bg-white text-slate-900">
      {/* Name and Title Header */}
      <div className="space-y-1 pb-3 border-b border-slate-200">
        <h1 className={`${size.name} tracking-tight text-slate-900`}>
          {data.personal.fullName || 'Candidate Name'}
        </h1>
        <p 
          style={{ color: accentColor }}
          className={`${size.title} font-bold tracking-wide`}
        >
          {data.personal.title}
        </p>
      </div>

      {/* Summary */}
      {options.showSummary && data.personal.summary && (
        <div className="space-y-1.5">
          <SectionTitle title={t.summary} variant={titleVariant} accentColor={accentColor} />
          <p className={`${size.body} text-slate-700 leading-relaxed`}>
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {options.showExperience && data.experience && data.experience.length > 0 && (
        <div className="space-y-3">
          <SectionTitle title={t.experience} variant={titleVariant} accentColor={accentColor} />
          <div className="space-y-3">
            {data.experience.map(exp => (
              <div key={exp.id} className="space-y-1 border-l-2 pl-3" style={{ borderLeftColor: `${accentColor}40` }}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    {exp.position} <span className="font-semibold text-slate-600">@ {exp.company}</span>
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

      {/* Featured Projects */}
      {options.showProjects && data.projects && data.projects.length > 0 && (
        <div className="space-y-3">
          <SectionTitle title={t.projects} variant={titleVariant} accentColor={accentColor} />
          <div className="space-y-2.5">
            {data.projects.map(proj => (
              <div key={proj.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 flex items-center gap-0.5">
                      <ExternalLink size={10} />
                      <span>Link</span>
                    </a>
                  )}
                </div>
                <p className={`${size.body} text-slate-700`}>{proj.description}</p>
                {proj.tech && (
                  <div className="text-[10px] font-mono text-slate-500 pt-0.5">
                    Stack: {proj.tech}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Awards */}
      {((options.showCertifications && data.certifications && data.certifications.length > 0) ||
        (options.showAwards && data.awards && data.awards.length > 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {options.showCertifications && data.certifications && data.certifications.length > 0 && (
            <div className="space-y-1.5">
              <SectionTitle title={t.certifications} variant={titleVariant} accentColor={accentColor} />
              <div className="space-y-1 text-xs text-slate-700">
                {data.certifications.map(c => (
                  <div key={c.id}>
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.issuer} • {formatText(c.date)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.showAwards && data.awards && data.awards.length > 0 && (
            <div className="space-y-1.5">
              <SectionTitle title={t.awards} variant={titleVariant} accentColor={accentColor} />
              <div className="space-y-1 text-xs text-slate-700">
                {data.awards.map(a => (
                  <div key={a.id}>
                    <div className="font-bold text-slate-900">{a.title}</div>
                    <div className="text-[11px] text-slate-500">{a.issuer} ({formatText(a.year)})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* References */}
      {options.showReferences !== false && data.references && data.references.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <SectionTitle title={t.references || 'References'} variant={titleVariant} accentColor={accentColor} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {data.references.map(ref => (
              <div key={ref.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-[11px] text-slate-700">{ref.designation} — {ref.organization}</div>
                {ref.phone && <div className="text-[11px] text-slate-500">Phone: {formatText(ref.phone)}</div>}
                {ref.email && <div className="text-[11px] text-slate-500">Email: {ref.email}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration & Signature */}
      {options.showDeclaration !== false && data.declaration?.enabled !== false && data.declaration?.text && (
        <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
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

  return (
    <div 
      id="resume-content"
      style={{ fontFamily: font }}
      className="w-full max-w-[800px] mx-auto bg-white shadow-sm flex flex-col sm:flex-row overflow-hidden"
    >
      {sidebarPosition === 'left' ? (
        <>
          {sidebarContent}
          {mainContent}
        </>
      ) : (
        <>
          {mainContent}
          {sidebarContent}
        </>
      )}
    </div>
  );
};
