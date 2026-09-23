import { ResumeData, Language } from "../types";

export const getGeminiApiKey = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jh_soft_cv_user_api_key') || '';
  }
  return '';
};

export const setGeminiApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jh_soft_cv_user_api_key', key.trim());
  }
};

/**
 * Server-Side Gemini API Proxy Caller
 * Uses the user's custom Gemini API key safely via the Express backend
 */
async function callBackendAi(prompt: string, systemInstruction?: string): Promise<string> {
  const userApiKey = getGeminiApiKey();
  if (!userApiKey) {
    throw new Error('Please configure your Gemini API Key in the AI Assistant or Shop Account settings.');
  }

  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-gemini-api-key': userApiKey
    },
    body: JSON.stringify({
      prompt,
      systemInstruction,
      userApiKey
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'AI request failed');
  }

  return data.text || '';
}

/**
 * Generates 8-12 tailored professional skills based on experience & title
 */
export const suggestSkills = async (data: ResumeData, lang: Language = 'en'): Promise<string[]> => {
  const getFallbackSkills = (): string[] => {
    const title = (data.personal.title || '').toLowerCase();
    const expText = (data.experience || []).map(e => `${e.position} ${e.description}`).join(' ').toLowerCase();
    const combined = `${title} ${expText}`;

    if (combined.includes('design') || combined.includes('ui') || combined.includes('ux')) {
      return ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing & Prototyping', 'User Research', 'Design Thinking', 'Accessibility (WCAG)', 'Interaction Design'];
    }
    if (combined.includes('data') || combined.includes('analyst') || combined.includes('machine learning') || combined.includes('ai')) {
      return ['Python', 'SQL & BigQuery', 'Machine Learning', 'Data Modeling', 'Pandas & NumPy', 'Tableau & PowerBI', 'Statistical Analysis', 'ETL Pipelines'];
    }
    if (combined.includes('product') || combined.includes('project') || combined.includes('scrum')) {
      return ['Product Roadmap', 'Agile & Scrum', 'Stakeholder Management', 'User Journey Mapping', 'Jira & Confluence', 'KPI Tracking', 'Product Analytics', 'Cross-Functional Leadership'];
    }
    if (combined.includes('market') || combined.includes('growth') || combined.includes('seo')) {
      return ['SEO Optimization', 'Content Strategy', 'Google Analytics', 'Growth Marketing', 'Campaign Management', 'Email Automation', 'Brand Positioning', 'HubSpot & CRM'];
    }
    if (combined.includes('finance') || combined.includes('account') || combined.includes('audit')) {
      return ['Financial Modeling', 'Budgeting & Forecasting', 'Excel (Advanced)', 'GAAP Compliance', 'Financial Reporting', 'Variance Analysis', 'Risk Management'];
    }
    if (combined.includes('dev') || combined.includes('engineer') || combined.includes('architect') || combined.includes('software') || combined.includes('full-stack') || combined.includes('frontend') || combined.includes('backend')) {
      return ['TypeScript', 'React.js', 'Node.js', 'System Architecture', 'Cloud Services (AWS/GCP)', 'Docker & Containers', 'CI/CD Automation', 'REST & GraphQL APIs', 'Database Optimization', 'Git Version Control'];
    }
    return ['Project Management', 'Cross-Functional Collaboration', 'Strategic Planning', 'Process Optimization', 'Data-Driven Decision Making', 'Stakeholder Communication', 'Agile Methodologies', 'Workflow Automation'];
  };

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return getFallbackSkills();
  }

  try {
    const experiences = (data.experience || [])
      .map(exp => `${exp.position || data.personal.title || ''} at ${exp.company || ''}: ${exp.description || ''}`)
      .join("\n");
    const projects = (data.projects || [])
      .map(p => `${p.title}: ${p.tech} - ${p.description}`)
      .join("\n");

    const prompt = `Based on the candidate's professional profile:
Title: "${data.personal.title || 'Professional'}"
Work Experience:
${experiences || 'Not specified'}
Projects:
${projects || 'Not specified'}

Suggest 8 to 14 highly relevant, industry-recognized professional skills and tools suitable for a competitive resume.
${lang === 'bn' ? 'Provide the skill names in Bengali (বাংলা) or standard industry terms.' : 'Provide the skill names in English.'}
Do not fabricate facts. Return ONLY a valid JSON array of skill strings, like ["Skill 1", "Skill 2"]. No markdown formatting, no other text.`;

    const text = await callBackendAi(prompt);
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((s: unknown) => String(s).trim()).filter(Boolean);
    }
    return getFallbackSkills();
  } catch (error) {
    console.error("AI Skill Suggestion Error:", error);
    return getFallbackSkills();
  }
};

