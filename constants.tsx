
import { ResumeData, ThemeType, PrintOptions, ResumeDocument, ThemeOption } from './types';

export const DEFAULT_PRINT_OPTIONS: PrintOptions = {
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
  multiPage: true
};

export const DEFAULT_DATA: ResumeData = {
  personal: {
    fullName: 'Jahirul Hasan Anik',
    fullNameBn: 'মোঃ জহিরুল হাসান অনিক',
    title: 'Lead Full-Stack Software Engineer & Solutions Architect',
    email: 'jhanik7577@gmail.com',
    phone: '+880 1712-345678',
    address: 'House #42, Road #11, Sector-04, Uttara, Dhaka-1230, Bangladesh',
    permanentAddress: 'Vill: Krishnapur, P.O: Chandpur Sadar, Dist: Chandpur-3600, Bangladesh',
    homeDistrict: 'চাঁদপুর (ঢাকা বিভাগ)',
    dob: '1995-04-12',
    ageText: '৩১ বছর ০৫ মাস ১১ দিন',
    circularNo: 'জনপ্র/নিয়োগ-২০২৬/০৪',
    circularDate: '2026-09-01',
    quota: 'প্রযোজ্য নহে (সাধারণ কোটা)',
    summary: 'Results-driven Lead Software Architect with 8+ years of expertise in distributed cloud systems, modern web microservices, and engineering mentorship. Successfully spearheaded platform migrations scaling to 2M+ active users while reducing cloud infrastructure costs by 32%.',
    careerObjective: 'To pursue a challenging career in a progressive tech organization where my software engineering acumen, cloud architectural design, and leadership skills can contribute to impactful digital transformation and organizational growth.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300',
    photoCount: 1,
    website: 'https://jhsoft.online',
    nationality: 'বাংলাদেশী',
    fatherName: 'মোঃ নুরুল ইসলাম',
    motherName: 'রাশেদা বেগম',
    religion: 'ইসলাম',
    maritalStatus: 'অবিবাহিত',
    bloodGroup: 'B+ (Positive)',
    gender: 'পুরুষ',
    nid: '19951324560000452',
    declarationText: 'আমি অঙ্গীকার করিতেছি যে, আবেদনপত্রে বর্ণিত তথ্যাবলি সম্পূর্ণ সত্য ও নির্ভুল। কোন তথ্য অসত্য বা অসঙ্গতিপূর্ণ প্রমাণিত হইলে যেকোনো পর্যায়ে আমার প্রার্থিতা বা নিয়োগ বাতিল বলিয়া গণ্য হইবে।'
  },
  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. in Computer Science & Engineering',
      institute: 'University of Dhaka',
      board: 'University of Dhaka',
      group: 'Computer Science & Engineering',
      year: '2014 - 2018',
      result: 'CGPA 3.86 / 4.00',
      location: 'Dhaka, Bangladesh',
      description: 'Graduated with Dean\'s Honor Award. Thesis on Distributed Consensus in Cloud Systems.'
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary Certificate (H.S.C.)',
      institute: 'Notre Dame College, Dhaka',
      board: 'Dhaka Board',
      group: 'Science',
      year: '2012 - 2014',
      result: 'GPA 5.00 / 5.00 (Golden A+)',
      location: 'Dhaka, Bangladesh'
    },
    {
      id: 'edu-3',
      degree: 'Secondary School Certificate (S.S.C.)',
      institute: 'Govt. Laboratory High School',
      board: 'Dhaka Board',
      group: 'Science',
      year: '2010 - 2012',
      result: 'GPA 5.00 / 5.00 (Golden A+)',
      location: 'Dhaka, Bangladesh'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Brain Station 23 / Tech Innovators Global',
      position: 'Staff Solutions Architect & Lead Engineer',
      duration: '2021 - Present',
      location: 'Dhaka & San Francisco',
      description: '• Architected resilient multi-region cloud services supporting 2M+ daily active users with 99.99% uptime.\n• Mentored and led a cross-functional team of 14 senior engineers across frontend, backend, and DevOps.\n• Cut container build and deployment times by 65% through automated CI/CD pipelines.'
    },
    {
      id: 'exp-2',
      company: 'NextGen Cloud Systems Bangladesh',
      position: 'Senior Full-Stack Engineer',
      duration: '2018 - 2021',
      location: 'Dhaka, Bangladesh',
      description: '• Designed and launched core fintech and banking integration workflows processing $40M+ in ARR.\n• Spearheaded the migration of monolithic legacy code into high-performance TypeScript and React microservices.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Enterprise Cloud Orchestrator',
      description: 'High-throughput microservices gateway featuring live telemetry, role-based access control, and automated failover.',
      tech: 'React, TypeScript, Node.js, Docker, Kubernetes, Tailwind CSS',
      link: 'https://github.com/jhsoft/orchestrator'
    },
    {
      id: 'proj-2',
      title: 'Real-Time Collaboration Canvas & CV Builder',
      description: 'Multi-page document engine with live PDF rendering, A4 page break pagination, and instant SVG export.',
      tech: 'WebSockets, React 19, TypeScript, Vite, Canvas API',
      link: 'https://demo.jhsoft.online/cv'
    }
  ],
  skills: [
    'TypeScript',
    'React & Next.js',
    'Node.js & Express',
    'Cloud Architecture (AWS / GCP)',
    'Docker & Kubernetes',
    'RESTful APIs & GraphQL',
    'PostgreSQL & MongoDB',
    'Tailwind CSS',
    'CI/CD Pipelines',
    'Engineering Leadership',
    'Bangla & English Typing'
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      date: '2023',
      url: 'aws.amazon.com/verification'
    },
    {
      id: 'cert-2',
      name: 'Google Cloud Certified Professional Cloud Architect',
      issuer: 'Google Cloud',
      date: '2022'
    }
  ],
  languages: [
    { id: 'lang-1', name: 'English', level: 'Professional Working Fluency' },
    { id: 'lang-2', name: 'Bengali (বাংলা)', level: 'Native / Bilingual' },
    { id: 'lang-3', name: 'German', level: 'Elementary' }
  ],
  awards: [
    {
      id: 'award-1',
      title: 'National ICT Excellence Award',
      issuer: 'ICT Division, Bangladesh',
      year: '2023',
      description: 'Awarded for architectural contribution in scalable fintech and public digital infrastructure.'
    }
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Prof. Dr. Mohammad Shamsul Alam',
      designation: 'Professor & Former Chairman',
      organization: 'Department of Computer Science & Engineering, University of Dhaka',
      phone: '+880 1711-234567',
      email: 'shamsul.alam@du.ac.bd',
      relation: 'Academic Supervisor'
    },
    {
      id: 'ref-2',
      name: 'Tanveer Ahmed',
      designation: 'Vice President of Technology',
      organization: 'Brain Station 23 / Global FinTech Solutions',
      phone: '+880 1819-987654',
      email: 'tanveer.ahmed@example.com',
      relation: 'Former Senior Director'
    }
  ],
  declaration: {
    enabled: true,
    text: 'I hereby declare that all the information stated in this Curriculum Vitae is true, correct, and authentic to the best of my knowledge and belief.',
    date: '17 Sep 2026',
    place: 'Dhaka, Bangladesh'
  },
  socials: {
    facebook: '',
    linkedin: 'linkedin.com/in/jh-anik',
    github: 'github.com/jh-anik',
    portfolio: 'jhsoft.online',
    twitter: 'twitter.com/jh_anik'
  }
};

