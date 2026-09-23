import React from 'react';
import { TemplateRenderProps } from '../types';
import { TRANSLATIONS, convertToBengaliDigits, getSizeConfig } from '../primitives';
import { A4PageContainer, A4PageSheet } from '../../components/A4PageContainer';
import { PageMargin, PageMode } from '../../types';

// Helper to calculate exact age in years, months, days
export function calculateBDAge(dobString: string, referenceDateString?: string, isBengali: boolean = true): string {
  if (!dobString) return '';
  try {
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return '';

    const targetDate = referenceDateString ? new Date(referenceDateString) : new Date();
    if (isNaN(targetDate.getTime())) return '';

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years < 0) return '';

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (isBengali) {
      return convertToBengaliDigits(`${years} বছর ${pad(months)} মাস ${pad(days)} দিন`);
    } else {
      return `${years} Years ${pad(months)} Months ${pad(days)} Days`;
    }
  } catch (e) {
    return '';
  }
}

export const BDGovtBioDataLayout: React.FC<TemplateRenderProps> = ({
  data,
  font = 'Hind Siliguri',
  language = 'bn',
  printOptions,
  accentColor = '#166534', // Formal Bangladesh Green
  fontSize = 'normal'
}) => {
  const isBengali = language === 'bn';
  const formatNum = (text: string | number | undefined) => {
    if (text === undefined || text === null) return '';
    return isBengali ? convertToBengaliDigits(String(text)) : String(text);
  };

  const options = printOptions || {
    showPhoto: true,
    photoCount: 1,
    showEducation: true,
    showExperience: true,
    showSkills: true,
    showReferences: true,
    showDeclaration: true,
    showSignature: true,
    multiPage: false,
    pageMode: '1-page',
    pageMargin: 'compact'
  };

  const fontStyle = {
    fontFamily: isBengali ? "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif" : (font.includes("'") ? font : `'${font}', sans-serif`)
  };

  // Age text
  const calculatedAge = data.personal.ageText || calculateBDAge(data.personal.dob, data.personal.circularDate, isBengali);

  // Photo
  const photoUrl = data.personal.photo || null;

  // 1. TOP OFFICIAL HEADER & PHOTO BOX
  const renderHeader = () => (
    <div key="govt-header" className="relative border-b-2 border-slate-900 pb-2.5 mb-2.5">
      <div className="flex items-start justify-between gap-3">
        {/* Left / Center Official Title */}
        <div className="flex-1 text-center pt-1">
          <div className="inline-block border border-slate-800 bg-slate-100/80 px-4 py-0.5 rounded text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1">
            {isBengali ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার / সরকারি চাকুরীর আবেদন ফরম' : 'Government of the People\'s Republic of Bangladesh / Job Application Form'}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
            {isBengali ? 'জীবনবৃত্তান্ত ফরম' : 'Curriculum Vitae / Bio-Data'}
          </h1>
          <p className="text-[11px] font-bold text-slate-700 mt-0.5">
            {isBengali ? '(নির্ধারিত চাকুরীর আবেদন ফরমের অনুকরণে প্রণীত)' : '(Prescribed Standard Public Service Employment Format)'}
          </p>
          {(data.personal.circularNo || data.personal.circularDate) && (
            <div className="text-[10px] font-semibold text-slate-600 mt-1 flex items-center justify-center gap-3">
              {data.personal.circularNo && (
                <span><strong>{isBengali ? 'বিজ্ঞপ্তি নং:' : 'Circular No:'}</strong> {formatNum(data.personal.circularNo)}</span>
              )}
              {data.personal.circularDate && (
                <span><strong>{isBengali ? 'তারিখ:' : 'Date:'}</strong> {formatNum(data.personal.circularDate)}</span>
              )}
            </div>
          )}
        </div>

        {/* Right Corner: Standard Passport Photo with Attestation Label */}
        {options.showPhoto !== false && (
          <div className="shrink-0 flex flex-col items-center">
            <div 
              className="w-[85px] h-[105px] border-2 border-slate-800 bg-slate-50 flex flex-col items-center justify-center text-center p-0.5 relative overflow-hidden shadow-xs"
              style={{ aspectRatio: '35 / 45' }}
            >
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Candidate Photo" 
                  className="w-full h-full object-cover" 
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 p-1">
                  <span className="text-[9px] font-bold text-slate-700 leading-tight">
                    {isBengali ? 'পাসপোর্ট সাইজ' : 'Passport Size'}
                  </span>
                  <span className="text-[7.5px] leading-tight text-slate-500 mt-1">
                    {isBengali ? '১ কপি সত্যায়িত ছবি আঠা দিয়ে লাগান' : 'Attach 1 copy attested photo'}
                  </span>
                </div>
              )}
              {/* Official Attested Strip */}
              <div className="absolute bottom-0 inset-x-0 bg-slate-900 text-white text-[7px] font-bold py-0.5 uppercase tracking-wider text-center">
                {isBengali ? 'সত্যায়িত' : 'Attested'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 2. NUMBERED BIO-DATA TABLE (Official Bangladesh Serialized Items ১ to ১১)
  const renderSerializedBioData = () => {
    const serials = [
      {
        no: isBengali ? '১' : '1',
        title: isBengali ? 'প্রার্থীর নাম' : 'Applicant\'s Name',
        content: (
          <div className="space-y-0.5">
            <div>
              <span className="font-semibold text-slate-600">{isBengali ? '(ক) বাংলায়: ' : '(a) In Bengali: '}</span>
              <span className="font-bold text-slate-950 text-xs sm:text-sm">
                {data.personal.fullNameBn || data.personal.fullName}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">{isBengali ? '(খ) ইংরেজিতে (বড় অক্ষরে): ' : '(b) In English (Capital): '}</span>
              <span className="font-bold text-slate-950 text-xs uppercase tracking-wide">
                {data.personal.fullName.toUpperCase()}
              </span>
            </div>
          </div>
        )
      },
      {
        no: isBengali ? '২' : '2',
        title: isBengali ? 'জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং' : 'National ID / Birth Reg. No.',
        content: (
          <span className="font-bold text-slate-900 tracking-wider">
            {data.personal.nid ? formatNum(data.personal.nid) : (isBengali ? 'প্রযোজ্য ক্ষেত্রে সংযোজিত' : 'Attached')}
          </span>
        )
      },
      {
        no: isBengali ? '৩' : '3',
        title: isBengali ? 'জন্ম তারিখ ও বয়স' : 'Date of Birth & Age',
        content: (
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5">
            <span>
              <strong>{isBengali ? 'জন্ম তারিখ: ' : 'DOB: '}</strong>
              {data.personal.dob ? formatNum(data.personal.dob) : '—'}
            </span>
            {calculatedAge && (
              <span className="text-slate-800">
                <strong>{isBengali ? 'নির্ধারিত তারিখে প্রার্থীর বয়স: ' : 'Age on circular date: '}</strong>
                <span className="font-bold text-emerald-950">{calculatedAge}</span>
              </span>
            )}
          </div>
        )
      },
      {
        no: isBengali ? '৪' : '4',
        title: isBengali ? 'মাতার নাম' : 'Mother\'s Name',
        content: <span className="font-bold text-slate-900">{data.personal.motherName || '—'}</span>
      },
      {
        no: isBengali ? '৫' : '5',
        title: isBengali ? 'পিতার নাম' : 'Father\'s Name',
        content: <span className="font-bold text-slate-900">{data.personal.fatherName || '—'}</span>
      },
      {
        no: isBengali ? '৬' : '6',
        title: isBengali ? 'ঠিকানা' : 'Address',
        content: (
          <div className="space-y-1">
            <div>
              <span className="font-semibold text-slate-600">{isBengali ? '(ক) বর্তমান ঠিকানা: ' : '(a) Present Address: '}</span>
              <span className="text-slate-900 font-medium">{data.personal.address || '—'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">{isBengali ? '(খ) স্থায়ী ঠিকানা: ' : '(b) Permanent Address: '}</span>
              <span className="text-slate-900 font-medium">{data.personal.permanentAddress || data.personal.address || '—'}</span>
            </div>
          </div>
        )
      },
      {
        no: isBengali ? '৭' : '7',
        title: isBengali ? 'নিজ জেলা' : 'Home District',
        content: (
          <span className="font-bold text-slate-900">
            {data.personal.homeDistrict || (data.personal.address ? data.personal.address.split(',').pop()?.trim() : 'ঢাকা')}
          </span>
        )
      },
      {
        no: isBengali ? '৮' : '8',
        title: isBengali ? 'জাতীয়তা ও ধর্ম' : 'Nationality & Religion',
        content: (
          <div className="flex items-center gap-6">
            <span><strong>{isBengali ? 'জাতীয়তা: ' : 'Nationality: '}</strong>{data.personal.nationality || (isBengali ? 'বাংলাদেশী' : 'Bangladeshi')}</span>
            <span><strong>{isBengali ? 'ধর্ম: ' : 'Religion: '}</strong>{data.personal.religion || (isBengali ? 'ইসলাম' : 'Islam')}</span>
          </div>
        )
      },
      {
        no: isBengali ? '৯' : '9',
        title: isBengali ? 'জেন্ডার ও রক্তের গ্রুপ' : 'Gender & Blood Group',
        content: (
          <div className="flex items-center gap-6">
            <span><strong>{isBengali ? 'জেন্ডার: ' : 'Gender: '}</strong>{data.personal.gender || (isBengali ? 'পুরুষ' : 'Male')}</span>
            {data.personal.bloodGroup && (
              <span><strong>{isBengali ? 'রক্তের গ্রুপ: ' : 'Blood Group: '}</strong><span className="font-bold">{data.personal.bloodGroup}</span></span>
            )}
          </div>
        )
      },
      {
        no: isBengali ? '১০' : '10',
        title: isBengali ? 'বৈবাহিক অবস্থা ও মোবাইল নং' : 'Marital Status & Mobile',
        content: (
          <div className="flex flex-wrap items-center gap-6">
            <span><strong>{isBengali ? 'বৈবাহিক অবস্থা: ' : 'Marital Status: '}</strong>{data.personal.maritalStatus || (isBengali ? 'অবিবাহিত' : 'Single')}</span>
            <span><strong>{isBengali ? 'মোবাইল: ' : 'Mobile: '}</strong><span className="font-bold">{formatNum(data.personal.phone)}</span></span>
            {data.personal.email && (
              <span><strong>{isBengali ? 'ইমেইল: ' : 'Email: '}</strong>{data.personal.email}</span>
            )}
          </div>
        )
      },
      {
        no: isBengali ? '১১' : '11',
        title: isBengali ? 'কোটা (যদি থাকে)' : 'Quota (If any)',
        content: (
          <span className="font-semibold text-slate-800">
            {data.personal.quota || (isBengali ? 'প্রযোজ্য নহে (সাধারণ)' : 'Not Applicable (General)')}
          </span>
        )
      }
    ];

    return (
      <div key="govt-personal-table" className="border border-slate-800 rounded overflow-hidden mb-2 text-xs">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-slate-800">
            {serials.map((item, idx) => (
              <tr key={`serial-${item.no}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                <td className="w-8 p-1 sm:p-1.5 text-center font-bold text-slate-900 border-r border-slate-800 align-top">
                  {item.no}.
                </td>
                <td className="w-1/3 sm:w-48 p-1 sm:p-1.5 font-bold text-slate-800 border-r border-slate-800 align-top text-[11px] leading-snug">
                  {item.title}
                </td>
                <td className="p-1 sm:p-1.5 text-slate-900 align-top leading-snug">
                  {item.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 3. NUMBERED ACADEMIC QUALIFICATIONS TABLE (আইটেম ১২: শিক্ষাগত যোগ্যতার ছক)
  const renderEducation = () => {
    if (!options.showEducation || !data.education || data.education.length === 0) return null;

    return (
      <div key="govt-education" className="space-y-1 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
          <span className="font-black text-slate-950">{isBengali ? '১২.' : '12.'}</span>
          <span className="uppercase tracking-wide">{isBengali ? 'শিক্ষাগত যোগ্যতার বিবরণ:' : 'Academic Qualifications:'}</span>
        </div>

        <div className="border border-slate-800 rounded overflow-hidden">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead className="bg-slate-200/90 text-slate-900 font-bold border-b border-slate-800">
              <tr>
                <th className="p-1 border-r border-slate-800 text-center w-8">{isBengali ? 'ক্র:' : 'Sl'}</th>
                <th className="p-1 border-r border-slate-800">{isBengali ? 'পরীক্ষার নাম' : 'Exam Name'}</th>
                <th className="p-1 border-r border-slate-800">{isBengali ? 'বিষয় / বিভাগ' : 'Group / Major'}</th>
                <th className="p-1 border-r border-slate-800">{isBengali ? 'শিক্ষা প্রতিষ্ঠান' : 'Institution'}</th>
                <th className="p-1 border-r border-slate-800 text-center w-14">{isBengali ? 'পাশের সন' : 'Year'}</th>
                <th className="p-1 border-r border-slate-800">{isBengali ? 'বোর্ড / বিশ্ববিদ্যালয়' : 'Board/Univ'}</th>
                <th className="p-1 text-center w-16">{isBengali ? 'গ্রেড/বিভাগ' : 'Result'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.education.map((edu, idx) => (
                <tr key={edu.id || `edu-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="p-1 text-center font-bold text-slate-800 border-r border-slate-800">
                    {formatNum(idx + 1)}
                  </td>
                  <td className="p-1 font-bold text-slate-950 border-r border-slate-800">
                    {edu.degree}
                  </td>
                  <td className="p-1 text-slate-800 border-r border-slate-800">
                    {edu.group || (edu as any).field || '—'}
                  </td>
                  <td className="p-1 text-slate-800 border-r border-slate-800 leading-tight">
                    {edu.institute || (edu as any).institution}
                  </td>
                  <td className="p-1 text-center font-semibold text-slate-900 border-r border-slate-800 tabular-nums">
                    {formatNum(edu.year || (edu as any).startDate || '—')}
                  </td>
                  <td className="p-1 text-slate-800 border-r border-slate-800">
                    {edu.board || '—'}
                  </td>
                  <td className="p-1 text-center font-bold text-slate-950 tabular-nums">
                    {edu.result ? formatNum(edu.result) : ((edu as any).gpa ? formatNum((edu as any).gpa) : '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 4. NUMBERED EXTRA SKILLS & TRAINING (আইটেম ১৩: অতিরিক্ত যোগ্যতা ও প্রশিক্ষণ)
  const renderSkillsAndTraining = () => {
    const hasSkills = options.showSkills && data.skills && data.skills.length > 0;
    const hasCerts = data.certifications && data.certifications.length > 0;
    if (!hasSkills && !hasCerts) return null;

    const skillList = (data.skills || []).map(s => typeof s === 'string' ? s : s.name).slice(0, 8);

    return (
      <div key="govt-skills" className="space-y-1 mb-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <span className="font-black text-slate-950">{isBengali ? '১৩.' : '13.'}</span>
          <span className="uppercase tracking-wide">{isBengali ? 'অতিরিক্ত যোগ্যতা, কম্পিউটার দক্ষতা ও প্রশিক্ষণ:' : 'Additional Skills, Computer & Training:'}</span>
        </div>
        <div className="p-1.5 border border-slate-800 rounded bg-slate-50/50 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-800">
          {skillList.map((skill, sIdx) => (
            <span key={`sk-${sIdx}`} className="flex items-center gap-1">
              <span className="text-slate-400">•</span>
              <span className="font-semibold">{skill}</span>
            </span>
          ))}
          {hasCerts && data.certifications!.map((c, cIdx) => (
            <span key={`cert-${cIdx}`} className="flex items-center gap-1 text-emerald-950 font-bold">
              <span>★</span>
              <span>{c.name} ({c.issuer})</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  // 5. NUMBERED WORK EXPERIENCE (আইটেম ১৪: পূর্ববর্তী চাকুরীর অভিজ্ঞতা)
  const renderExperience = () => {
    if (!options.showExperience || !data.experience || data.experience.length === 0) return null;

    return (
      <div key="govt-exp" className="space-y-1 mb-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <span className="font-black text-slate-950">{isBengali ? '১৪.' : '14.'}</span>
          <span className="uppercase tracking-wide">{isBengali ? 'পূর্ববর্তী চাকরির অভিজ্ঞতা (যদি থাকে):' : 'Previous Job Experience (If any):'}</span>
        </div>

        <div className="border border-slate-800 rounded overflow-hidden">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead className="bg-slate-200/90 text-slate-900 font-bold border-b border-slate-800">
              <tr>
                <th className="p-1 border-r border-slate-800 text-center w-8">{isBengali ? 'ক্র:' : 'Sl'}</th>
                <th className="p-1 border-r border-slate-800">{isBengali ? 'পদের নাম' : 'Designation'}</th>
                <th className="p-1 border-r border-slate-800">{isBengali ? 'প্রতিষ্ঠান / দপ্তরের নাম' : 'Organization'}</th>
                <th className="p-1 border-r border-slate-800 text-center">{isBengali ? 'চাকরির মেয়াদকাল' : 'Duration'}</th>
                <th className="p-1">{isBengali ? 'দায়িত্ব / বিবরণ' : 'Key Responsibilities'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.experience.map((exp, idx) => (
                <tr key={exp.id || `exp-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="p-1 text-center font-bold text-slate-800 border-r border-slate-800">
                    {formatNum(idx + 1)}
                  </td>
                  <td className="p-1 font-bold text-slate-950 border-r border-slate-800">
                    {exp.position}
                  </td>
                  <td className="p-1 text-slate-800 border-r border-slate-800">
                    {exp.company}
                  </td>
                  <td className="p-1 text-center font-semibold text-slate-900 border-r border-slate-800 whitespace-nowrap">
                    {formatNum(exp.duration)}
                  </td>
                  <td className="p-1 text-slate-700 leading-tight">
                    {exp.description ? exp.description.slice(0, 100) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 6. NUMBERED DECLARATION & SIGNATURE (আইটেম ১৫ ও ১৬: অঙ্গীকারনামা ও আবেদনকারীর স্বাক্ষর)
  const renderDeclarationAndSignature = () => {
    const declarationText = data.declaration?.text || data.personal.declarationText || (
      isBengali
        ? "আমি অঙ্গীকার করিতেছি যে, আবেদনপত্রে বর্ণিত তথ্যাবলি সম্পূর্ণ সত্য ও নির্ভুল। ভবিষ্যতে কোনো তথ্য অসত্য বা অসঙ্গতিপূর্ণ প্রমাণিত হইলে যেকোনো পর্যায়ে আমার প্রার্থিতা বা নিয়োগ বাতিল বলিয়া গণ্য হইবে।"
        : "I hereby solemnly declare that all information stated in this application form is true, authentic and correct. If any information is found false or misrepresented at any stage, my candidature or employment shall be liable to cancellation."
    );

    const sigDate = data.declaration?.date || data.personal.signatureDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const sigPlace = data.declaration?.place || (data.personal.address ? data.personal.address.split(',')[0] : (isBengali ? 'ঢাকা' : 'Dhaka'));
    const sigImage = data.personal.signature || data.declaration?.signature;

    return (
      <div key="govt-declaration" className="mt-3 pt-2 border-t-2 border-slate-900 space-y-3 break-inside-avoid">
        {/* Solemn Declaration Text */}
        <div className="space-y-0.5 text-xs text-slate-900 leading-relaxed text-justify">
          <span className="font-black text-slate-950 mr-1.5">{isBengali ? '১৫. অঙ্গীকারনামা:' : '15. Declaration:'}</span>
          <span>{declarationText}</span>
        </div>

        {/* Date and Signature Two-Column Row */}
        <div className="flex justify-between items-end pt-2 text-xs">
          {/* Left: Date & Place */}
          <div className="space-y-1 text-slate-800 font-medium">
            <div>
              <strong>{isBengali ? 'তারিখ: ' : 'Date: '}</strong>
              <span>{formatNum(sigDate)}</span>
            </div>
            <div>
              <strong>{isBengali ? 'স্থান: ' : 'Place: '}</strong>
              <span>{sigPlace}</span>
            </div>
          </div>

          {/* Right: Candidate Signature */}
          <div className="flex flex-col items-center text-center">
            {sigImage ? (
              <div className="h-8 max-w-[140px] flex items-center justify-center mb-0.5">
                <img 
                  src={sigImage} 
                  alt="Candidate Signature" 
                  className="max-h-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div className="font-serif italic text-sm text-slate-800 mb-0.5">
                {data.personal.fullName}
              </div>
            )}
            <div className="w-40 border-t border-slate-900 pt-0.5 font-bold text-slate-950 text-xs">
              ({data.personal.fullNameBn || data.personal.fullName})
            </div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
              {isBengali ? 'আবেদনকারীর স্বাক্ষর' : 'Applicant\'s Signature'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE COMPILATION (Strict 1-Page by default)
  // ==========================================
  const effectivePageMode: PageMode = options.pageMode || '1-page';
  const effectiveMargin: PageMargin = options.pageMargin || 'compact';

  let pages: React.ReactNode[][] = [];

  if (effectivePageMode === '2-page' || options.multiPage) {
    // 2-Page mode:
    // Page 1: Top Header, Serialized Bio-Data (১-১১) & Academic Qualifications (১২)
    // Page 2: Skills & Training (১৩), Experience (১৪), Declaration & Signature (১৫)
    pages = [
      [renderHeader(), renderSerializedBioData(), renderEducation()].filter(Boolean),
      [renderSkillsAndTraining(), renderExperience(), renderDeclarationAndSignature()].filter(Boolean)
    ];
  } else {
    // 1-PAGE STRICT FIT (The standard required by all BD Government circulars)
    pages = [[
      renderHeader(),
      renderSerializedBioData(),
      renderEducation(),
      renderSkillsAndTraining(),
      renderExperience(),
      renderDeclarationAndSignature()
    ].filter(Boolean)];
  }

  return (
    <A4PageContainer
      pageMode={effectivePageMode}
      pageMargin={effectiveMargin}
      font={font}
      accentColor={accentColor}
      candidateName={data.personal.fullName}
      documentTitle={isBengali ? 'সরকারি চাকুরীর আবেদন ফরম' : 'Government Bio-Data Form'}
    >
      {pages.map((pageSections, pageIdx) => (
        <A4PageSheet
          key={`govt-page-${pageIdx}`}
          pageNumber={pageIdx + 1}
          totalPages={pages.length}
          margin={effectiveMargin}
          candidateName={data.personal.fullName}
          documentTitle={isBengali ? 'সরকারি চাকুরীর আবেদন ফরম' : 'Government Job Application'}
          accentColor={accentColor}
          font={font}
          scale={effectivePageMode === '1-page' ? 0.92 : 1}
        >
          <div className="w-full text-slate-950 flex flex-col justify-start" style={fontStyle}>
            {pageSections}
          </div>
        </A4PageSheet>
      ))}
    </A4PageContainer>
  );
};
