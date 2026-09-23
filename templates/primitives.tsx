import React from 'react';
import { 
  Mail, Phone, MapPin, Linkedin, Github, Globe, GraduationCap, 
  Briefcase, Code, FolderGit2, Facebook, Twitter, Award, 
  ShieldCheck, Languages as LangIcon, ExternalLink, Calendar, Check
} from 'lucide-react';
import { Language, FontSize, PrintOptions, WorkExperience, Education, Project, Certification, LanguageSkill, Award as AwardType } from '../types';

export const TRANSLATIONS = {
  en: {
    summary: "Executive Summary",
    careerObjective: "Career Objective",
    experience: "Work Experience",
    projects: "Featured Projects",
    skills: "Skills & Proficiencies",
    education: "Academic Qualifications",
    certifications: "Certifications",
    languages: "Languages",
    awards: "Honors & Awards",
    contact: "Contact & Links",
    phone: "Phone",
    email: "Email",
    address: "Location",
    website: "Website",
    personalDetails: "Personal Details",
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    dob: "Date of Birth",
    nationality: "Nationality",
    religion: "Religion",
    maritalStatus: "Marital Status",
    bloodGroup: "Blood Group",
    gender: "Gender",
    nid: "National ID / NID",
    presentAddress: "Present Address",
    permanentAddress: "Permanent Address",
    references: "References",
    declaration: "Declaration",
    signature: "Signature",
    date: "Date",
    examDegree: "Exam / Degree",
    boardUniv: "Board / University",
    passingYear: "Passing Year",
    groupMajor: "Group / Major",
    resultGpa: "Result / GPA"
  },
  bn: {
    summary: "পেশাগত সারসংক্ষেপ",
    careerObjective: "ক্যারিয়ার উদ্দেশ্য",
    experience: "কাজের অভিজ্ঞতা",
    projects: "উল্লেখযোগ্য প্রজেক্টসমূহ",
    skills: "দক্ষতা ও পারদর্শিতা",
    education: "শিক্ষাগত যোগ্যতা",
    certifications: "সার্টিফিকেশন ও লাইসেন্স",
    languages: "ভাষাগত দক্ষতা",
    awards: "সম্মাননা ও পুরস্কার",
    contact: "যোগাযোগ ও লিঙ্ক",
    phone: "ফোন",
    email: "ইমেইল",
    address: "ঠিকানা",
    website: "ওয়েবসাইট",
    personalDetails: "ব্যক্তিগত তথ্যাবলী",
    fatherName: "পিতার নাম",
    motherName: "মাতার নাম",
    dob: "জন্ম তারিখ",
    nationality: "জাতীয়তা",
    religion: "ধর্ম",
    maritalStatus: "বৈবাহিক অবস্থা",
    bloodGroup: "রক্তের গ্রুপ",
    gender: "লিঙ্গ",
    nid: "জাতীয় পরিচয়পত্র নম্বর",
    presentAddress: "বর্তমান ঠিকানা",
    permanentAddress: "স্থায়ী ঠিকানা",
    references: "রেফারেন্স",
    declaration: "ঘোষণাপত্র",
    signature: "স্বাক্ষর",
    date: "তারিখ",
    examDegree: "পরীক্ষা / ডিগ্রি",
    boardUniv: "বোর্ড / বিশ্ববিদ্যালয়",
    passingYear: "পাসের সন",
    groupMajor: "গ্রুপ / বিভাগ",
    resultGpa: "ফলাফল / জিপিএ"
  }
};

export const convertToBengaliDigits = (str: string) => {
  const digits: Record<string, string> = { 
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', 
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' 
  };
  return str.replace(/[0-9]/g, (w) => digits[w] || w);
};

