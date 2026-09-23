import React from 'react';
import { 
  Mail, Phone, MapPin, Linkedin, Github, Globe, GraduationCap, 
  Briefcase, Code, FolderGit2, Facebook, Twitter, Award, 
  ShieldCheck, Languages as LangIcon
} from 'lucide-react';
import { ResumeData, ThemeType, Language, PrintOptions, FontSize } from '../types';
import { EngineTemplateRenderer } from '../templates';

interface Props {
  data: ResumeData;
  theme: ThemeType;
  font?: string;
  language?: Language;
  printOptions?: PrintOptions;
  accentColor?: string;
  fontSize?: FontSize;
}

const TRANSLATIONS = {
  en: {
    summary: "Executive Summary",
    experience: "Work Experience",
    projects: "Featured Projects",
    skills: "Skills & Proficiencies",
    education: "Education",
    certifications: "Certifications",
    languages: "Languages",
    awards: "Honors & Awards",
    references: "References",
    declaration: "Declaration",
    contact: "Contact & Links",
    phone: "Phone",
    email: "Email",
    address: "Location",
    website: "Website"
  },
  bn: {
    summary: "পেশাগত সারসংক্ষেপ",
    experience: "কাজের অভিজ্ঞতা",
    projects: "উল্লেখযোগ্য প্রজেক্টসমূহ",
    skills: "দক্ষতা ও পারদর্শিতা",
    education: "শিক্ষাগত যোগ্যতা",
    certifications: "সার্টিফিকেশন ও লাইসেন্স",
    languages: "ভাষাগত দক্ষতা",
    awards: "সম্মাননা ও পুরস্কার",
    references: "রেফারেন্স",
    declaration: "ঘোষণাপত্র",
    contact: "যোগাযোগ ও লিঙ্ক",
    phone: "ফোন",
    email: "ইমেইল",
    address: "ঠিকানা",
    website: "ওয়েবসাইট"
  }
};

const convertToBengaliDigits = (str: string) => {
  const digits: Record<string, string> = { 
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', 
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' 
  };
  return str.replace(/[0-9]/g, (w) => digits[w] || w);
};

