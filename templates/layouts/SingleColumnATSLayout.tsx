import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig, SectionTitle } from '../primitives';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';
import { A4PageContainer, A4PageSheet } from '../../components/A4PageContainer';
import { PageMargin, PageMode } from '../../types';

export const SingleColumnATSLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'Inter',
  language = 'en',
  printOptions,
  accentColor = '#0f172a',
  fontSize = 'normal',
  templateConfig = {} as any
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
    showReferences: false,
    showDeclaration: false,
    showSignature: false,
    multiPage: false,
    pageMode: 'auto',
    pageMargin: 'normal'
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBengali = language === 'bn';
  const formatText = (text: string) => isBengali ? convertToBengaliDigits(text) : text;
  const size = getSizeConfig(fontSize);

  // Layout configuration options
  const headerAlignment = templateConfig.headerAlignment || 'center'; // 'center' | 'left'
  const titleVariant = templateConfig.titleVariant || 'underline';
  const isSerif = templateConfig.serif || false;
  const dividerStyle = templateConfig.dividerStyle || 'solid';
  const showBorderTop = templateConfig.borderTop || false;
  const showBorderFrame = templateConfig.borderFrame || false;
  const customAccent = templateConfig.useMonochrome ? '#000000' : accentColor;

  const fontFamily = isSerif ? "'Libre Baskerville', Georgia, serif" : (font.includes("'") ? font : `'${font}', sans-serif`);

  // Section Renderers
  const renderHeader = () => (
    <div key="header" data-section="header" className={`space-y-1 pb-3 border-b ${
      dividerStyle === 'double' ? 'border-b-2 border-slate-900' : 'border-slate-300'
    } ${headerAlignment === 'center' ? 'text-center' : 'text-left'} break-inside-avoid page-break-inside-avoid`}>
      <h1 className={`${size.name} tracking-tight text-slate-900 uppercase font-black`}>
        {data.personal.fullName || 'Candidate Name'}
      </h1>
      <p className={`${size.title} font-semibold text-slate-700 tracking-wide`}>
        {data.personal.title}
      </p>

      {/* Contact Strip */}
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${size.small} text-slate-600 pt-1 ${
        headerAlignment === 'center' ? 'justify-center' : 'justify-start'
      }`}>
        {data.personal.phone && <span>{formatText(data.personal.phone)}</span>}
        {data.personal.email && (
          <>
            <span>•</span>
            <span>{data.personal.email}</span>
          </>
        )}
        {data.personal.address && (
          <>
            <span>•</span>
            <span>{data.personal.address}</span>
          </>
        )}
        {data.personal.website && (
          <>
            <span>•</span>
            <span>{data.personal.website}</span>
          </>
        )}
        {data.personal.linkedin && (
          <>
            <span>•</span>
            <span>{data.personal.linkedin.replace(/^https?:\/\//, '')}</span>
          </>
        )}
        {data.personal.github && (
          <>
            <span>•</span>
            <span>{data.personal.github.replace(/^https?:\/\//, '')}</span>
          </>
        )}
      </div>
    </div>
  );

  const renderSummary = () => {
    if (!options.showSummary && !options.showCareerObjective) return null;
    const summaryText = data.personal.summary || data.personal.careerObjective;
    if (!summaryText) return null;

    return (
      <div key="summary" data-section="summary" className="space-y-1 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.summary} 
          variant={titleVariant} 
          accentColor={customAccent} 
          sizeClass={size.heading}
        />
        <p className={`${size.body} text-slate-700 leading-relaxed text-justify`}>
          {summaryText}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!options.showExperience || !data.experience || data.experience.length === 0) return null;

    return (
      <div key="experience" data-section="experience" className="space-y-2">
        <SectionTitle 
          title={t.experience} 
          variant={titleVariant} 
          accentColor={customAccent} 
          sizeClass={size.heading}
        />
        <div className="space-y-3">
          {data.experience.map(exp => (
            <div key={exp.id} data-item="experience" className="break-inside-avoid page-break-inside-avoid space-y-0.5">
              <div className="flex justify-between items-baseline text-xs sm:text-sm">
                <span className="font-bold text-slate-900">{exp.position}</span>
                <span className="text-slate-600 tabular-nums">
                  {formatText(exp.startDate)} – {exp.current ? (isBengali ? 'বর্তমান' : 'Present') : formatText(exp.endDate)}
                </span>
              </div>
              <div className="text-slate-700 font-medium text-xs flex justify-between">
                <span>{exp.company}</span>
                {exp.location && <span className="text-slate-500">{exp.location}</span>}
              </div>
              {exp.description && (
                <p className={`${size.body} text-slate-700 leading-relaxed whitespace-pre-line text-justify pt-0.5`}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (!options.showEducation || !data.education || data.education.length === 0) return null;

    return (
      <div key="education" data-section="education" className="space-y-2 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.academicQualifications} 
          variant={titleVariant} 
          accentColor={customAccent} 
          sizeClass={size.heading}
        />
        <div className="space-y-2">
          {data.education.map(edu => (
            <div key={edu.id} className="flex justify-between items-baseline text-xs sm:text-sm">
              <div>
                <span className="font-bold text-slate-900">{edu.degree}</span>
                {edu.field && <span className="text-slate-700"> in {edu.field}</span>}
                <div className="text-slate-600 text-xs">{edu.institution} {edu.board && `(${edu.board})`}</div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-600 tabular-nums font-medium">
                  {formatText(edu.year || edu.startDate || '')}
                </div>
                {(edu.gpa || edu.result) && (
                  <div className="text-slate-800 font-bold">
                    GPA: {formatText(edu.gpa || edu.result || '')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (!options.showSkills || !data.skills || data.skills.length === 0) return null;

    return (
      <div key="skills" data-section="skills" className="space-y-1 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.skills} 
          variant={titleVariant} 
          accentColor={customAccent} 
          sizeClass={size.heading}
        />
        <div className="text-xs text-slate-800 leading-relaxed">
          <span className="font-semibold">Core Competencies: </span>
          {data.skills.map((s: any) => typeof s === 'string' ? s : (s.name || '')).join(' • ')}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!options.showProjects || !data.projects || data.projects.length === 0) return null;

    return (
      <div key="projects" data-section="projects" className="space-y-2">
        <SectionTitle 
          title={t.projects} 
          variant={titleVariant} 
          accentColor={customAccent} 
          sizeClass={size.heading}
        />
        <div className="space-y-2.5">
          {data.projects.map(proj => (
            <div key={proj.id} data-item="project" className="space-y-0.5 break-inside-avoid page-break-inside-avoid">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                <span>{proj.title}</span>
                {proj.link && <span className="text-[10px] text-blue-600 font-normal">{proj.link}</span>}
              </div>
              <p className={`${size.body} text-slate-700 leading-relaxed`}>{proj.description}</p>
              {proj.tech && (
                <p className="text-[10px] text-slate-500 font-mono">
                  Technologies: {proj.tech}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertificationsAndLanguages = () => {
    const hasCerts = options.showCertifications && data.certifications && data.certifications.length > 0;
    const hasLangs = options.showLanguages && data.languages && data.languages.length > 0;
    if (!hasCerts && !hasLangs) return null;

    return (
      <div key="certs-langs" className="grid grid-cols-1 sm:grid-cols-2 gap-4 break-inside-avoid page-break-inside-avoid">
        {hasCerts && (
          <div>
            <SectionTitle 
              title={t.certifications} 
              variant={titleVariant} 
              accentColor={customAccent} 
              sizeClass={size.heading}
            />
            <div className="space-y-1 text-xs text-slate-700">
              {data.certifications.map(c => (
                <div key={c.id}>
                  <span className="font-bold text-slate-900">{c.name}</span> — {c.issuer} ({formatText(c.date)})
                </div>
              ))}
            </div>
          </div>
        )}

        {hasLangs && (
          <div>
            <SectionTitle 
              title={t.languages} 
              variant={titleVariant} 
              accentColor={customAccent} 
              sizeClass={size.heading}
            />
            <div className="space-y-0.5 text-xs text-slate-700">
              {data.languages.map(l => (
                <div key={l.id} className="flex justify-between">
                  <span className="font-medium text-slate-800">{l.name}</span>
                  <span className="text-slate-500">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReferences = () => {
    if (!options.showReferences || !data.references || data.references.length === 0) return null;

    return (
      <div key="references" data-section="references" className="space-y-2 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.references} 
          variant={titleVariant} 
          accentColor={customAccent} 
          sizeClass={size.heading}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {data.references.map((ref, idx) => (
            <div key={ref.id || idx} className="p-2 border border-slate-200 rounded space-y-0.5">
              <div className="font-bold text-slate-900">{ref.name}</div>
              <div className="text-slate-700">{ref.designation} — {ref.organization}</div>
              {ref.phone && <div>Tel: {formatText(ref.phone)}</div>}
              {ref.email && <div>Email: {ref.email}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDeclaration = () => {
    if (options.showDeclaration === false || data.declaration?.enabled === false) return null;
    const text = data.declaration?.text || (language === 'bn' 
      ? 'আমি এই মর্মে অঙ্গীকার করছি যে, উপরে বর্ণিত সকল তথ্যাবলী সম্পূর্ণ সত্য ও নির্ভুল।' 
      : 'I hereby declare that all the information stated in this Curriculum Vitae is true, correct, and authentic to the best of my knowledge and belief.');

    return (
      <div key="declaration" data-section="declaration" className="pt-2 border-t border-slate-200 break-inside-avoid page-break-inside-avoid space-y-2">
        <div className="text-[11px] italic text-slate-600 leading-relaxed">
          {text}
        </div>
        <div className="flex justify-between items-end text-[11px] text-slate-500">
          <div>
            {data.declaration?.date && <div>Date: {formatText(data.declaration.date)}</div>}
            {data.declaration?.place && <div>Place: {data.declaration.place}</div>}
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
    );
  };

  // Pagination modes
  const effectivePageMode: PageMode = options.pageMode || (options.multiPage ? 'auto' : '1-page');
  const effectiveMargin: PageMargin = options.pageMargin || 'normal';

  let pages: React.ReactNode[][] = [];

  if (effectivePageMode === '1-page') {
    pages = [[
      renderHeader(),
      renderSummary(),
      renderExperience(),
      renderEducation(),
      renderSkills(),
      renderProjects(),
      renderCertificationsAndLanguages(),
      renderReferences(),
      renderDeclaration()
    ].filter(Boolean)];
  } else if (effectivePageMode === '3-page') {
    pages = [
      [renderHeader(), renderSummary(), renderExperience()].filter(Boolean),
      [renderEducation(), renderProjects()].filter(Boolean),
      [renderSkills(), renderCertificationsAndLanguages(), renderReferences(), renderDeclaration()].filter(Boolean)
    ];
  } else if (effectivePageMode === '2-page') {
    pages = [
      [renderHeader(), renderSummary(), renderExperience()].filter(Boolean),
      [renderEducation(), renderProjects(), renderSkills(), renderCertificationsAndLanguages(), renderReferences(), renderDeclaration()].filter(Boolean)
    ];
  } else {
    // Auto mode for ATS:
    const expCount = (data.experience || []).length;
    const projCount = (data.projects || []).length;
    const isMultiPage = expCount > 2 || (expCount >= 2 && projCount > 1);

    if (isMultiPage) {
      pages = [
        [renderHeader(), renderSummary(), renderExperience()].filter(Boolean),
        [renderEducation(), renderProjects(), renderSkills(), renderCertificationsAndLanguages(), renderReferences(), renderDeclaration()].filter(Boolean)
      ];
    } else {
      pages = [[
        renderHeader(),
        renderSummary(),
        renderExperience(),
        renderEducation(),
        renderSkills(),
        renderProjects(),
        renderCertificationsAndLanguages(),
        renderReferences(),
        renderDeclaration()
      ].filter(Boolean)];
    }
  }

  pages = pages.filter(p => p.length > 0);

  return (
    <A4PageContainer
      pageMode={effectivePageMode}
      pageMargin={effectiveMargin}
      font={fontFamily}
      accentColor={customAccent}
      candidateName={data.personal.fullName}
      documentTitle="Resume"
    >
      {pages.map((pageSections, pageIdx) => (
        <A4PageSheet
          key={pageIdx}
          pageNumber={pageIdx + 1}
          totalPages={pages.length}
          margin={effectiveMargin}
          candidateName={data.personal.fullName}
          documentTitle="Resume"
          accentColor={customAccent}
          font={fontFamily}
          scale={effectivePageMode === '1-page' ? 0.92 : 1}
        >
          <div className={`w-full ${size.gap} text-slate-900 flex flex-col justify-start`} style={{ fontFamily }}>
            {pageSections}
          </div>
        </A4PageSheet>
      ))}
    </A4PageContainer>
  );
};