export const getSizeConfig = (fontSize?: FontSize | string) => {
  const normalized = (fontSize === 'compact' || fontSize === 'spacious') ? fontSize : 'normal';
  if (normalized === 'compact') {
    return {
      name: 'text-2xl font-black',
      title: 'text-xs font-semibold',
      heading: 'text-xs font-bold',
      body: 'text-[11px] leading-snug',
      small: 'text-[10px]',
      padding: 'p-5 sm:p-6',
      gap: 'space-y-2.5',
      itemGap: 'space-y-1.5'
    };
  }
  if (fontSize === 'spacious') {
    return {
      name: 'text-4xl font-black',
      title: 'text-base font-medium',
      heading: 'text-base font-bold',
      body: 'text-sm leading-relaxed',
      small: 'text-xs',
      padding: 'p-8 sm:p-12',
      gap: 'space-y-6',
      itemGap: 'space-y-3'
    };
  }
  return {
    name: 'text-3xl font-extrabold',
    title: 'text-sm font-medium',
    heading: 'text-sm font-bold',
    body: 'text-xs leading-relaxed',
    small: 'text-[11px]',
    padding: 'p-6 sm:p-8',
    gap: 'space-y-4',
    itemGap: 'space-y-2'
  };
};

export interface SectionTitleProps {
  title: string;
  variant?: 'underline' | 'pill' | 'banner' | 'left-bar' | 'double-line' | 'terminal' | 'minimal' | 'serif-line' | 'boxed';
  accentColor?: string;
  sizeClass?: string;
  icon?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  variant = 'underline',
  accentColor = '#2563eb',
  sizeClass = 'text-xs sm:text-sm',
  icon
}) => {
  if (variant === 'banner') {
    return (
      <div 
        style={{ backgroundColor: accentColor }}
        className="text-white px-3 py-1 rounded-md flex items-center gap-2 mb-2 uppercase font-extrabold tracking-wider text-[11px]"
      >
        {icon}
        <span>{title}</span>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className="flex items-center gap-2 mb-2.5">
        <span 
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          className="px-2.5 py-0.5 rounded-full font-extrabold tracking-wider uppercase text-[10px] sm:text-[11px] inline-flex items-center gap-1.5"
        >
          {icon}
          {title}
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
      </div>
    );
  }

  if (variant === 'left-bar') {
    return (
      <div 
        style={{ borderLeftColor: accentColor }}
        className="border-l-4 pl-2.5 mb-2.5 flex items-center gap-2"
      >
        <span className={`font-bold uppercase tracking-wider text-slate-900 ${sizeClass}`}>
          {title}
        </span>
      </div>
    );
  }

  if (variant === 'terminal') {
    return (
      <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-emerald-600 font-bold border-b border-emerald-500/30 pb-1">
        <span>$</span>
        <span className="uppercase tracking-wider">{title}</span>
        <span className="animate-pulse">_</span>
      </div>
    );
  }

  if (variant === 'double-line') {
    return (
      <div className="mb-2.5">
        <div className={`font-black uppercase tracking-widest text-slate-900 ${sizeClass} mb-1 flex items-center gap-2`}>
          {icon}
          <span>{title}</span>
        </div>
        <div className="border-t-2 border-b border-slate-900 h-1"></div>
      </div>
    );
  }

  if (variant === 'serif-line') {
    return (
      <div className="flex items-center gap-3 mb-2.5 text-center">
        <div className="flex-1 h-px bg-stone-300"></div>
        <span className={`font-serif italic tracking-wide text-stone-800 ${sizeClass}`}>
          {title}
        </span>
        <div className="flex-1 h-px bg-stone-300"></div>
      </div>
    );
  }

  if (variant === 'boxed') {
    return (
      <div 
        style={{ borderColor: accentColor }}
        className="border-b-2 pb-1 mb-2.5 flex items-center justify-between"
      >
        <span 
          style={{ color: accentColor }}
          className={`font-black uppercase tracking-wider ${sizeClass} flex items-center gap-1.5`}
        >
          {icon}
          <span>{title}</span>
        </span>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="mb-2">
        <span className={`font-extrabold uppercase tracking-widest text-slate-400 text-[10px]`}>
          {title}
        </span>
      </div>
    );
  }

  // Default 'underline'
  return (
    <div 
      style={{ borderBottomColor: accentColor }}
      className="border-b pb-1 mb-2 flex items-center gap-1.5"
    >
      {icon}
      <span 
        style={{ color: accentColor }}
        className={`font-bold uppercase tracking-wider ${sizeClass}`}
      >
        {title}
      </span>
    </div>
  );
};