import { TEMPLATE_REGISTRY } from './templates';

export const THEMES: ThemeOption[] = TEMPLATE_REGISTRY;

export const ACCENT_COLORS = [
  { id: 'blue', label: 'Royal Blue', hex: '#2563eb', class: 'bg-blue-600', textClass: 'text-blue-600', borderClass: 'border-blue-600' },
  { id: 'slate', label: 'Slate Navy', hex: '#334155', class: 'bg-slate-700', textClass: 'text-slate-700', borderClass: 'border-slate-700' },
  { id: 'emerald', label: 'Forest Emerald', hex: '#059669', class: 'bg-emerald-600', textClass: 'text-emerald-600', borderClass: 'border-emerald-600' },
  { id: 'indigo', label: 'Deep Indigo', hex: '#4f46e5', class: 'bg-indigo-600', textClass: 'text-indigo-600', borderClass: 'border-indigo-600' },
  { id: 'teal', label: 'Ocean Teal', hex: '#0d9488', class: 'bg-teal-600', textClass: 'text-teal-600', borderClass: 'border-teal-600' },
  { id: 'crimson', label: 'Ruby Crimson', hex: '#dc2626', class: 'bg-red-600', textClass: 'text-red-600', borderClass: 'border-red-600' },
  { id: 'amber', label: 'Bronze Amber', hex: '#d97706', class: 'bg-amber-600', textClass: 'text-amber-600', borderClass: 'border-amber-600' },
  { id: 'mono', label: 'Pure Charcoal', hex: '#18181b', class: 'bg-zinc-900', textClass: 'text-zinc-900', borderClass: 'border-zinc-900' },
];

