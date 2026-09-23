import { ResumeData, Education, WorkExperience, Reference } from '../types';

/**
 * Intelligent Rule-based CV & Bio-data Parser
 * Specialized for Bangladesh & International CVs, BDJobs text exports, and LinkedIn profile dumps.
 */
export function parseResumeText(rawText: string): Partial<ResumeData> {
  if (!rawText || !rawText.trim()) return {};

  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const cleanFullText = rawText;

  // 1. Email extraction
  const emailMatch = cleanFullText.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';

  // 2. Phone extraction (Bangladeshi 01X or international)
  const phoneMatch = cleanFullText.match(/(?:\+?880\s?|0)1[3-9]\d{2}[-\s]?\d{6}/) ||
                     cleanFullText.match(/(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ') : '';

  // 3. Name extraction: usually first prominent non-header line
  let fullName = '';
  for (const line of lines.slice(0, 10)) {
    const lower = line.toLowerCase();
    if (
      lower.includes('curriculum vitae') ||
      lower.includes('resume') ||
      lower.includes('bio-data') ||
      lower.includes('biodata') ||
      lower.includes('page') ||
      lower.includes('email') ||
      lower.includes('phone') ||
      lower.includes('http') ||
      line.length > 50 ||
      line.length < 3
    ) {
      continue;
    }
    // Check if line looks like a person's name (letters, dots, spaces)
    if (/^[A-Za-z.\s'-]{3,40}$/.test(line) && !lower.includes('street') && !lower.includes('road')) {
      fullName = line;
      break;
    }
  }

  // 4. Personal demographic attributes (Bangladesh specific)
  const extractField = (patterns: RegExp[]): string => {
    for (const pat of patterns) {
      const match = cleanFullText.match(pat);
      if (match && match[1]) {
        return match[1].trim().replace(/^[:\-–]\s*/, '').trim();
      }
    }
    return '';
  };

  const fathersName = extractField([
    /(?:father'?s?\s*name|পিতার\s*নাম)\s*[:\-–]\s*([^\n\r]+)/i,
    /(?:father'?s?\s*name|পিতা)\s*[:\-–]\s*([^\n\r]+)/i
  ]);

  const mothersName = extractField([
    /(?:mother'?s?\s*name|মাতার\s*নাম)\s*[:\-–]\s*([^\n\r]+)/i,
    /(?:mother'?s?\s*name|মাতা)\s*[:\-–]\s*([^\n\r]+)/i
  ]);

  const dateOfBirth = extractField([
    /(?:date\s*of\s*birth|dob|জন্ম\s*তারিখ)\s*[:\-–]\s*([^\n\r]+)/i
  ]);

  const bloodGroup = extractField([
    /(?:blood\s*group|রক্তের\s*গ্রুপ)\s*[:\-–]\s*([A-Za-z+-]{1,5})/i
  ]);

  const religion = extractField([
    /(?:religion|ধর্ম)\s*[:\-–]\s*([A-Za-z\u0980-\u09FF]+)/i
  ]);

  const maritalStatus = extractField([
    /(?:marital\s*status|বৈবাহিক\s*অবস্থা)\s*[:\-–]\s*([A-Za-z\u0980-\u09FF]+)/i
  ]);

  const nid = extractField([
    /(?:national\s*id|nid|জাতীয়\s*পরিচয়পত্র)\s*(?:no\.?|number)?\s*[:\-–]\s*([0-9\u09E6-\u09EF\s-]{10,20})/i
  ]);

  const gender = extractField([
    /(?:gender|sex|লিঙ্গ)\s*[:\-–]\s*([A-Za-z\u0980-\u09FF]+)/i
  ]);

  const nationality = extractField([
    /(?:nationality|জাতীয়তা)\s*[:\-–]\s*([A-Za-z\u0980-\u09FF]+)/i
  ]) || 'Bangladeshi';

  const presentAddress = extractField([
    /(?:present\s*address|mailing\s*address|বর্তমান\s*ঠিকানা)\s*[:\-–]\s*([^\n\r]+(?:(?:\r?\n)(?!\s*(?:permanent|father|mother|date|phone|email))[^\n\r]+)?)/i
  ]);

  const permanentAddress = extractField([
    /(?:permanent\s*address|স্থায়ী\s*ঠিকানা)\s*[:\-–]\s*([^\n\r]+(?:(?:\r?\n)(?!\s*(?:present|father|mother|date|phone|email))[^\n\r]+)?)/i
  ]);

  // 5. Career Objective / Summary
  let careerObjective = '';
  let summary = '';
  const objMatch = cleanFullText.match(/(?:career\s*objective|objective|ক্যারিয়ার\s*অবজেক্টিভ)\s*[:\-–]?\s*\r?\n([\s\S]*?)(?=\r?\n\s*(?:education|experience|employment|academic|skills|personal|references))/i);
  if (objMatch && objMatch[1]) {
    careerObjective = objMatch[1].trim().slice(0, 600);
  }

  const sumMatch = cleanFullText.match(/(?:professional\s*summary|profile|about\s*me|summary)\s*[:\-–]?\s*\r?\n([\s\S]*?)(?=\r?\n\s*(?:education|experience|employment|academic|skills|personal|references))/i);
  if (sumMatch && sumMatch[1]) {
    summary = sumMatch[1].trim().slice(0, 600);
  }

  // 6. Skills extraction
  const skills: string[] = [];
  const skillsMatch = cleanFullText.match(/(?:skills|core\s*competencies|technical\s*skills|দক্ষতা)\s*[:\-–]?\s*\r?\n([\s\S]*?)(?=\r?\n\s*(?:education|experience|employment|academic|personal|references|projects|certifications|$))/i);
  if (skillsMatch && skillsMatch[1]) {
    const rawSkillsText = skillsMatch[1];
    // Split by comma, bullets, newlines
    const tokens = rawSkillsText
      .split(/[,•\n\r|;]+/)
      .map(s => s.trim().replace(/^[-*•]\s*/, ''))
      .filter(s => s.length > 1 && s.length < 35 && !/skills|proficient/i.test(s));
    
    tokens.forEach(t => {
      if (!skills.includes(t)) skills.push(t);
    });
  }

  // 7. Education extraction
  const educationList: Education[] = [];
  const eduRegex = /(B\.?Sc|M\.?Sc|BBA|MBA|HSC|SSC|Dakhil|Alim|Bachelor|Master|Diploma|B\.A|M\.A|Ph\.?D|O[\s-]?Level|A[\s-]?Level)[^\n\r]*/gi;
  let match;
  let eduIndex = 1;

  while ((match = eduRegex.exec(cleanFullText)) !== null && eduIndex <= 5) {
    const degText = match[0].trim();
    // Look ahead 2-3 lines for Institute and Passing Year
    const context = cleanFullText.substring(match.index, match.index + 250);
    
    // Find Year (1990 - 2030)
    const yearMatch = context.match(/\b(199\d|20[0-2]\d)\b/);
    const year = yearMatch ? yearMatch[1] : '';

    // Find GPA / CGPA (e.g. 3.75, 5.00, 4.80)
    const gpaMatch = context.match(/(?:cgpa|gpa|result)[\s:]*([0-5]\.\d{2})/i) || context.match(/\b([0-5]\.\d{2})\b/);
    const grade = gpaMatch ? gpaMatch[1] : '';

    // Find Board (Dhaka, Rajshahi, Comilla, etc.)
    const boardMatch = context.match(/\b(Dhaka|Rajshahi|Comilla|Chittagong|Chattogram|Barisal|Sylhet|Dinajpur|Mymensingh|Madrasah|Technical)\b/i);
    const board = boardMatch ? boardMatch[1] : '';

    educationList.push({
      id: `edu_parsed_${eduIndex++}`,
      degree: degText.slice(0, 60),
      institute: 'University / College / School',
      location: 'Bangladesh',
      year: year || '2024',
      result: grade || '3.50',
      board: board || 'Dhaka',
      group: ''
    });
  }

  // 8. Experience extraction
  const experienceList: WorkExperience[] = [];
  const expMatch = cleanFullText.match(/(?:experience|employment\s*history|work\s*experience|কর্মসংস্থান)\s*[:\-–]?\s*\r?\n([\s\S]*?)(?=\r?\n\s*(?:education|academic|skills|personal|references|projects|certifications|$))/i);
  if (expMatch && expMatch[1]) {
    const expText = expMatch[1];
    const expLines = expText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (expLines.length > 0) {
      experienceList.push({
        id: `exp_parsed_1`,
        position: expLines[0] || 'Executive',
        company: expLines[1] || 'Organization',
        location: 'Dhaka, Bangladesh',
        duration: '2022 - Present',
        description: expLines.slice(2, 6).map(b => b.replace(/^[-*•]\s*/, '')).join('\n')
      });
    }
  }

  // 9. References extraction
  const referencesList: Reference[] = [];
  const refMatch = cleanFullText.match(/(?:references|রেফারেন্স)\s*[:\-–]?\s*\r?\n([\s\S]*?)(?=\r?\n\s*(?:declaration|signature|$))/i);
  if (refMatch && refMatch[1]) {
    const refLines = refMatch[1].split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (refLines.length > 0) {
      const refEmail = refLines.find(l => l.includes('@')) || '';
      const refPhone = refLines.find(l => /01[3-9]\d/.test(l)) || '';
      referencesList.push({
        id: 'ref_parsed_1',
        name: refLines[0] || 'Referee Name',
        designation: refLines[1] || 'Senior Manager',
        organization: refLines[2] || 'Organization Name',
        phone: refPhone,
        email: refEmail
      });
    }
  }

  return {
    personal: {
      fullName: fullName || 'Full Name',
      title: 'Professional',
      email: email || '',
      phone: phone || '',
      address: presentAddress || '',
      permanentAddress: permanentAddress || '',
      fatherName: fathersName || '',
      motherName: mothersName || '',
      dob: dateOfBirth || '',
      religion: religion || '',
      maritalStatus: maritalStatus || '',
      bloodGroup: bloodGroup || '',
      nid: nid || '',
      nationality: nationality || 'Bangladeshi',
      gender: gender || '',
      careerObjective: careerObjective || '',
      summary: summary || ''
    },
    education: educationList.length > 0 ? educationList : undefined,
    experience: experienceList.length > 0 ? experienceList : undefined,
    skills: skills.length > 0 ? skills : undefined,
    references: referencesList.length > 0 ? referencesList : undefined
  };
}
