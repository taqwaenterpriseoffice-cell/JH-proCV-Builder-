import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig, SectionTitle } from '../primitives';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, ShieldCheck, GraduationCap, Briefcase, Calendar, User, Heart, Home } from 'lucide-react';
import { A4PageContainer, A4PageSheet } from '../../components/A4PageContainer';
import { PageMargin, PageMode } from '../../types';

export const BangladeshCVLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'Inter',
  language = 'en',
  printOptions,
  accentColor = '#1e3a8a',
  fontSize = 'normal',
  templateConfig = {} as any
}) => {
  const options = printOptions || {
    showPhoto: true,
    photoCount: 1,
    showSummary: true,
    showCareerObjective: true,
    showEducation: true,
    showExperience: true,
    showProjects: true,
    showSkills: true,
    showSocials: true,
    showCertifications: true,
    showLanguages: true,
    showAwards: true,
    showBioData: true,
    showFatherMother: true,
    showAddresses: true,
    showReligion: true,
    showMaritalStatus: true,
    showOtherPersonal: true,
    showReferences: true,
    showDeclaration: true,
    showSignature: true,
    multiPage: true,
    pageMode: 'auto',
    pageMargin: 'normal'
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBengali = language === 'bn';
  const formatText = (text: string) => isBengali ? convertToBengaliDigits(text) : text;
  const size = getSizeConfig(fontSize);

  const config = templateConfig.bangladeshCv || {
    photoLayout: 'single',
    bioDataTableStyle: 'striped',
    educationFormat: 'table',
    signatureStyle: 'formal',
    sectionDivider: 'underline'
  };

  // Photo Configuration
  const effectivePhotoCount = !options.showPhoto 
    ? 0 
    : (options.photoCount !== undefined 
        ? options.photoCount 
        : (config.photoLayout === 'triple' ? 3 : config.photoLayout === 'dual' ? 2 : config.photoLayout === 'none' ? 0 : 1));

  const photos = [
    data.personal.photo,
    data.personal.photo2,
    data.personal.photo3
  ].filter(Boolean);

  const fontStyle = {
    fontFamily: isBengali ? "'Hind Siliguri', 'Inter', sans-serif" : (font.includes("'") ? font : `'${font}', sans-serif`)
  };

  // References list
  const referencesList = data.references || [];

  // Personal details items collection
  const personalItems: { label: string; value: string | undefined }[] = [];
  if (options.showFatherMother !== false && data.personal.fatherName) {
    personalItems.push({ label: t.fatherName, value: data.personal.fatherName });
  }
  if (options.showFatherMother !== false && data.personal.motherName) {
    personalItems.push({ label: t.motherName, value: data.personal.motherName });
  }
  if (data.personal.dob) {
    personalItems.push({ label: t.dob, value: formatText(data.personal.dob) });
  }
  if (data.personal.nationality) {
    personalItems.push({ label: t.nationality, value: data.personal.nationality });
  }
  if (options.showReligion !== false && data.personal.religion) {
    personalItems.push({ label: t.religion, value: data.personal.religion });
  }
  if (options.showMaritalStatus !== false && data.personal.maritalStatus) {
    personalItems.push({ label: t.maritalStatus, value: data.personal.maritalStatus });
  }
  if (options.showOtherPersonal !== false && data.personal.gender) {
    personalItems.push({ label: t.gender, value: data.personal.gender });
  }
  if (options.showOtherPersonal !== false && data.personal.bloodGroup) {
    personalItems.push({ label: t.bloodGroup, value: data.personal.bloodGroup });
  }
  if (options.showOtherPersonal !== false && data.personal.nid) {
    personalItems.push({ label: t.nid, value: formatText(data.personal.nid) });
  }
  if (options.showAddresses !== false && data.personal.address) {
    personalItems.push({ label: t.presentAddress, value: data.personal.address });
  }
  if (options.showAddresses !== false && data.personal.permanentAddress) {
    personalItems.push({ label: t.permanentAddress, value: data.personal.permanentAddress });
  }

  // Declaration text
  const declarationText = data.declaration?.text || data.personal.declarationText || (
    isBengali
      ? "আমি এই মর্মে অঙ্গীকার করছি যে, উপরে বর্ণিত সকল তথ্যাবলী আমার জ্ঞান ও বিশ্বাস মতে সম্পূর্ণ সত্য ও নির্ভুল।"
      : "I hereby declare that all the information stated in this Curriculum Vitae is true, correct, and authentic to the best of my knowledge and belief."
  );

  const signatureDate = data.declaration?.date || data.personal.signatureDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const signaturePlace = data.declaration?.place || (data.personal.address ? data.personal.address.split(',')[0] : 'Dhaka');

  // ==========================================
  // MODULAR SECTION RENDERERS (Clean & Robust)
  // ==========================================

  // 1. TOP HEADER & PASSPORT PHOTOS
  const renderHeader = () => (
    <div key="header" data-section="header" className="border-b-2 border-slate-900 pb-3 break-inside-avoid page-break-inside-avoid">
      <div className="text-center mb-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-300 pb-0.5 px-3">
          {isBengali ? 'জীবনবৃত্তান্ত / কারিকুলাম ভিটা' : 'Curriculum Vitae'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        {/* Candidate Name & Contact Details */}
        <div className="flex-1 space-y-1">
          <h1 className={`${size.name} text-slate-950 uppercase tracking-tight font-black leading-tight`}>
            {data.personal.fullName || 'Candidate Name'}
          </h1>
          <p className={`${size.title} font-bold tracking-wide leading-snug`} style={{ color: accentColor }}>
            {data.personal.title}
          </p>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 ${size.small} text-slate-700 pt-0.5`}>
            {data.personal.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={12} className="text-slate-500 shrink-0" />
                <span><strong>{t.phone}:</strong> {formatText(data.personal.phone)}</span>
              </div>
            )}
            {data.personal.email && (
              <div className="flex items-center gap-1.5">
                <Mail size={12} className="text-slate-500 shrink-0" />
                <span><strong>{t.email}:</strong> {data.personal.email}</span>
              </div>
            )}
            {data.personal.address && (
              <div className="flex items-start gap-1.5 sm:col-span-2">
                <MapPin size={12} className="text-slate-500 shrink-0 mt-0.5" />
                <span><strong>{t.presentAddress}:</strong> {data.personal.address}</span>
              </div>
            )}
          </div>

          {/* Social / Professional Links */}
          {options.showSocials && (
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-medium">
              {data.personal.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin size={11} className="text-blue-700" />
                  <span>{data.personal.linkedin.replace(/^https?:\/\//, '')}</span>
                </span>
              )}
              {data.personal.github && (
                <span className="flex items-center gap-1">
                  <Github size={11} className="text-slate-800" />
                  <span>{data.personal.github.replace(/^https?:\/\//, '')}</span>
                </span>
              )}
              {data.personal.website && (
                <span className="flex items-center gap-1">
                  <Globe size={11} className="text-emerald-700" />
                  <span>{data.personal.website.replace(/^https?:\/\//, '')}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Optional Authentic Passport-Size Photo Layouts (1 or 2 photos with Attestation support) */}
        {effectivePhotoCount > 0 && (
          <div className="flex items-center gap-2 self-center sm:self-start shrink-0 pt-0.5">
            {Array.from({ length: effectivePhotoCount }).map((_, idx) => {
              const imgUrl = photos[idx] || (idx === 1 && photos[0] ? photos[0] : null);

              return (
                <div 
                  key={`photo-${idx}`}
                  className="w-[85px] h-[105px] border-2 border-slate-700 p-0.5 bg-white shadow-xs flex flex-col items-center justify-center shrink-0 text-center relative overflow-hidden"
                  style={{ aspectRatio: '35 / 45' }}
                >
                  {imgUrl ? (
                    <img 
                      src={imgUrl} 
                      alt={`Passport Photo ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="p-1 flex flex-col items-center justify-center h-full text-[9px] text-slate-400 font-bold leading-tight">
                      <span>{isBengali ? 'পাসপোর্ট ছবি' : 'Passport Photo'}</span>
                      <span className="text-[8px] font-normal text-slate-400 mt-1">
                        {idx === 1 
                          ? (isBengali ? 'সত্যায়িত কপি' : 'Attested Copy') 
                          : (isBengali ? 'আঠা দিয়ে লাগান' : 'Attach Here')}
                      </span>
                    </div>
                  )}
                  {effectivePhotoCount > 1 && idx === 1 && (
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[7px] py-0.5 font-bold uppercase tracking-wider">
                      {isBengali ? 'সত্যায়িত' : 'Attested'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // 2. CAREER OBJECTIVE / SUMMARY
  const renderObjective = () => {
    if (!options.showSummary && !options.showCareerObjective) return null;
    const summaryText = data.personal.careerObjective || data.personal.summary;
    if (!summaryText) return null;

    return (
      <div key="objective" data-section="objective" className="space-y-1 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={isBengali ? 'ক্যারিয়ার অবজেক্টিভ' : 'Career Objective'} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
        />
        <p className={`${size.body} text-slate-800 leading-relaxed text-justify`}>
          {summaryText}
        </p>
      </div>
    );
  };

  // 3. WORK EXPERIENCE
  const renderExperience = () => {
    if (!options.showExperience || !data.experience || data.experience.length === 0) return null;

    return (
      <div key="experience" data-section="experience" className="space-y-2">
        <SectionTitle 
          title={t.experience} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
          icon={<Briefcase size={14} style={{ color: accentColor }} />}
        />
        <div className="space-y-2.5">
          {data.experience.map((exp, idx) => (
            <div key={exp.id || `exp-${idx}`} data-item="experience" className="break-inside-avoid page-break-inside-avoid space-y-0.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  {exp.position} <span className="text-slate-400 font-normal">|</span> <span className="font-semibold" style={{ color: accentColor }}>{exp.company}</span>
                </div>
                <div className="text-[11px] font-medium text-slate-600 shrink-0 tabular-nums">
                  {exp.duration 
                    ? formatText(exp.duration) 
                    : `${formatText((exp as any).startDate || '')} – ${(exp as any).current ? (isBengali ? 'বর্তমান' : 'Present') : formatText((exp as any).endDate || '')}`}
                </div>
              </div>
              {exp.location && (
                <div className="text-[11px] text-slate-500 font-medium">
                  {exp.location}
                </div>
              )}
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

  // 4. ACADEMIC QUALIFICATIONS TABLE (SSC, HSC, University)
  const renderEducation = () => {
    if (!options.showEducation || !data.education || data.education.length === 0) return null;

    return (
      <div key="education" data-section="education" className="space-y-1.5 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.academicQualifications} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
          icon={<GraduationCap size={14} style={{ color: accentColor }} />}
        />
        <div className="border border-slate-300 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <tr>
                <th className="p-1.5 border-r border-slate-300">{isBengali ? 'পরীক্ষা / ডিগ্রী' : 'Exam / Degree'}</th>
                <th className="p-1.5 border-r border-slate-300">{isBengali ? 'প্রতিষ্ঠান / বোর্ড / বিশ্ববিদ্যালয়' : 'Institute / Board'}</th>
                <th className="p-1.5 border-r border-slate-300">{isBengali ? 'বিভাগ / বিষয়' : 'Group / Major'}</th>
                <th className="p-1.5 border-r border-slate-300 text-center">{isBengali ? 'পাশের সন' : 'Year'}</th>
                <th className="p-1.5 text-center">{isBengali ? 'ফলাফল / জিপিএ' : 'Result / GPA'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.education.map((edu, idx) => (
                <tr key={edu.id || `edu-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">
                    {edu.degree}
                  </td>
                  <td className="p-1.5 text-slate-800 border-r border-slate-200">
                    <div>{edu.institute || (edu as any).institution}</div>
                    {edu.board && <div className="text-[10px] text-slate-500 font-medium">Board: {edu.board}</div>}
                  </td>
                  <td className="p-1.5 text-slate-700 border-r border-slate-200">
                    {edu.group || (edu as any).field || '—'}
                  </td>
                  <td className="p-1.5 text-center text-slate-800 border-r border-slate-200 tabular-nums font-medium">
                    {formatText(edu.year || (edu as any).startDate || '—')}
                  </td>
                  <td className="p-1.5 text-center font-bold text-slate-900 tabular-nums">
                    {edu.result ? formatText(edu.result) : ((edu as any).gpa ? formatText((edu as any).gpa) : '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 5. SKILLS & PROFICIENCIES
  const renderSkills = () => {
    if (!options.showSkills || !data.skills || data.skills.length === 0) return null;

    return (
      <div key="skills" data-section="skills" className="space-y-1.5 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.skills} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
        />
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill: any, idx: number) => {
            const isString = typeof skill === 'string';
            const skillName = isString ? skill : (skill.name || '');
            const skillLevel = isString ? null : skill.level;
            const skillKey = isString ? `skill-${idx}-${skill}` : (skill.id || `skill-${idx}-${skillName}`);

            return (
              <span 
                key={skillKey}
                className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-800 text-xs font-semibold"
              >
                {skillName} {skillLevel && <span className="text-[10px] text-slate-500 font-normal">({skillLevel})</span>}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  // 6. FEATURED PROJECTS
  const renderProjects = () => {
    if (!options.showProjects || !data.projects || data.projects.length === 0) return null;

    return (
      <div key="projects" data-section="projects" className="space-y-2">
        <SectionTitle 
          title={t.projects} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {data.projects.map((proj, idx) => (
            <div key={proj.id || `proj-${idx}`} data-item="project" className="p-2 border border-slate-300 rounded bg-slate-50/40 space-y-1 break-inside-avoid page-break-inside-avoid">
              <div className="font-bold text-slate-900 text-xs flex justify-between items-baseline">
                <span>{proj.title}</span>
                {proj.link && <span className="text-[10px] text-blue-600 font-normal truncate max-w-[120px]">{proj.link}</span>}
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {proj.description}
              </p>
              {proj.tech && (
                <div className="text-[10px] text-slate-500 font-medium pt-0.5">
                  <strong>Tech:</strong> {proj.tech}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 7. CERTIFICATIONS & TRAINING
  const renderCertifications = () => {
    if (!options.showCertifications || !data.certifications || data.certifications.length === 0) return null;

    return (
      <div key="certifications" data-section="certifications" className="space-y-1 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.certifications} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
        />
        <div className="space-y-1 text-xs text-slate-800">
          {data.certifications.map((c, idx) => (
            <div key={c.id || `cert-${idx}`} className="flex justify-between items-baseline">
              <span className="font-semibold text-slate-900">• {c.name} — <span className="text-slate-700 font-normal">{c.issuer}</span></span>
              {c.date && <span className="text-[11px] text-slate-500 tabular-nums">{formatText(c.date)}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 8. LANGUAGES
  const renderLanguages = () => {
    if (!options.showLanguages || !data.languages || data.languages.length === 0) return null;

    return (
      <div key="languages" data-section="languages" className="space-y-1 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.languages} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
        />
        <div className="flex flex-wrap gap-2 text-xs text-slate-800">
          {data.languages.map((l, idx) => (
            <span key={l.id || `lang-${idx}`} className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
              <strong>{l.name}</strong>: <span className="text-slate-600">{l.level}</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  // 9. PERSONAL DETAILS / BIO-DATA TABLE
  const renderBioData = () => {
    if (options.showBioData === false || personalItems.length === 0) return null;

    return (
      <div key="biodata" data-section="biodata" className="space-y-1.5 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.personalDetails} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
          icon={<User size={14} style={{ color: accentColor }} />}
        />
        <div className="border border-slate-300 rounded overflow-hidden">
          <table className="w-full text-xs text-left border-collapse">
            <tbody className="divide-y divide-slate-200">
              {personalItems.map((item, idx) => (
                <tr key={`personal-${idx}-${item.label}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="w-1/3 sm:w-1/4 p-1.5 font-bold text-slate-800 border-r border-slate-200">
                    {item.label}
                  </td>
                  <td className="p-1.5 text-slate-800 font-medium">
                    : {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 10. REFERENCES (Classical 2-Column Professional References)
  const renderReferences = () => {
    if (options.showReferences === false || referencesList.length === 0) return null;

    return (
      <div key="references" data-section="references" className="space-y-1.5 break-inside-avoid page-break-inside-avoid">
        <SectionTitle 
          title={t.references} 
          variant="underline" 
          accentColor={accentColor}
          sizeClass={size.heading}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {referencesList.map((ref, idx) => (
            <div key={ref.id || `ref-${idx}`} data-item="reference" className="p-2.5 border border-slate-300 rounded bg-slate-50/40 space-y-0.5 text-xs break-inside-avoid page-break-inside-avoid">
              <div className="font-bold text-slate-900 text-sm">{ref.name}</div>
              <div className="font-medium text-slate-800">{ref.designation}</div>
              <div className="text-slate-700 font-semibold" style={{ color: accentColor }}>{ref.organization}</div>
              {ref.phone && <div><strong>Mobile:</strong> {formatText(ref.phone)}</div>}
              {ref.email && <div><strong>Email:</strong> {ref.email}</div>}
              {ref.relation && <div className="text-slate-500 italic text-[10px]">Relation: {ref.relation}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 11. DECLARATION AND SIGNATURE
  const renderDeclaration = () => {
    if (options.showDeclaration === false) return null;

    return (
      <div key="declaration" data-section="declaration" className="pt-2 space-y-4 border-t border-slate-300 break-inside-avoid page-break-inside-avoid">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {t.declaration}
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            {declarationText}
          </p>
        </div>

        {/* Signature and Date Footer Row */}
        <div className="flex justify-between items-end pt-1 text-xs">
          <div className="space-y-0.5 text-slate-700">
            <div><strong>{t.date}:</strong> {formatText(signatureDate)}</div>
            <div><strong>Place:</strong> {signaturePlace}</div>
          </div>

          {options.showSignature !== false && (
            <div className="flex flex-col items-center text-center">
              {data.personal.signature || data.declaration?.signature ? (
                <div className="h-9 mb-1 max-w-[140px] flex items-center justify-center">
                  <img 
                    src={data.personal.signature || data.declaration?.signature} 
                    alt="Signature" 
                    className="max-h-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="font-serif italic text-sm text-slate-800 mb-1">
                  {data.personal.fullName}
                </div>
              )}
              <div className="w-36 border-t border-slate-900 pt-1 font-bold text-slate-900 text-xs">
                ({data.personal.fullName || 'Candidate Signature'})
              </div>
              <span className="text-[10px] text-slate-500">{t.signature}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // A4 PAGINATION LOGIC (1-Page, 2-Page, 3-Page, Auto)
  // ==========================================
  const effectivePageMode: PageMode = options.pageMode || (options.multiPage === false ? '1-page' : 'auto');
  const effectiveMargin: PageMargin = options.pageMargin || 'normal';

  let pages: React.ReactNode[][] = [];

  if (effectivePageMode === '1-page') {
    // Single page strict fit (dense layout)
    pages = [[
      renderHeader(),
      renderObjective(),
      renderExperience(),
      renderEducation(),
      renderSkills(),
      renderProjects(),
      renderCertifications(),
      renderLanguages(),
      renderBioData(),
      renderReferences(),
      renderDeclaration()
    ].filter(Boolean)];
  } else if (effectivePageMode === '3-page') {
    // 3-page comprehensive layout
    pages = [
      // Page 1: Header, Objective, Experience, and Core Skills
      [renderHeader(), renderObjective(), renderExperience(), renderSkills()].filter(Boolean),
      // Page 2: Academic Qualifications, Projects, Certifications, Languages
      [renderEducation(), renderProjects(), renderCertifications(), renderLanguages()].filter(Boolean),
      // Page 3: Personal Bio-Data, References, Declaration & Signature
      [renderBioData(), renderReferences(), renderDeclaration()].filter(Boolean)
    ];
  } else if (effectivePageMode === '2-page') {
    // 2-PAGE BALANCED DISTRIBUTION:
    // Page 1: Header + Objective + Experience + Academic Qualifications + Skills
    // Page 2: Projects + Certifications + Languages + Complete Bio-Data Table + References + Declaration & Signature
    // If experience is very long (>3 items) and projects exist, balance education or projects to ensure zero cut-off.
    const expCount = (data.experience || []).length;
    const eduCount = (data.education || []).length;
    const projCount = (data.projects || []).length;

    if (expCount >= 3 && eduCount >= 3) {
      // High experience & high education: keep Experience on P1, move Education to top of P2
      pages = [
        [renderHeader(), renderObjective(), renderExperience(), renderSkills()].filter(Boolean),
        [renderEducation(), renderProjects(), renderCertifications(), renderLanguages(), renderBioData(), renderReferences(), renderDeclaration()].filter(Boolean)
      ];
    } else {
      // Standard professional 2-page flow: Education on P1, Bio-Data + References on P2
      pages = [
        [renderHeader(), renderObjective(), renderExperience(), renderEducation(), renderSkills()].filter(Boolean),
        [renderProjects(), renderCertifications(), renderLanguages(), renderBioData(), renderReferences(), renderDeclaration()].filter(Boolean)
      ];
    }
  } else {
    // AUTO MODE: Smart content-height evaluation
    const hasBioData = options.showBioData !== false && personalItems.length > 0;
    const hasReferences = options.showReferences !== false && referencesList.length > 0;
    const hasDeclaration = options.showDeclaration !== false;
    const expCount = (data.experience || []).length;
    const eduCount = (data.education || []).length;
    const projCount = (data.projects || []).length;
    const certCount = (data.certifications || []).length;

    // Determine if content naturally demands 3 pages to avoid any cramped text
    const isExpansive = (expCount >= 2 && eduCount >= 2 && (projCount > 0 || certCount > 0)) && hasBioData && hasReferences;

    if (isExpansive) {
      // 3-page natural flow
      pages = [
        [renderHeader(), renderObjective(), renderExperience(), renderSkills()].filter(Boolean),
        [renderEducation(), renderProjects(), renderCertifications(), renderLanguages()].filter(Boolean),
        [renderBioData(), renderReferences(), renderDeclaration()].filter(Boolean)
      ];
    } else if (!hasBioData && !hasReferences && !hasDeclaration && expCount <= 1 && projCount <= 1) {
      // Very short CV - 1 page
      pages = [[
        renderHeader(),
        renderObjective(),
        renderExperience(),
        renderEducation(),
        renderSkills(),
        renderProjects(),
        renderCertifications(),
        renderLanguages()
      ].filter(Boolean)];
    } else {
      // Standard balanced 2-page Bangladesh CV
      if (expCount >= 3 && eduCount >= 3) {
        pages = [
          [renderHeader(), renderObjective(), renderExperience(), renderSkills()].filter(Boolean),
          [renderEducation(), renderProjects(), renderCertifications(), renderLanguages(), renderBioData(), renderReferences(), renderDeclaration()].filter(Boolean)
        ];
      } else {
        pages = [
          [renderHeader(), renderObjective(), renderExperience(), renderEducation(), renderSkills()].filter(Boolean),
          [renderProjects(), renderCertifications(), renderLanguages(), renderBioData(), renderReferences(), renderDeclaration()].filter(Boolean)
        ];
      }
    }
  }

  // Remove any empty pages
  pages = pages.filter(p => p.length > 0);

  return (
    <A4PageContainer
      pageMode={effectivePageMode}
      pageMargin={effectiveMargin}
      font={font}
      accentColor={accentColor}
      candidateName={data.personal.fullName}
      documentTitle={isBengali ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae'}
    >
      {pages.map((pageSections, pageIdx) => (
        <A4PageSheet
          key={`a4-page-${pageIdx}`}
          pageNumber={pageIdx + 1}
          totalPages={pages.length}
          margin={effectiveMargin}
          candidateName={data.personal.fullName}
          documentTitle={isBengali ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae'}
          accentColor={accentColor}
          font={font}
          scale={effectivePageMode === '1-page' ? 0.88 : 1}
        >
          <div className={`w-full ${size.gap} text-slate-900 flex flex-col justify-start`} style={fontStyle}>
            {pageSections}
          </div>
        </A4PageSheet>
      ))}
    </A4PageContainer>
  );
};