/**
 * Generates a concise, high-impact 2-3 sentence career summary
 */
export const generateProfessionalSummary = async (
  data: ResumeData, 
  lang: Language = 'en',
  tone: 'executive' | 'modern' | 'technical' | 'entry' = 'modern'
): Promise<string> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return lang === 'bn' 
      ? "AI কী কনফিগার করা নেই। অনুগ্রহ করে সেটিংস বা শপ একাউন্ট থেকে জেমিনি API কী যুক্ত করুন।" 
      : "Gemini API key is not configured. Please add your API key in settings or shop account.";
  }

  try {
    const skillsList = (data.skills || []).slice(0, 10).join(', ');
    const recentRoles = (data.experience || [])
      .slice(0, 2)
      .map(e => `${e.position} at ${e.company}`)
      .join('; ');

    const prompt = `Write a high-impact, professional 2-3 sentence executive summary for a resume.
Candidate Name: ${data.personal.fullName || 'Candidate'}
Target Role/Title: ${data.personal.title || 'Professional'}
Key Skills: ${skillsList || 'General industry proficiency'}
Recent Roles: ${recentRoles || 'Not listed'}
Tone Style: ${tone} (crisp, confident, achievement-focused, no generic clichés like 'go-getter').
Language: ${lang === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
Strict Constraint: Do not invent false metrics or dates. Rely only on provided facts. Return plain text only.`;

    const text = await callBackendAi(prompt);
    return text.trim();
  } catch (error) {
    console.error("AI Summary Generation Error:", error);
    return "";
  }
};

/**
 * Improves an existing work experience description or bullet point using the STAR method
 */
export const improveExperienceBullets = async (
  jobTitle: string,
  company: string,
  rawDescription: string,
  lang: Language = 'en'
): Promise<string> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return rawDescription;

  try {
    const prompt = `Rewrite the following job responsibilities into 2-4 strong, action-driven resume bullet points using the STAR method (Action Verb + Context + Result).
Job Role: ${jobTitle || 'Role'}
Company: ${company || 'Organization'}
Original Notes:
${rawDescription}

Rules:
- Start each bullet point with a strong action verb (e.g. Spearheaded, Engineered, Directed, Streamlined).
- Keep each bullet concise and professional.
- Do NOT fabricate fake statistics or metric numbers that were not implied in the notes.
- Format with standard bullet character "• ".
- Output language: ${lang === 'bn' ? 'Bengali (বাংলা)' : 'English'}.`;

    const text = await callBackendAi(prompt);
    return text.trim() || rawDescription;
  } catch (error) {
    console.error("AI Experience Improvement Error:", error);
    return rawDescription;
  }
};

/**
 * Polishes text for grammar, punctuation, and executive clarity
 */
export const polishGrammarAndStyle = async (text: string, lang: Language = 'en'): Promise<string> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey || !text.trim()) return text;

  try {
    const prompt = `Proofread, polish, and enhance the grammar, vocabulary, and conciseness of the following professional resume text. 
Preserve the core meaning, dates, and names.
Language: ${lang === 'bn' ? 'Bengali (বাংলা)' : 'English'}.

Text to polish:
"""
${text}
"""

Return ONLY the polished text without meta commentary.`;

    const res = await callBackendAi(prompt);
    return res.trim() || text;
  } catch (error) {
    console.error("AI Polish Grammar Error:", error);
    return text;
  }
};