const ResumePreviewComponent: React.FC<Props> = ({ 
  data, 
  theme = 'modern', 
  font = 'Inter', 
  language = 'en', 
  printOptions,
  accentColor = '#2563eb',
  fontSize = 'normal'
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

  // Font Size Density Classes
  const sizeConfig = {
    compact: {
      name: 'text-2xl',
      title: 'text-xs',
      heading: 'text-xs',
      body: 'text-[11px] leading-relaxed',
      small: 'text-[10px]',
      padding: 'p-6',
      gap: 'space-y-3'
    },
    normal: {
      name: 'text-3xl',
      title: 'text-sm',
      heading: 'text-sm',
      body: 'text-xs leading-relaxed',
      small: 'text-[11px]',
      padding: 'p-8',
      gap: 'space-y-4'
    },
    spacious: {
      name: 'text-4xl',
      title: 'text-base',
      heading: 'text-base',
      body: 'text-sm leading-relaxed',
      small: 'text-xs',
      padding: 'p-10',
      gap: 'space-y-6'
    }
  }[fontSize || 'normal'];

  const fontStyle = {
    fontFamily: font.includes("'") ? font : `'${font}', sans-serif`
  };

  // Modular Scalable Template Engine Delegation (58+ Extended Templates)
  const STANDARD_THEMES = [
    'ats', 'modern', 'nordic', 'compact', 'tech', 'minimal', 
    'corporate', 'executive', 'classic', 'creative', 'simple', 'dark'
  ];

  if (!STANDARD_THEMES.includes(theme)) {
    return (
      <EngineTemplateRenderer
        theme={theme}
        data={data}
        font={font}
        language={language}
        printOptions={options}
        accentColor={accentColor}
        fontSize={fontSize}
      />
    );
  }

  // ==========================================
  // TEMPLATE 1: ATS PROFESSIONAL (Linear Strict)
  // ==========================================
  if (theme === 'ats') {
    return (
      <div 
        id="resume-content"
        style={fontStyle}
        className={`w-full max-w-[800px] mx-auto bg-white text-slate-900 ${sizeConfig.padding} space-y-4 shadow-sm`}
      >
        {/* Header */}
        <div className="text-center border-b pb-4 space-y-1">
          <h1 className={`${sizeConfig.name} font-bold tracking-tight text-slate-900 uppercase`}>
            {data.personal.fullName || 'Candidate Name'}
          </h1>
          <p className={`${sizeConfig.title} font-medium text-slate-700 tracking-wide`}>
            {data.personal.title}
          </p>
          <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 ${sizeConfig.small} text-slate-600 pt-1`}>
            {data.personal.phone && <span>{formatText(data.personal.phone)}</span>}
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.address && <span>{data.personal.address}</span>}
            {options.showSocials && data.socials.linkedin && <span>{data.socials.linkedin}</span>}
            {options.showSocials && data.socials.github && <span>{data.socials.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {options.showSummary && data.personal.summary && (
          <div className="space-y-1">
            <h2 className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 text-slate-900`}>
              {t.summary}
            </h2>
            <p className={`${sizeConfig.body} text-slate-800 pt-1`}>
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {options.showExperience && data.experience && data.experience.length > 0 && (
          <div className="space-y-3">
            <h2 className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 text-slate-900`}>
              {t.experience}
            </h2>
            <div className="space-y-2.5">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                    <span className={`${sizeConfig.small} text-slate-600`}>{formatText(exp.duration)}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-700 italic">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  <div className={`${sizeConfig.body} text-slate-800 whitespace-pre-line pl-2`}>
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {options.showEducation && data.education && data.education.length > 0 && (
          <div className="space-y-2">
            <h2 className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 text-slate-900`}>
              {t.education}
            </h2>
            <div className="space-y-1.5">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-slate-700">, {edu.institute}</span>
                    {edu.result && <span className="text-slate-600"> — {edu.result}</span>}
                  </div>
                  <span className={`${sizeConfig.small} text-slate-600`}>{formatText(edu.year)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {options.showProjects && data.projects && data.projects.length > 0 && (
          <div className="space-y-2">
            <h2 className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 text-slate-900`}>
              {t.projects}
            </h2>
            <div className="space-y-2">
              {data.projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    {proj.link && <span className={`${sizeConfig.small} text-slate-500`}>{proj.link}</span>}
                  </div>
                  <div className={`${sizeConfig.small} text-slate-600 italic`}>Technologies: {proj.tech}</div>
                  <p className={`${sizeConfig.body} text-slate-800`}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {options.showSkills && data.skills && data.skills.length > 0 && (
          <div className="space-y-1">
            <h2 className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 text-slate-900`}>
              {t.skills}
            </h2>
            <p className={`${sizeConfig.body} text-slate-800 pt-1`}>
              {data.skills.join(' • ')}
            </p>
          </div>
        )}

        {/* Certifications & Languages Grid */}
        <div className="grid grid-cols-2 gap-4">
          {options.showCertifications && data.certifications && data.certifications.length > 0 && (
            <div className="space-y-1">
              <h2 className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 text-slate-900`}>
                {t.certifications}
              </h2>
              <ul className={`${sizeConfig.body} text-slate-800 space-y-0.5 pt-1 list-disc pl-4`}>
                {data.certifications.map(c => (
                  <li key={c.id}>{c.name} ({c.issuer}, {formatText(c.date)})</li>
                ))}
              </ul>
            </div>
          )}

          {options.showLanguages && data.languages && data.languages.length > 0 && (
            <div className="space-y-1">
              <h2 className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 text-slate-900`}>
                {t.languages}
              </h2>
              <p className={`${sizeConfig.body} text-slate-800 pt-1`}>
                {data.languages.map(l => `${l.name} (${l.level})`).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 2: MODERN EXECUTIVE (2-Column Split)
  // ==========================================
  if (theme === 'modern') {
    return (
      <div 
        id="resume-content"
        style={fontStyle}
        className="w-full max-w-[800px] mx-auto bg-white text-slate-900 flex flex-col sm:flex-row shadow-sm min-h-[1100px]"
      >
        {/* Left Column (Sidebar) */}
        <div className="w-full sm:w-[280px] bg-slate-50 border-r border-slate-200 p-6 space-y-6 flex-shrink-0">
          {/* Photo */}
          {options.showPhoto && data.personal.photo && (
            <div className="flex justify-center">
              <img 
                src={data.personal.photo} 
                alt={data.personal.fullName}
                className="w-28 h-28 rounded-2xl object-cover shadow-md border-2 border-white ring-1 ring-slate-200" 
              />
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-2.5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
              style={{ color: accentColor, borderColor: `${accentColor}30` }}
            >
              {t.contact}
            </h3>
            <div className="space-y-2 text-[11px] text-slate-600">
              {data.personal.email && (
                <div className="flex items-center gap-2">
                  <Mail size={13} style={{ color: accentColor }} className="flex-shrink-0" />
                  <span className="truncate">{data.personal.email}</span>
                </div>
              )}
              {data.personal.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} style={{ color: accentColor }} className="flex-shrink-0" />
                  <span>{formatText(data.personal.phone)}</span>
                </div>
              )}
              {data.personal.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={13} style={{ color: accentColor }} className="flex-shrink-0" />
                  <span>{data.personal.address}</span>
                </div>
              )}
              {data.personal.website && (
                <div className="flex items-center gap-2">
                  <Globe size={13} style={{ color: accentColor }} className="flex-shrink-0" />
                  <span className="truncate">{data.personal.website}</span>
                </div>
              )}
              {options.showSocials && data.socials.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin size={13} style={{ color: accentColor }} className="flex-shrink-0" />
                  <span className="truncate">{data.socials.linkedin}</span>
                </div>
              )}
              {options.showSocials && data.socials.github && (
                <div className="flex items-center gap-2">
                  <Github size={13} style={{ color: accentColor }} className="flex-shrink-0" />
                  <span className="truncate">{data.socials.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {options.showSkills && data.skills && data.skills.length > 0 && (
            <div className="space-y-2.5">
              <h3 
                className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                {t.skills}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {options.showEducation && data.education && data.education.length > 0 && (
            <div className="space-y-2.5">
              <h3 
                className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                {t.education}
              </h3>
              <div className="space-y-2 text-xs">
                {data.education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="font-bold text-slate-800 text-[11px]">{edu.degree}</div>
                    <div className="text-slate-600 text-[10px]">{edu.institute}</div>
                    <div className="text-slate-400 text-[10px]">{formatText(edu.year)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {options.showLanguages && data.languages && data.languages.length > 0 && (
            <div className="space-y-2.5">
              <h3 
                className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                {t.languages}
              </h3>
              <div className="space-y-1 text-xs">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-[11px]">
                    <span className="font-medium text-slate-700">{l.name}</span>
                    <span className="text-slate-400 text-[10px]">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Main Content) */}
        <div className={`flex-1 ${sizeConfig.padding} space-y-6`}>
          {/* Header Title */}
          <div className="space-y-1">
            <h1 className={`${sizeConfig.name} font-black tracking-tight text-slate-900`}>
              {data.personal.fullName || 'Your Name'}
            </h1>
            <p 
              className={`${sizeConfig.title} font-bold uppercase tracking-wide`}
              style={{ color: accentColor }}
            >
              {data.personal.title}
            </p>
          </div>

          {/* Summary */}
          {options.showSummary && data.personal.summary && (
            <div className="space-y-1.5">
              <h2 className={`${sizeConfig.heading} font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                <span>{t.summary}</span>
              </h2>
              <p className={`${sizeConfig.body} text-slate-700`}>
                {data.personal.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {options.showExperience && data.experience && data.experience.length > 0 && (
            <div className="space-y-3">
              <h2 className={`${sizeConfig.heading} font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                <span>{t.experience}</span>
              </h2>
              <div className="space-y-3.5">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                      <span className={`${sizeConfig.small} font-semibold text-slate-500`}>
                        {formatText(exp.duration)}
                      </span>
                    </div>
                    <div className="text-xs font-semibold" style={{ color: accentColor }}>
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    <div className={`${sizeConfig.body} text-slate-700 whitespace-pre-line`}>
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
              <h2 className={`${sizeConfig.heading} font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                <span>{t.projects}</span>
              </h2>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-slate-900">{proj.title}</span>
                      {proj.link && (
                        <span className={`${sizeConfig.small} text-slate-400 truncate max-w-[200px]`}>
                          {proj.link}
                        </span>
                      )}
                    </div>
                    <div className={`${sizeConfig.small} font-mono text-slate-500`}>
                      Stack: {proj.tech}
                    </div>
                    <p className={`${sizeConfig.body} text-slate-700`}>{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Awards */}
          {(options.showCertifications || options.showAwards) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {options.showCertifications && data.certifications && data.certifications.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {t.certifications}
                  </h3>
                  <div className="space-y-1">
                    {data.certifications.map(c => (
                      <div key={c.id} className="text-xs">
                        <div className="font-bold text-slate-800 text-[11px]">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.issuer} • {formatText(c.date)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {options.showAwards && data.awards && data.awards.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {t.awards}
                  </h3>
                  <div className="space-y-1">
                    {data.awards.map(a => (
                      <div key={a.id} className="text-xs">
                        <div className="font-bold text-slate-800 text-[11px]">{a.title}</div>
                        <div className="text-[10px] text-slate-500">{a.issuer} • {formatText(a.year)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 3: SWISS MINIMAL / MINIMALIST
  // ==========================================
  if (theme === 'minimal') {
    return (
      <div 
        id="resume-content"
        style={fontStyle}
        className={`w-full max-w-[800px] mx-auto bg-stone-50 text-stone-900 ${sizeConfig.padding} space-y-6 shadow-sm`}
      >
        <div className="border-b border-stone-300 pb-6 space-y-2">
          <h1 className={`${sizeConfig.name} font-light tracking-tight text-stone-950`}>
            {data.personal.fullName || 'Candidate Name'}
          </h1>
          <p className={`${sizeConfig.title} font-mono text-stone-600 tracking-wider uppercase`}>
            {data.personal.title}
          </p>
          <div className={`flex flex-wrap gap-4 ${sizeConfig.small} text-stone-500 pt-1`}>
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{formatText(data.personal.phone)}</span>}
            {data.personal.address && <span>{data.personal.address}</span>}
            {data.socials.portfolio && <span>{data.socials.portfolio}</span>}
          </div>
        </div>

        {options.showSummary && data.personal.summary && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <span className="font-mono text-xs uppercase text-stone-500 sm:text-right">{t.summary}</span>
            <p className={`sm:col-span-3 ${sizeConfig.body} text-stone-800`}>{data.personal.summary}</p>
          </div>
        )}

        {options.showExperience && data.experience && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <span className="font-mono text-xs uppercase text-stone-500 sm:text-right">{t.experience}</span>
            <div className="sm:col-span-3 space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-stone-900">{exp.position} — {exp.company}</span>
                    <span className="text-[10px] font-mono text-stone-500">{formatText(exp.duration)}</span>
                  </div>
                  <div className={`${sizeConfig.body} text-stone-700 whitespace-pre-line`}>{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {options.showSkills && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <span className="font-mono text-xs uppercase text-stone-500 sm:text-right">{t.skills}</span>
            <div className="sm:col-span-3 flex flex-wrap gap-1.5">
              {data.skills.map(s => (
                <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-stone-200/70 text-stone-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {options.showEducation && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <span className="font-mono text-xs uppercase text-stone-500 sm:text-right">{t.education}</span>
            <div className="sm:col-span-3 space-y-2">
              {data.education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <span><strong className="text-stone-900">{edu.degree}</strong>, {edu.institute}</span>
                  <span className="text-[10px] font-mono text-stone-500">{formatText(edu.year)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // TEMPLATE: NORDIC MINIMALIST
  // ==========================================
  if (theme === 'nordic') {
    return (
      <div 
        id="resume-content"
        style={fontStyle}
        className={`w-full max-w-[800px] mx-auto bg-[#faf8f5] text-[#2c2c2a] ${sizeConfig.padding} space-y-6 shadow-sm border border-stone-200/60`}
      >
        {/* Nordic Header */}
        <div className="border-b border-stone-300/80 pb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className={`${sizeConfig.name} font-light tracking-wide text-stone-900`}>
                {data.personal.fullName || 'Candidate Name'}
              </h1>
              <p className={`${sizeConfig.title} font-medium tracking-widest uppercase text-stone-600`} style={{ color: accentColor }}>
                {data.personal.title}
              </p>
            </div>
            {options.showPhoto && data.personal.photo && (
              <img 
                src={data.personal.photo} 
                alt={data.personal.fullName}
                className="w-20 h-20 rounded-xl object-cover grayscale contrast-125 border border-stone-300 shadow-sm"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-500 pt-1">
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{formatText(data.personal.phone)}</span>}
            {data.personal.address && <span>{data.personal.address}</span>}
            {options.showSocials && data.socials.linkedin && <span>{data.socials.linkedin}</span>}
            {options.showSocials && data.socials.github && <span>{data.socials.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {options.showSummary && data.personal.summary && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className={`${sizeConfig.heading} font-medium uppercase tracking-widest text-stone-700 text-xs`}>
                {t.summary}
              </h2>
              <div className="h-px bg-stone-300 flex-1"></div>
            </div>
            <p className={`${sizeConfig.body} text-stone-700 leading-relaxed`}>
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {options.showExperience && data.experience && data.experience.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className={`${sizeConfig.heading} font-medium uppercase tracking-widest text-stone-700 text-xs`}>
                {t.experience}
              </h2>
              <div className="h-px bg-stone-300 flex-1"></div>
            </div>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-xs text-stone-900">{exp.position} — <span className="font-normal text-stone-600">{exp.company}</span></span>
                    <span className="text-[11px] text-stone-400 font-mono">{formatText(exp.duration)}</span>
                  </div>
                  <div className={`${sizeConfig.body} text-stone-600 whitespace-pre-line pl-2 border-l border-stone-200`}>
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
            <div className="flex items-center gap-3">
              <h2 className={`${sizeConfig.heading} font-medium uppercase tracking-widest text-stone-700 text-xs`}>
                {t.projects}
              </h2>
              <div className="h-px bg-stone-300 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.projects.map(proj => (
                <div key={proj.id} className="p-3 rounded-xl bg-stone-100/70 border border-stone-200/60 space-y-1">
                  <div className="font-semibold text-xs text-stone-900">{proj.title}</div>
                  <div className="text-[10px] text-stone-500 font-mono">{proj.tech}</div>
                  <p className="text-[11px] text-stone-600">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Skills Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {options.showEducation && data.education && data.education.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="font-medium uppercase tracking-widest text-stone-700 text-xs">
                  {t.education}
                </h2>
                <div className="h-px bg-stone-300 flex-1"></div>
              </div>
              <div className="space-y-2">
                {data.education.map(edu => (
                  <div key={edu.id} className="text-xs space-y-0.5">
                    <div className="font-semibold text-stone-900">{edu.degree}</div>
                    <div className="text-stone-600">{edu.institute}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{formatText(edu.year)} {edu.result ? `• ${edu.result}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.showSkills && data.skills && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="font-medium uppercase tracking-widest text-stone-700 text-xs">
                  {t.skills}
                </h2>
                <div className="h-px bg-stone-300 flex-1"></div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map(s => (
                  <span key={s} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-200/80 text-stone-700 border border-stone-300/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications & Languages */}
        {(options.showCertifications || options.showLanguages) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-stone-200/60">
            {options.showCertifications && data.certifications && data.certifications.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase text-stone-700">{t.certifications}</h3>
                <div className="space-y-1 text-xs">
                  {data.certifications.map(c => (
                    <div key={c.id}>
                      <div className="font-medium text-stone-900">{c.name}</div>
                      <div className="text-[10px] text-stone-500">{c.issuer} • {formatText(c.date)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {options.showLanguages && data.languages && data.languages.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase text-stone-700">{t.languages}</h3>
                <div className="flex flex-wrap gap-2 text-xs text-stone-700">
                  {data.languages.map(l => (
                    <span key={l.id} className="bg-stone-200/60 px-2 py-0.5 rounded text-[11px]">
                      {l.name} ({l.level})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // TEMPLATE: HIGH-DENSITY COMPACT (One-Page Pro)
  // ==========================================
  if (theme === 'compact') {
    return (
      <div 
        id="resume-content"
        style={fontStyle}
        className="w-full max-w-[800px] mx-auto bg-white text-slate-900 flex flex-col sm:flex-row shadow-sm min-h-[1050px] text-xs border border-slate-200"
      >
        {/* Left Column (35% density sidebar) */}
        <div className="w-full sm:w-[270px] bg-slate-50/90 border-r border-slate-200 p-5 space-y-4 flex-shrink-0">
          {/* Header Info */}
          <div className="space-y-1.5 border-b border-slate-200 pb-3">
            {options.showPhoto && data.personal.photo && (
              <img 
                src={data.personal.photo} 
                alt={data.personal.fullName}
                className="w-20 h-20 rounded-xl object-cover border border-slate-300 mx-auto mb-2 shadow-sm"
              />
            )}
            <h1 className="text-xl font-black text-slate-900 text-center sm:text-left leading-tight">
              {data.personal.fullName || 'Candidate'}
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-center sm:text-left" style={{ color: accentColor }}>
              {data.personal.title}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-1.5 text-[11px] text-slate-600 border-b border-slate-200 pb-3">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{t.contact}</div>
            {data.personal.email && <div className="truncate">{data.personal.email}</div>}
            {data.personal.phone && <div>{formatText(data.personal.phone)}</div>}
            {data.personal.address && <div>{data.personal.address}</div>}
            {options.showSocials && data.socials.linkedin && <div className="truncate">{data.socials.linkedin}</div>}
            {options.showSocials && data.socials.github && <div className="truncate">{data.socials.github}</div>}
            {options.showSocials && data.socials.portfolio && <div className="truncate">{data.socials.portfolio}</div>}
          </div>

          {/* Core Skills */}
          {options.showSkills && data.skills && (
            <div className="space-y-1.5 border-b border-slate-200 pb-3">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{t.skills}</div>
              <div className="flex flex-wrap gap-1">
                {data.skills.map(s => (
                  <span key={s} className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {options.showEducation && data.education && data.education.length > 0 && (
            <div className="space-y-2 border-b border-slate-200 pb-3">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{t.education}</div>
              <div className="space-y-1.5">
                {data.education.map(edu => (
                  <div key={edu.id} className="text-[11px]">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.institute}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{formatText(edu.year)} {edu.result ? `• ${edu.result}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Languages */}
          {options.showCertifications && data.certifications && data.certifications.length > 0 && (
            <div className="space-y-1 text-[11px]">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{t.certifications}</div>
              {data.certifications.map(c => (
                <div key={c.id}>
                  <div className="font-medium text-slate-900 text-[10px]">{c.name}</div>
                  <div className="text-[9px] text-slate-500">{c.issuer}</div>
                </div>
              ))}
            </div>
          )}

          {options.showLanguages && data.languages && data.languages.length > 0 && (
            <div className="space-y-1 text-[11px] pt-1">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{t.languages}</div>
              <div className="space-y-0.5 text-[10px] text-slate-600">
                {data.languages.map(l => (
                  <div key={l.id}>{l.name}: <span className="text-slate-400">{l.level}</span></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (65% Main Content) */}
        <div className="flex-1 p-5 space-y-4">
          {/* Executive Summary */}
          {options.showSummary && data.personal.summary && (
            <div className="space-y-1">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-900 pb-0.5 border-b-2" style={{ borderColor: accentColor }}>
                {t.summary}
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                {data.personal.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {options.showExperience && data.experience && data.experience.length > 0 && (
            <div className="space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-900 pb-0.5 border-b-2" style={{ borderColor: accentColor }}>
                {t.experience}
              </div>
              <div className="space-y-3">
                {data.experience.map(exp => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{formatText(exp.duration)}</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 italic">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </div>
                    <div className="text-[11px] text-slate-700 whitespace-pre-line pl-1.5 border-l border-slate-200">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {options.showProjects && data.projects && data.projects.length > 0 && (
            <div className="space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-900 pb-0.5 border-b-2" style={{ borderColor: accentColor }}>
                {t.projects}
              </div>
              <div className="space-y-2">
                {data.projects.map(proj => (
                  <div key={proj.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-[11px]">{proj.title}</span>
                      {proj.link && <span className="text-[9px] text-slate-400 font-mono truncate max-w-[150px]">{proj.link}</span>}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">Tech: {proj.tech}</div>
                    <p className="text-[10.5px] text-slate-600 leading-snug">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {options.showAwards && data.awards && data.awards.length > 0 && (
            <div className="space-y-1">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-900 pb-0.5 border-b-2" style={{ borderColor: accentColor }}>
                {t.awards}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                {data.awards.map(a => (
                  <div key={a.id}>
                    <div className="font-bold text-slate-900">{a.title}</div>
                    <div className="text-[10px] text-slate-500">{a.issuer} ({formatText(a.year)})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 4: TECH / DEVELOPER
  // ==========================================
  if (theme === 'tech') {
    return (
      <div 
        id="resume-content"
        style={fontStyle}
        className={`w-full max-w-[800px] mx-auto bg-slate-900 text-slate-100 ${sizeConfig.padding} space-y-5 shadow-lg`}
      >
        {/* Terminal Header */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="font-mono text-xs text-slate-400 pl-2">dev@jhsoft-cv: ~/profile</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-2xl font-mono font-bold text-emerald-400">
                {'>'} {data.personal.fullName || 'root'}
              </h1>
              <p className="text-xs font-mono text-slate-400">
                Role: <span className="text-blue-400">{data.personal.title}</span>
              </p>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-400 space-y-0.5">
              <div>{data.personal.email}</div>
              <div>{formatText(data.personal.phone)}</div>
              <div>{data.socials.github}</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {options.showSummary && data.personal.summary && (
          <div className="space-y-1">
            <div className="font-mono text-xs text-emerald-400 font-bold">$ cat summary.txt</div>
            <p className={`${sizeConfig.body} text-slate-300 font-sans pl-3 border-l-2 border-emerald-500`}>
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* Tech Skills */}
        {options.showSkills && (
          <div className="space-y-1.5">
            <div className="font-mono text-xs text-emerald-400 font-bold">$ npm list --skills</div>
            <div className="flex flex-wrap gap-1.5 pl-3">
              {data.skills.map(s => (
                <span key={s} className="px-2 py-0.5 rounded font-mono text-xs bg-slate-800 text-emerald-300 border border-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {options.showExperience && (
          <div className="space-y-2">
            <div className="font-mono text-xs text-emerald-400 font-bold">$ git log --experience</div>
            <div className="space-y-3 pl-3">
              {data.experience.map(exp => (
                <div key={exp.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="font-bold text-blue-400">{exp.position}</span>
                    <span className="text-slate-500">{formatText(exp.duration)}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-300">@ {exp.company}</div>
                  <div className="text-xs text-slate-400 whitespace-pre-line font-sans">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {options.showProjects && (
          <div className="space-y-2">
            <div className="font-mono text-xs text-emerald-400 font-bold">$ ls -la ~/projects</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-3">
              {data.projects.map(proj => (
                <div key={proj.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-xs text-emerald-300">{proj.title}</div>
                  <div className="text-[10px] font-mono text-slate-500">[{proj.tech}]</div>
                  <p className="text-[11px] text-slate-400">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 5: CORPORATE / EXECUTIVE / CLASSIC / DARK / CREATIVE / SIMPLE (Fallback/Dynamic Archetypes)
  // ==========================================
  const isDarkCanvas = theme === 'dark';
  const isClassic = theme === 'classic';
  const isCreative = theme === 'creative';
  const isExecutive = theme === 'executive';

  return (
    <div 
      id="resume-content"
      style={fontStyle}
      className={`w-full max-w-[800px] mx-auto shadow-sm ${
        isDarkCanvas ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
      } ${sizeConfig.padding} space-y-5`}
    >
      {/* Header Banner */}
      <div className={`space-y-2 ${isClassic ? 'text-center' : ''} ${
        isExecutive 
          ? 'p-6 rounded-2xl bg-indigo-950 text-white shadow-md' 
          : 'border-b pb-4'
      }`} style={!isExecutive ? { borderColor: `${accentColor}30` } : {}}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className={`${sizeConfig.name} font-black tracking-tight ${isDarkCanvas ? 'text-white' : 'text-slate-900'}`}>
              {data.personal.fullName || 'Candidate Name'}
            </h1>
            <p 
              className={`${sizeConfig.title} font-bold uppercase tracking-wider`}
              style={{ color: isExecutive ? '#93c5fd' : accentColor }}
            >
              {data.personal.title}
            </p>
          </div>

          {options.showPhoto && data.personal.photo && (
            <img 
              src={data.personal.photo} 
              alt={data.personal.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
            />
          )}
        </div>

        {/* Contact Info Row */}
        <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs pt-2 ${
          isExecutive ? 'text-indigo-200' : 'text-slate-500'
        } ${isClassic ? 'justify-center' : ''}`}>
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{formatText(data.personal.phone)}</span>}
          {data.personal.address && <span>{data.personal.address}</span>}
          {options.showSocials && data.socials.linkedin && <span>{data.socials.linkedin}</span>}
          {options.showSocials && data.socials.github && <span>{data.socials.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {options.showSummary && data.personal.summary && (
        <div className="space-y-1">
          <h2 
            className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b pb-1`}
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            {t.summary}
          </h2>
          <p className={`${sizeConfig.body} ${isDarkCanvas ? 'text-slate-300' : 'text-slate-700'} pt-1`}>
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {options.showExperience && data.experience && data.experience.length > 0 && (
        <div className="space-y-3">
          <h2 
            className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b pb-1`}
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            {t.experience}
          </h2>
          <div className="space-y-3">
            {data.experience.map(exp => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className={`font-bold text-xs ${isDarkCanvas ? 'text-white' : 'text-slate-900'}`}>{exp.position}</span>
                  <span className="text-[11px] text-slate-400 font-semibold">{formatText(exp.duration)}</span>
                </div>
                <div className="text-xs font-semibold" style={{ color: accentColor }}>
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </div>
                <div className={`${sizeConfig.body} ${isDarkCanvas ? 'text-slate-300' : 'text-slate-700'} whitespace-pre-line`}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Projects Two-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Education */}
        {options.showEducation && data.education && (
          <div className="space-y-2">
            <h2 
              className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b pb-1`}
              style={{ color: accentColor, borderColor: `${accentColor}30` }}
            >
              {t.education}
            </h2>
            <div className="space-y-2">
              {data.education.map(edu => (
                <div key={edu.id} className="text-xs space-y-0.5">
                  <div className={`font-bold ${isDarkCanvas ? 'text-white' : 'text-slate-900'}`}>{edu.degree}</div>
                  <div className="text-slate-500">{edu.institute}</div>
                  <div className="text-[10px] text-slate-400">{formatText(edu.year)} {edu.result ? `• ${edu.result}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {options.showProjects && data.projects && (
          <div className="space-y-2">
            <h2 
              className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b pb-1`}
              style={{ color: accentColor, borderColor: `${accentColor}30` }}
            >
              {t.projects}
            </h2>
            <div className="space-y-2">
              {data.projects.map(proj => (
                <div key={proj.id} className="text-xs space-y-0.5">
                  <div className={`font-bold ${isDarkCanvas ? 'text-white' : 'text-slate-900'}`}>{proj.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{proj.tech}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      {options.showSkills && data.skills && (
        <div className="space-y-1.5">
          <h2 
            className={`${sizeConfig.heading} font-bold uppercase tracking-wider border-b pb-1`}
            style={{ color: accentColor, borderColor: `${accentColor}30` }}
          >
            {t.skills}
          </h2>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.skills.map(s => (
              <span 
                key={s} 
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                  isDarkCanvas 
                    ? 'bg-slate-800 text-slate-200 border border-slate-700' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications, Languages & Awards */}
      {(options.showCertifications || options.showLanguages || options.showAwards) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {options.showCertifications && data.certifications && data.certifications.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">{t.certifications}</h3>
              <div className="space-y-1 text-xs">
                {data.certifications.map(c => (
                  <div key={c.id}>
                    <div className="font-bold text-[11px]">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.showLanguages && data.languages && data.languages.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">{t.languages}</h3>
              <div className="space-y-0.5 text-[11px]">
                {data.languages.map(l => (
                  <div key={l.id} className="text-slate-600 dark:text-slate-400">
                    {l.name} ({l.level})
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.showAwards && data.awards && data.awards.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">{t.awards}</h3>
              <div className="space-y-1 text-xs">
                {data.awards.map(a => (
                  <div key={a.id}>
                    <div className="font-bold text-[11px]">{a.title}</div>
                    <div className="text-[10px] text-slate-400">{a.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* References */}
      {options.showReferences !== false && data.references && data.references.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-1 mb-2">
            {t.references}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {data.references.map(ref => (
              <div key={ref.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="font-bold text-[11px] text-slate-800 dark:text-slate-100">{ref.name}</div>
                <div className="text-[10px] font-medium text-slate-600 dark:text-slate-300">{ref.designation}</div>
                <div className="text-[10px] text-slate-500">{ref.organization}</div>
                {ref.phone && <div className="text-[10px] text-slate-500">Phone: {formatText(ref.phone)}</div>}
                {ref.email && <div className="text-[10px] text-slate-500">Email: {ref.email}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration */}
      {options.showDeclaration !== false && data.declaration?.enabled !== false && data.declaration?.text && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="text-[10px] italic text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            {data.declaration.text}
          </div>
          <div className="flex justify-between items-end text-[10px] text-slate-500">
            <div>
              {data.declaration.date && <div>Date: {formatText(data.declaration.date)}</div>}
              {data.declaration.place && <div>Place: {data.declaration.place}</div>}
            </div>
            {options.showSignature !== false && (
              <div className="text-right">
                <div className="font-serif italic font-semibold text-xs text-slate-800 dark:text-slate-100 border-t border-slate-400 dark:border-slate-600 pt-1 px-4">
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

export const ResumePreview = React.memo(ResumePreviewComponent);
export default ResumePreview;
