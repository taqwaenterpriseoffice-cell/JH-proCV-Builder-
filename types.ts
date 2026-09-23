
export interface PersonalInfo {
  fullName: string;
  fullNameBn?: string; // প্রার্থীর নাম (বাংলায়)
  title: string;
  email: string;
  phone: string;
  address: string; // Present Address
  permanentAddress?: string; // Permanent Address
  homeDistrict?: string; // নিজ জেলা (Home District)
  dob: string;
  ageText?: string; // বয়স (বছর-মাস-দিন)
  circularNo?: string; // সার্কুলার / বিজ্ঞপ্তি নং
  circularDate?: string; // বিজ্ঞপ্তির তারিখ
  quota?: string; // কোটা (মুক্তিযোদ্ধা, প্রতিবন্ধী, সাধারণ, ইত্যাদি)
  photo?: string; // Passport Photo 1
  photo2?: string; // Passport Photo 2 (Dual placement)
  photo3?: string; // Passport Photo 3 (Triple placement)
  photoCount?: number; // 0, 1, 2, or 3
  summary: string;
  careerObjective?: string;
  website?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  religion?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  gender?: string;
  nid?: string; // National ID or Birth Certificate No.
  signature?: string; // Digital signature image data URL or text
  signatureDate?: string;
  declarationText?: string;
}

export interface Education {
  id: string;
  degree: string;
  institute: string;
  year: string;
  result: string;
  location?: string;
  description?: string;
  board?: string; // e.g. Dhaka, Chittagong, Rajshahi, Technical Board
  group?: string; // e.g. Science, Business Studies, Humanities, CSE, EEE
}

export interface Reference {
  id: string;
  name: string;
  designation: string;
  organization: string;
  phone: string;
  email: string;
  address?: string;
  relation?: string;
}

export interface DeclarationInfo {
  enabled: boolean;
  text: string;
  date?: string;
  place?: string;
  signature?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  location?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string;
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageSkill {
  id: string;
  name: string;
  level: string; // e.g. Native, Fluent, Professional, Intermediate, Basic
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description?: string;
}

export interface SocialLinks {
  facebook: string;
  linkedin: string;
  github: string;
  portfolio: string;
  twitter?: string;
}

export interface CoverLetterData {
  recipientName: string;
  recipientDesignation: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  circularReference?: string;
  date: string;
  salutation: string;
  subject?: string;
  letterBody: string;
  closing: string;
  signOffName: string;
  signOffTitle?: string;
  signOffPhone?: string;
  signOffEmail?: string;
  signOffAddress?: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  skills: string[];
  socials: SocialLinks;
  certifications?: Certification[];
  languages?: LanguageSkill[];
  awards?: Award[];
  references?: Reference[];
  declaration?: DeclarationInfo;
  coverLetter?: CoverLetterData;
}

export type StandardThemeType = 
  | 'modern' | 'minimal' | 'corporate' | 'dark' | 'creative' | 'classic' 
  | 'tech' | 'executive' | 'simple' | 'ats' | 'nordic' | 'compact'
  | 'bd-standard' | 'bd-executive' | 'bd-govt' | 'bd-triple-photo' | 'bd-modern-it' | 'bd-bilingual';

export type ThemeType = StandardThemeType | (string & {});
export type Language = 'en' | 'bn';
export type FontSize = 'compact' | 'normal' | 'spacious';
export type ActiveView = 'dashboard' | 'templates' | 'edit' | 'preview' | 'split' | 'customize' | 'cover-letter';

export interface ThemeOption {
  id: ThemeType;
  label: string;
  category: string;
  color: string;
  description: string;
  recommendedFor?: string;
  atsScore?: number;
  tags?: string[];
  layoutType?: 'single-column' | 'two-column' | 'header-accent' | 'minimal' | 'two-column-left' | 'two-column-right' | 'grid-cards' | 'timeline' | 'academic' | 'compact' | 'bangladesh-cv';
}

export type PageMode = 'auto' | '1-page' | '2-page' | '3-page';
export type PageMargin = 'compact' | 'normal' | 'spacious';

export interface PrintOptions {
  showPhoto: boolean;
  photoCount?: number; // 0, 1, 2, or 3
  showSummary: boolean;
  showCareerObjective?: boolean;
  showEducation: boolean;
  showExperience: boolean;
  showProjects: boolean;
  showSkills: boolean;
  showSocials: boolean;
  showCertifications?: boolean;
  showLanguages?: boolean;
  showAwards?: boolean;
  // Authentic Bangladesh / Bio-Data Controls:
  showBioData?: boolean;
  showFatherMother?: boolean;
  showAddresses?: boolean; // Present & Permanent Address
  showReligion?: boolean;
  showMaritalStatus?: boolean;
  showOtherPersonal?: boolean; // Blood Group, Gender, NID
  showReferences?: boolean;
  showDeclaration?: boolean;
  showSignature?: boolean;
  // A4 Layout, Pagination & Margins:
  multiPage?: boolean;
  pageMode?: PageMode;
  pageMargin?: PageMargin;
}

export interface ResumeDocument {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  data: ResumeData;
  theme: ThemeType;
  font: string;
  language: Language;
  printOptions: PrintOptions;
  accentColor?: string;
  fontSize?: FontSize;
}

export interface AppState {
  data: ResumeData;
  theme: ThemeType;
  step: 'edit' | 'preview';
  language: Language;
}