/**
 * Analyzes resume fit against a job description and suggests tailored summary and keywords
 */
export const tailorResumeToJob = async (
  data: ResumeData,
  jobDescription: string,
  lang: Language = 'en'
): Promise<{ matchScore: number; missingKeywords: string[]; suggestedSummary: string; advice: string }> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return {
      matchScore: 70,
      missingKeywords: ['Cloud Architecture', 'Agile Leadership', 'CI/CD'],
      suggestedSummary: data.personal.summary,
      advice: 'Configure your Gemini API key to enable dynamic AI job tailoring.'
    };
  }

  try {
    const prompt = `Compare this candidate's resume against the target job posting.
Candidate Profile:
Title: ${data.personal.title}
Skills: ${(data.skills || []).join(', ')}
Summary: ${data.personal.summary}
Experience: ${(data.experience || []).map(e => `${e.position} at ${e.company}: ${e.description}`).join('; ')}

Target Job Description:
"""
${jobDescription}
"""

Provide an ATS analysis in JSON format with:
1. matchScore (integer 0 to 100)
2. missingKeywords (array of strings)
3. suggestedSummary (string)
4. advice (string)

Language for advice and summary: ${lang === 'bn' ? 'Bengali' : 'English'}.
Strict constraint: Do not fabricate credentials. Return ONLY valid JSON, no markdown.`;

    const res = await callBackendAi(prompt);
    const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Tailoring Error:", error);
    return {
      matchScore: 65,
      missingKeywords: [],
      suggestedSummary: data.personal.summary,
      advice: 'Could not complete tailoring analysis. Please verify your connection or API key.'
    };
  }
};

/**
 * Generates a tailored 1-page Cover Letter matching the resume data
 */