export const FONTS = [
  { id: 'Inter', label: 'Inter (Modern Sans)', family: "'Inter', sans-serif" },
  { id: 'Poppins', label: 'Poppins (Geometric)', family: "'Poppins', sans-serif" },
  { id: 'Montserrat', label: 'Montserrat (Clean Corporate)', family: "'Montserrat', sans-serif" },
  { id: 'Lato', label: 'Lato (Humanist)', family: "'Lato', sans-serif" },
  { id: 'Open Sans', label: 'Open Sans (Neutral)', family: "'Open Sans', sans-serif" },
  { id: 'Roboto', label: 'Roboto (Productive)', family: "'Roboto', sans-serif" },
  { id: 'Libre Baskerville', label: 'Libre Baskerville (Classic Serif)', family: "'Libre Baskerville', serif" },
  { id: 'JetBrains Mono', label: 'JetBrains Mono (Developer)', family: "'JetBrains Mono', monospace" },
  { id: 'Roboto Condensed', label: 'Roboto Condensed (High Density)', family: "'Roboto Condensed', sans-serif" },
  { id: 'SolaimanLipi', label: 'SolaimanLipi (সোলায়মানলিপি - সরকারি ও আদালত মান)', family: "'SolaimanLipi', 'Kalpurush', 'Hind Siliguri', sans-serif" },
  { id: 'Kalpurush', label: 'Kalpurush (কালপুরুষ - প্রমিত পত্রিকা ও প্রকাশনা)', family: "'Kalpurush', 'SolaimanLipi', 'Hind Siliguri', sans-serif" },
  { id: 'Hind Siliguri', label: 'Hind Siliguri (হিন্ড শিলিগুড়ি - আধুনিক ওয়েব)', family: "'Hind Siliguri', 'Inter', sans-serif" },
  { id: 'Noto Sans Bengali', label: 'Noto Sans Bengali (গুগল ইউনিকোড বাংলা)', family: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif" },
  { id: 'Noto Serif Bengali', label: 'Noto Serif Bengali (সেরিফ ফরমাল বাংলা)', family: "'Noto Serif Bengali', 'SolaimanLipi', serif" },
  { id: 'Anek Bangla', label: 'Anek Bangla (অনেক বাংলা - কম্প্যাক্ট ডিসপ্লে)', family: "'Anek Bangla', 'Hind Siliguri', sans-serif" },
];

export const INITIAL_RESUMES: ResumeDocument[] = [
  {
    id: 'default-resume-1',
    title: 'Lead Software Architect CV',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    data: DEFAULT_DATA,
    theme: 'modern',
    font: 'Inter',
    language: 'en',
    printOptions: DEFAULT_PRINT_OPTIONS,
    accentColor: '#2563eb',
    fontSize: 'normal'
  }
];

