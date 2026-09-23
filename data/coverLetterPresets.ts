import { CoverLetterData, ResumeData } from '../types';

export interface CoverLetterPreset {
  id: string;
  label: string;
  category: string;
  badge: string;
  description: string;
  getData: (resume: ResumeData) => CoverLetterData;
}

export const COVER_LETTER_PRESETS: CoverLetterPreset[] = [
  {
    id: 'tech-lead',
    label: 'IT & Software Engineering',
    category: 'Technology',
    badge: 'Popular',
    description: 'Tailored for Software Engineers, Full-Stack Developers, and Tech Leads.',
    getData: (resume: ResumeData): CoverLetterData => {
      const name = resume.personal.fullName || 'Candidate Name';
      const title = resume.personal.title || 'Software Engineer';
      return {
        recipientName: 'The Hiring Manager',
        recipientDesignation: 'Head of Engineering / Human Resources',
        companyName: 'Leading Technology Ltd.',
        companyAddress: 'Gulshan-2, Dhaka-1212, Bangladesh',
        jobTitle: title,
        circularReference: 'Ref: IT-DEV-2026',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        salutation: 'Dear Hiring Manager,',
        subject: `Application for the position of ${title}`,
        letterBody: `I am writing to express my eager interest in the ${title} position at your organization. Having followed your company's impressive milestones in digital products and engineering innovation, I am excited about the opportunity to bring my hands-on problem-solving abilities and software engineering expertise to your team.

Throughout my professional career, I have focused on designing scalable system architectures, optimizing application performance, and implementing robust clean-code standards. In my previous experiences, I have collaborated closely with cross-functional teams to deliver enterprise-grade features on schedule, significantly improving system throughput and enhancing user satisfaction.

My core technical competencies include modern web frameworks, API design, database modeling, and automated cloud workflows. Beyond coding, I take pride in mentoring junior developers, conducting rigorous code reviews, and fostering an agile, collaborative team culture that thrives under deadline pressures.

I am enthusiastic about the prospect of discussing how my technical background and dedicated work ethic align with your development roadmaps. Thank you for your time and kind consideration.`,
        closing: 'Sincerely,',
        signOffName: name,
        signOffTitle: title,
        signOffPhone: resume.personal.phone || '',
        signOffEmail: resume.personal.email || '',
        signOffAddress: resume.personal.address || ''
      };
    }
  },
  {
    id: 'fresher-graduate',
    label: 'Fresh Graduate / Entry Level',
    category: 'Fresher',
    badge: 'High Conversion',
    description: 'Ideal for university graduates with academic projects, enthusiasm, and rapid learning.',
    getData: (resume: ResumeData): CoverLetterData => {
      const name = resume.personal.fullName || 'Candidate Name';
      const latestEdu = resume.education && resume.education.length > 0 ? resume.education[0] : null;
      const degreeText = latestEdu ? `${latestEdu.degree} from ${latestEdu.institute}` : 'my undergraduate degree';
      return {
        recipientName: 'The Talent Acquisition Team',
        recipientDesignation: 'Human Resources Department',
        companyName: 'Esteemed Organization',
        companyAddress: 'Dhaka, Bangladesh',
        jobTitle: 'Management Trainee / Entry Level Executive',
        circularReference: 'Ref: Fresh Talent Intake 2026',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        salutation: 'Dear Hiring Team,',
        subject: 'Application for Entry-Level Trainee / Executive Position',
        letterBody: `I am writing with great enthusiasm to submit my candidature for the Management Trainee / Entry-Level Executive opening at your esteemed company. Having recently completed ${degreeText}, I am eager to embark on my professional journey with an industry leader known for excellence and employee development.

During my academic tenure, I consistently demonstrated strong analytical problem-solving, teamwork, and proactive communication. Through rigorous coursework, hands-on projects, and co-curricular leadership responsibilities, I developed a solid foundation in structured research, data analysis, and professional presentation.

What sets me apart is my intense curiosity, quick learning curve, and dedication to exceeding expectations. I am enthusiastic about applying my theoretical foundation to solve real-world operational challenges while absorbing guidance from your seasoned professionals.

I welcome the opportunity for an interview to elaborate on how my drive, adaptability, and academic training can add immediate value to your organization. Thank you for reviewing my application.`,
        closing: 'Respectfully yours,',
        signOffName: name,
        signOffTitle: 'Entry-Level Candidate',
        signOffPhone: resume.personal.phone || '',
        signOffEmail: resume.personal.email || '',
        signOffAddress: resume.personal.address || ''
      };
    }
  },
  {
    id: 'banking-finance',
    label: 'Banking & Financial Services',
    category: 'Finance',
    badge: 'Formal BD Standard',
    description: 'Formatted for Private/Govt Banks, Accounts, Auditing, and Corporate Finance.',
    getData: (resume: ResumeData): CoverLetterData => {
      const name = resume.personal.fullName || 'Candidate Name';
      return {
        recipientName: 'The Head of Human Resources',
        recipientDesignation: 'Human Resources Division',
        companyName: 'Renowned Commercial Bank / Financial Institution',
        companyAddress: 'Motijheel C/A, Dhaka-1000, Bangladesh',
        jobTitle: 'Officer / Executive (Finance & Accounts)',
        circularReference: 'Circular Ref: HRD/REC/2026/FIN',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        salutation: 'Sir/Madam,',
        subject: 'Application for the position of Officer / Executive (Finance & Accounts)',
        letterBody: `In response to your published job circular, I humbly offer myself as a candidate for the post of Officer / Executive (Finance & Accounts) in your prestigious financial institution.

With a comprehensive academic background in business and finance, combined with practical exposure to financial reporting, reconciliation, and regulatory compliance, I possess the analytical precision required for this role. I have developed high proficiency in accounting spreadsheets, audit preparation, financial statement analysis, and internal fiscal controls.

Integrity, meticulous attention to numerical detail, and adherence to central banking guidelines have always formed the bedrock of my professional conduct. I am confident in my capacity to maintain flawless ledger accuracy, assist in liquidity forecasts, and uphold your institution's reputation for financial reliability.

Enclosed herewith is my detailed Curriculum Vitae for your kind perusal. Should my credentials satisfy your selection criteria, I look forward to participating in the upcoming written exam or interview.`,
        closing: 'Yours faithfully,',
        signOffName: name,
        signOffTitle: 'Finance & Banking Professional',
        signOffPhone: resume.personal.phone || '',
        signOffEmail: resume.personal.email || '',
        signOffAddress: resume.personal.address || ''
      };
    }
  },
  {
    id: 'sales-marketing',
    label: 'Sales & Corporate Marketing',
    category: 'Commercial',
    badge: 'Growth Focused',
    description: 'High-impact pitch for Business Development, Digital Marketing, and Sales Managers.',
    getData: (resume: ResumeData): CoverLetterData => {
      const name = resume.personal.fullName || 'Candidate Name';
      return {
        recipientName: 'The Director of Business Growth',
        recipientDesignation: 'Commercial & Marketing Division',
        companyName: 'FMCG / Corporate Enterprise',
        companyAddress: 'Banani, Dhaka-1213, Bangladesh',
        jobTitle: 'Assistant Manager - Business Development & Marketing',
        circularReference: 'Ref: MKTG-GROWTH-2026',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        salutation: 'Dear Hiring Manager,',
        subject: 'Application for Assistant Manager - Business Development & Marketing',
        letterBody: `I am writing to express my keen interest in the Assistant Manager - Business Development & Marketing position at your organization. In today's competitive commercial landscape, sustained revenue growth demands an agile blend of market intelligence, relationship building, and data-driven customer acquisition—skills I have cultivated with proven success.

Over my career, I have executed targeted marketing campaigns and built distributor relationships that consistently achieved and exceeded territory sales targets. I have a proven track record of identifying untapped consumer segments, negotiating high-value corporate deals, and orchestrating digital engagement strategies that enhanced brand equity.

My proactive communication style, analytical approach to CAC/LTV metrics, and passion for consumer psychology empower me to lead sales teams toward sustainable quarterly gains. I am energized by the opportunity to apply these strategic capabilities to expand your market footprint.

I look forward to discussing how my commercial acumen and revenue-focused mindset can benefit your growth objectives in a direct interview.`,
        closing: 'Warm regards,',
        signOffName: name,
        signOffTitle: 'Business Development Specialist',
        signOffPhone: resume.personal.phone || '',
        signOffEmail: resume.personal.email || '',
        signOffAddress: resume.personal.address || ''
      };
    }
  },
  {
    id: 'ngo-development',
    label: 'NGO & Development Sector',
    category: 'Development',
    badge: 'Field & Project',
    description: 'Crafted for BRAC, UNDP, icddr,b, USAID partners, and national humanitarian missions.',
    getData: (resume: ResumeData): CoverLetterData => {
      const name = resume.personal.fullName || 'Candidate Name';
      return {
        recipientName: 'The Country Representative / HR Lead',
        recipientDesignation: 'People & Culture Unit',
        companyName: 'International Development Organization / NGO',
        companyAddress: 'Mohakhali / Baridhara Diplomatic Zone, Dhaka',
        jobTitle: 'Project Officer - Monitoring & Community Development',
        circularReference: 'Ref: NGO/DEV/PROJECT/2026',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        salutation: 'Dear Recruitment Committee,',
        subject: 'Application for Project Officer - Community Development & Operations',
        letterBody: `I am writing to submit my application for the Project Officer position with your reputable development mission. Having long admired your sustainable grassroots interventions and humanitarian initiatives across Bangladesh, I am deeply inspired to contribute my project coordination and community engagement skills to your team.

My background encompasses field operations, stakeholder coordination with local government bodies, and quantitative baseline surveys. I am experienced in conducting structured focus group discussions, preparing donor-compliant progress reports, and monitoring key program milestones to ensure timely and ethical resource deployment.

Having worked in diverse field environments, I value cultural empathy, transparency, and collaborative problem-solving under challenging logistical conditions. I am dedicated to driving sustainable social impact while adhering strictly to international humanitarian standards and child-safeguarding policies.

I welcome the opportunity to present my dedication and qualifications in an interview. Thank you for your consideration of my application.`,
        closing: 'Respectfully yours,',
        signOffName: name,
        signOffTitle: 'Development Practitioner',
        signOffPhone: resume.personal.phone || '',
        signOffEmail: resume.personal.email || '',
        signOffAddress: resume.personal.address || ''
      };
    }
  },
  {
    id: 'bangla-formal-application',
    label: 'বাংলা প্রমিত আবেদনপত্র (সরকারি/বেসরকারি দরখাস্ত)',
    category: 'Bangla Standard',
    badge: 'বাংলাদেশ ফরম্যাট',
    description: 'বাংলাদেশের প্রচলিত সরকারি ও বেসরকারি চাকরির জন্য সম্পূর্ণ প্রমিত বাংলা দরখাস্ত ও কভার লেটার।',
    getData: (resume: ResumeData): CoverLetterData => {
      const name = resume.personal.fullName || 'প্রার্থীর নাম';
      const address = resume.personal.address || resume.personal.permanentAddress || 'ঢাকা, বাংলাদেশ';
      return {
        recipientName: 'বরাবর, ব্যবস্থাপনা পরিচালক / নিয়োগকারী কর্তৃপক্ষ',
        recipientDesignation: 'মানবসম্পদ বিভাগ',
        companyName: 'প্রতিষ্ঠানের নাম',
        companyAddress: 'মতিঝিল বা/এ, ঢাকা-১০০০',
        jobTitle: 'অফিসার / এক্সিকিউটিভ',
        circularReference: 'সূত্র: প্রকাশিত নিয়োগ বিজ্ঞপ্তি - ২০২৬',
        date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        salutation: 'মহোদয়,',
        subject: 'বিষয়: ‘অফিসার / এক্সিকিউটিভ’ পদে নিয়োগের জন্য আবেদন।',
        letterBody: `যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আপনার প্রতিষ্ঠানে সম্প্রতি প্রকাশিত নিয়োগ বিজ্ঞপ্তির মাধ্যমে আমি জানতে পারলাম যে কিছু সংখ্যক ‘অফিসার / এক্সিকিউটিভ’ পদে উপযুক্ত জনবল নিয়োগ করা হইবে। আমি উক্ত পদের জন্য নিজেকে একজন আগ্রহী ও যোগ্য প্রার্থী হিসেবে বিবেচনা করিয়া আবেদন পেশ করিতেছি।

আমার শিক্ষাগত যোগ্যতা, পেশাগত অভিজ্ঞতা এবং ব্যক্তিগত বিস্তারিত তথ্যাবলী সংযুক্ত জীবনবৃত্তান্তে (Curriculum Vitae) যথাযথভাবে উল্লেখ করা হইয়াছে। আমি আমার অর্জিত প্রাতিষ্ঠানিক জ্ঞান, কাজের প্রতি নিষ্ঠা, সততা এবং দায়িত্বশীল মনোভাবের মাধ্যমে আপনার প্রতিষ্ঠানের অগ্রযাত্রায় কার্যকর ভূমিকা পালনে সম্পূর্ণ অঙ্গীকারবদ্ধ।

অতএব, মহোদয়ের নিকট আমার আকুল আবেদন এই যে, আমার দাখিলকৃত শিক্ষাগত যোগ্যতা ও জীবনবৃত্তান্ত সুবিবেচনায় লইয়া আমাকে উক্ত পদের নির্বাচনী পরীক্ষায় অথবা মৌখিক সাক্ষাৎকারে অংশগ্রহণের সুযোগ প্রদানে বাধিত করিবেন।`,
        closing: 'বিনীত নিবেদক,',
        signOffName: name,
        signOffTitle: 'আবেদনকারী',
        signOffPhone: resume.personal.phone || '',
        signOffEmail: resume.personal.email || '',
        signOffAddress: address
      };
    }
  },
  {
    id: 'bd-govt-dorkhast',
    label: 'বাংলাদেশ সরকারি চাকরির আবেদনপত্র (সরকারী দরখাস্ত)',
    category: 'Govt Standard',
    badge: 'মন্ত্রণালয় ও অধিদপ্তর',
    description: 'বাংলাদেশ সরকারের মন্ত্রণালয়, অধিদপ্তর, স্বায়ত্তশাসিত প্রতিষ্ঠান ও বিসিএস নন-ক্যাডার চাকরির জন্য নির্ধারিত ফরম্যাটের দরখাস্ত।',
    getData: (resume: ResumeData): CoverLetterData => {
      const name = resume.personal.fullNameBn || resume.personal.fullName || 'প্রার্থীর নাম';
      const address = resume.personal.address || resume.personal.permanentAddress || 'ঢাকা, বাংলাদেশ';
      const circularNo = resume.personal.circularNo || 'নিয়োগ বিজ্ঞপ্তি নং-০২/২০২৬';
      const circularDate = resume.personal.circularDate || new Date().toISOString().split('T')[0];
      const title = resume.personal.title || 'সহকারী পরিচালক / প্রশাসনিক কর্মকর্তা';
      return {
        recipientName: 'বরাবর, সচিব / মহাপরিচালক / সভাপতি, বিভাগীয় নির্বাচন কমিটি',
        recipientDesignation: 'প্রশাসন ও মানবসম্পদ অনুবিভাগ',
        companyName: 'মন্ত্রণালয় / অধিদপ্তর / বিভাগীয় কার্যালয়',
        companyAddress: 'বাংলাদেশ সচিবালয় / আগারগাঁও প্রশাসনিক এলাকা, ঢাকা',
        jobTitle: title,
        circularReference: `সূত্র: স্মারক নং- ${circularNo}, তারিখ: ${circularDate}`,
        date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        salutation: 'মহোদয়,',
        subject: `বিষয়: ‘${title}’ পদে নিয়োগের জন্য আবেদনপত্র।`,
        letterBody: `যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আপনার দপ্তরে জারীকৃত উপরিউক্ত স্মারক ও তারিখের নিয়োগ বিজ্ঞপ্তির আলোকে জানতে পারলাম যে, ‘${title}’ পদে কিছুসংখ্যক উপযুক্ত ও যোগ্য জনবল নিয়োগ করা হইবে। আমি বর্ণিত পদের জন্য একজন আগ্রহী প্রার্থী হিসেবে নিম্নোক্ত বিবরণ ও এতদসঙ্গে সংযুক্ত নির্ধারিত ১-পৃষ্ঠার জীবনবৃত্তান্ত ফরম (Bio-Data) আপনার সদয় বিবেচনার জন্য পেশ করিতেছি।

আমার সকল শিক্ষাগত যোগ্যতার সত্যায়িত সনদপত্র, জাতীয় পরিচয়পত্রের অনুলিপি, নাগরিকত্ব ও চারিত্রিক সনদ এবং সদ্যতোলা পাসপোর্ট সাইজের সত্যায়িত ছবি আবেদনপত্রের সাথে বিধি মোতাবেক সংযুক্ত করা হইয়াছে। আমি নিয়মনিষ্ঠা, সততা এবং আনুগত্যের সহিত অর্পিত দায়িত্ব পালনে সদা সচেষ্ট থাকিব।

অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, আমার দাখিলকৃত শিক্ষাগত যোগ্যতা ও অন্যান্য তথ্যাদি সুবিবেচনাপূর্বক আমাকে উক্ত পদের লিখিত ও ব্যবহারিক/মৌখিক পরীক্ষায় অংশগ্রহণের অনুমতি দানে আপনার সদয় মর্জি হয়।`,
        closing: 'বিনীত নিবেদক,',
        signOffName: name,
        signOffTitle: 'প্রার্থী / আবেদনকারী',
        signOffPhone: resume.personal.phone || '',
        signOffEmail: resume.personal.email || '',
        signOffAddress: address
      };
    }
  },
  {
    id: 'bd-bank-officer',
    label: 'বাংলাদেশ ব্যাংক ও বাণিজ্যিক ব্যাংকে অফিসার পদে আবেদন',
    category: 'Banking Sector',
    badge: 'ব্যাংকিং ক্যারিয়ার',
    description: 'বাংলাদেশ ব্যাংক ব্যাংকার্স সিলেকশন কমিটি (BSCC) এবং তফসিলি বাণিজ্যিক ব্যাংকে অফিসার/ক্যাশ পদে নিয়োগ আবেদন।',
    getData: (resume: ResumeData): CoverLetterData => {
      const name = resume.personal.fullName || 'প্রার্থীর নাম';
      const address = resume.personal.address || resume.personal.permanentAddress || 'ঢাকা, বাংলাদেশ';
      const title = resume.personal.title || 'Officer (General) / Management Trainee';
      return {
        recipientName: 'The Member Secretary, Bankers\' Selection Committee / Head of HR',
        recipientDesignation: 'Human Resources Division',
        companyName: 'Bangladesh Bank / Scheduled Commercial Bank',
        companyAddress: 'Head Office, Motijheel C/A, Dhaka-1000',
        jobTitle: title,
        circularReference: 'Ref: Recruitment Circular No. 2026/08',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        salutation: 'Dear Sir/Madam,',
        subject: `Application for the position of ‘${title}’`,
        letterBody: `In response to your recruitment advertisement published in national dailies, I would like to submit my candidature for the position of ‘${title}’ in your esteemed financial institution.

Having completed my academic degree with a solid background in analytical thinking, financial principles, and quantitative acumen, I have cultivated a strong interest in banking operations, compliance, and client service excellence. I am adept at working under demanding deadlines, handling numerical data accurately, and communicating effectively across diverse teams.

Enclosed is my comprehensive Curriculum Vitae detailing my academic qualifications, training, and achievements. I am confident that my diligence, integrity, and proactive mindset will enable me to make a meaningful contribution to your organization's financial operations.

I would be honored to be considered for the preliminary assessment and interview. Thank you for your consideration.`,
        closing: 'Sincerely yours,',
        signOffName: name,
        signOffTitle: 'Candidate',
        signOffPhone: resume.personal.phone || '',
        signOffEmail: resume.personal.email || '',
        signOffAddress: address
      };
    }
  }
];