export const generateCoverLetter = async (
  data: ResumeData,
  jobTitle: string,
  companyName: string,
  lang: Language = 'en',
  jobDescription?: string
): Promise<string> => {
  const getFallbackCoverLetter = () => {
    const candidateName = data.personal.fullName || 'Candidate';
    const candidateTitle = data.personal.title || jobTitle || 'Professional';
    const topSkills = (data.skills || []).slice(0, 5).join(', ');
    const firstExp = data.experience && data.experience.length > 0 ? data.experience[0] : null;
    const expText = firstExp ? `During my tenure as ${firstExp.position} at ${firstExp.company}, I successfully demonstrated high-level execution and team collaboration.` : 'Throughout my professional career, I have consistently focused on delivering tangible results and exceeding stakeholder expectations.';

    if (lang === 'bn') {
      return `বরাবর,
ব্যবস্থাপনা পরিচালক / নিয়োগকারী কর্তৃপক্ষ
${companyName || 'প্রতিষ্ঠানের নাম'}
ঢাকা, বাংলাদেশ।

বিষয়: ‘${jobTitle || 'প্রয়োজনীয় পদ'}’ পদে নিয়োগের জন্য আবেদন।

মহোদয়,
যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আপনার প্রতিষ্ঠানে সম্প্রতি প্রকাশিত নিয়োগ বিজ্ঞপ্তির মাধ্যমে আমি জানতে পারলাম যে কিছু সংখ্যক ‘${jobTitle || 'প্রয়োজনীয় পদ'}’ পদে উপযুক্ত জনবল নিয়োগ করা হইবে। আমি উক্ত পদের জন্য নিজেকে একজন যোগ্য ও উদ্যমী প্রার্থী হিসেবে বিবেচনা করিয়া আবেদন দাখিল করিতেছি।

আমি ${candidateTitle} হিসেবে পেশাগত দায়িত্ব পালনে নিষ্ঠাবান। আমার মূল দক্ষতাসমূহের মধ্যে রয়েছে: ${topSkills || 'প্রাসঙ্গিক পেশাগত দক্ষতা'}। প্রাতিষ্ঠানিক কাজের ক্ষেত্রে সততা, নিয়মানুবর্তিতা এবং দলগত কাজের মাধ্যমে নির্ধারিত লক্ষ্য অর্জনই আমার মূল লক্ষ্য।

অতএব, মহোদয়ের নিকট আমার আকুল আবেদন, আমার শিক্ষাগত যোগ্যতা ও পেশাগত অভিজ্ঞতা সুবিবেচনায় লইয়া আমাকে নির্বাচনী পরীক্ষায় অথবা সাক্ষাৎকারে ডাকিয়া কৃতার্থ করিবেন।

বিনীত নিবেদক,
${candidateName}
মোবাইল: ${data.personal.phone || ''}
ইমেইল: ${data.personal.email || ''}`;
    }

    return `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${jobTitle || 'open position'} at ${companyName || 'your esteemed organization'}. With a proven track record as a ${candidateTitle} and a deep dedication to professional excellence, I am confident in my ability to make an immediate, positive impact on your team.

My background includes core strengths in ${topSkills || 'problem solving, leadership, and operational execution'}. ${expText} I pride myself on bridging analytical strategy with disciplined execution to solve complex challenges and elevate team productivity.

What particularly attracts me to ${companyName || 'your company'} is your reputation for innovation and commitment to delivering exceptional value. I am eager to leverage my skills and background to help your organization achieve its strategic objectives.

Thank you very much for your time and consideration. I welcome the opportunity to discuss my qualifications in greater detail during an interview.

Sincerely,
${candidateName}`;
  };

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return getFallbackCoverLetter();
  }

  try {
    const prompt = `Write a compelling, professional, one-page cover letter.
Candidate Name: ${data.personal.fullName || 'Candidate'}
Candidate Contact: ${data.personal.email || ''} | ${data.personal.phone || ''} | ${data.personal.address || ''}
Target Position: ${jobTitle || data.personal.title || 'Applicant'}
Target Company: ${companyName || 'Hiring Team'}
${jobDescription ? `Job Description / Requirements:\n${jobDescription}\n` : ''}
Candidate Highlights:
Title: ${data.personal.title}
Key Skills: ${(data.skills || []).slice(0, 8).join(', ')}
Summary: ${data.personal.summary}
Experience Highlights: ${(data.experience || []).slice(0, 2).map(e => `${e.position} at ${e.company}`).join(', ')}

Rules:
- Standard formal cover letter format with Salutation, Opening Hook, Value Alignment to the company/job, and Call to Action.
- Sound confident, articulate, and authentic. No fluff.
- Output language: ${lang === 'bn' ? 'Bengali (বাংলা)' : 'English'}. Return ONLY the cover letter text, no preamble or extra conversational chat.`;

    const text = await callBackendAi(prompt);
    return text.trim() || getFallbackCoverLetter();
  } catch (error) {
    console.error("AI Cover Letter Error:", error);
    return getFallbackCoverLetter();
  }
};

/**
 * Translates the entire ResumeData object to target language
 */
export const translateResumeData = async (data: ResumeData, targetLang: Language): Promise<ResumeData> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return data;

  try {
    const prompt = `Translate the following JSON resume data into ${targetLang === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
Maintain the EXACT same JSON schema structure. Only translate the human-readable text values (titles, descriptions, summaries, skill names, degree names).
Do NOT translate ID numbers, email addresses, phone numbers, or URLs.
Return ONLY the translated JSON, with no code fence or markdown.

JSON to translate:
${JSON.stringify(data)}`;

    const res = await callBackendAi(prompt);
    const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned);
    return { ...data, ...result };
  } catch (error) {
    console.error("Translation failed:", error);
    return data;
  }
};
