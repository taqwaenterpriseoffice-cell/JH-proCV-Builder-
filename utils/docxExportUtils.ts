import { 
  Document, Packer, Paragraph, TextRun, HeadingLevel, 
  Table, TableRow, TableCell, WidthType, BorderStyle, 
  AlignmentType 
} from 'docx';
import { ResumeData, ResumeDocument } from '../types';

/**
 * Creates a clean, highly structured Microsoft Word (.docx) document 
 * fully compatible with MS Word 2007-2026, Office 365, Google Docs, and WPS Office.
 */
export const generateWordDocx = async (
  resume: ResumeDocument | { data: ResumeData; title?: string; accentColor?: string; font?: string }
): Promise<Blob> => {
  const data = resume.data;
  const accentHex = (resume.accentColor || '#1e3a8a').replace('#', '');
  const isBengali = !!data.personal.fullNameBn || /[ঀ-৿]/.test(data.personal.fullName || '');

  // Helper for Section Headings
  const createSectionHeading = (title: string): Paragraph => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: accentHex,
          size: 12,
          style: BorderStyle.SINGLE
        }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24, // 12pt
          color: accentHex,
          font: isBengali ? 'Kalpurush' : 'Arial'
        })
      ]
    });
  };

  const sections: (Paragraph | Table)[] = [];

  // 1. CANDIDATE HEADER
  const displayName = data.personal.fullNameBn 
    ? `${data.personal.fullName} (${data.personal.fullNameBn})` 
    : (data.personal.fullName || 'Candidate Name');

  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: displayName,
          bold: true,
          size: 36, // 18pt
          color: accentHex,
          font: isBengali ? 'Kalpurush' : 'Arial'
        })
      ]
    })
  );

  if (data.personal.title) {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: data.personal.title,
            size: 22, // 11pt
            color: '475569',
            font: isBengali ? 'Kalpurush' : 'Arial'
          })
        ]
      })
    );
  }

  // Contact line
  const contactParts: string[] = [];
  if (data.personal.phone) contactParts.push(`📞 ${data.personal.phone}`);
  if (data.personal.email) contactParts.push(`✉️ ${data.personal.email}`);
  if (data.personal.address) contactParts.push(`📍 ${data.personal.address}`);
  if (data.socials?.linkedin) contactParts.push(`LinkedIn: ${data.socials.linkedin}`);
  if (data.socials?.github) contactParts.push(`GitHub: ${data.socials.github}`);
  if (data.personal.website || data.socials?.portfolio) {
    contactParts.push(`Web: ${data.personal.website || data.socials?.portfolio}`);
  }

  if (contactParts.length > 0) {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18, // 9pt
            color: '64748b',
            font: isBengali ? 'Kalpurush' : 'Arial'
          })
        ]
      })
    );
  }

  // 2. CAREER OBJECTIVE / EXECUTIVE SUMMARY
  const objectiveText = data.personal.careerObjective || data.personal.summary;
  if (objectiveText) {
    sections.push(createSectionHeading(isBengali ? 'ক্যারিয়ার অবজেক্টিভ / উদ্দেশ্য' : 'Career Objective'));
    sections.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: objectiveText,
            size: 20, // 10pt
            font: isBengali ? 'Kalpurush' : 'Calibri'
          })
        ]
      })
    );
  }

  // 3. WORK EXPERIENCE
  if (data.experience && data.experience.length > 0) {
    sections.push(createSectionHeading(isBengali ? 'কর্মঅভিজ্ঞতা (Work Experience)' : 'Work Experience'));
    
    data.experience.forEach(exp => {
      const positionAndCompany = `${exp.position || 'Position'} — ${exp.company || 'Company'}`;
      const period = exp.duration ? ` (${exp.duration})` : '';
      const location = exp.location ? ` | ${exp.location}` : '';

      sections.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: positionAndCompany,
              bold: true,
              size: 22,
              font: isBengali ? 'Kalpurush' : 'Arial'
            }),
            new TextRun({
              text: `${period}${location}`,
              italics: true,
              size: 18,
              color: '64748b'
            })
          ]
        })
      );

      if (exp.description) {
        sections.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
                font: isBengali ? 'Kalpurush' : 'Calibri'
              })
            ]
          })
        );
      }
    });
  }

  // 4. EDUCATION (Presented in a clean formatted Table)
  if (data.education && data.education.length > 0) {
    sections.push(createSectionHeading(isBengali ? 'শিক্ষাগত যোগ্যতা (Academic Qualification)' : 'Academic Qualification'));

    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: 'f1f5f9' },
          children: [new Paragraph({ children: [new TextRun({ text: isBengali ? 'পরীক্ষা / ডিগ্রি' : 'Degree / Exam', bold: true, size: 20 })] })]
        }),
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { fill: 'f1f5f9' },
          children: [new Paragraph({ children: [new TextRun({ text: isBengali ? 'প্রতিষ্ঠান / বোর্ড' : 'Institute / Board', bold: true, size: 20 })] })]
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: 'f1f5f9' },
          children: [new Paragraph({ children: [new TextRun({ text: isBengali ? 'পাসের সন' : 'Year', bold: true, size: 20 })] })]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: 'f1f5f9' },
          children: [new Paragraph({ children: [new TextRun({ text: isBengali ? 'ফলাফল / জিপিএ' : 'Result / GPA', bold: true, size: 20 })] })]
        })
      ]
    });

    const dataRows = data.education.map(edu => {
      const year = edu.year || '-';
      const inst = [edu.institute, edu.board].filter(Boolean).join(', ');
      const result = edu.result || '-';
      const degreeTitle = [edu.degree, edu.group].filter(Boolean).join(' (');
      const formattedDegree = edu.group ? `${degreeTitle})` : (edu.degree || 'Degree');

      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: formattedDegree, bold: true, size: 19 })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: inst || '-', size: 19 })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: String(year), size: 19 })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: result, size: 19 })] })]
          })
        ]
      });
    });

    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...dataRows],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: 'cbd5e1' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'cbd5e1' },
          left: { style: BorderStyle.SINGLE, size: 4, color: 'cbd5e1' },
          right: { style: BorderStyle.SINGLE, size: 4, color: 'cbd5e1' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'e2e8f0' },
          insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'e2e8f0' }
        }
      })
    );
  }

  // 5. SKILLS
  if (data.skills && data.skills.length > 0) {
    sections.push(createSectionHeading(isBengali ? 'দক্ষতা ও পারদর্শিতা (Key Skills)' : 'Key Skills'));
    const skillList = data.skills.filter(s => typeof s === 'string' && s.trim().length > 0);
    
    sections.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: skillList.join('  •  '),
            size: 20,
            font: isBengali ? 'Kalpurush' : 'Calibri'
          })
        ]
      })
    );
  }

  // 6. PERSONAL DETAILS / BIO-DATA (Essential for Bangladesh CV & Govt Applications)
  const p = data.personal;
  const personalItems: { label: string; value: string | undefined }[] = [
    { label: isBengali ? 'পিতার নাম (Father\'s Name)' : 'Father\'s Name', value: p.fatherName },
    { label: isBengali ? 'মাতার নাম (Mother\'s Name)' : 'Mother\'s Name', value: p.motherName },
    { label: isBengali ? 'জন্ম তারিখ (Date of Birth)' : 'Date of Birth', value: p.dob },
    { label: isBengali ? 'বয়স (Age)' : 'Age', value: p.ageText },
    { label: isBengali ? 'জাতীয় পরিচয়পত্র নং (NID)' : 'National ID (NID)', value: p.nid },
    { label: isBengali ? 'কোটা (Quota)' : 'Quota', value: p.quota },
    { label: isBengali ? 'জাতীয়তা (Nationality)' : 'Nationality', value: p.nationality || 'Bangladeshi' },
    { label: isBengali ? 'ধর্ম (Religion)' : 'Religion', value: p.religion },
    { label: isBengali ? 'লিঙ্গ (Gender)' : 'Gender', value: p.gender },
    { label: isBengali ? 'বৈবাহিক অবস্থা (Marital Status)' : 'Marital Status', value: p.maritalStatus },
    { label: isBengali ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group', value: p.bloodGroup },
    { label: isBengali ? 'নিজ জেলা (Home District)' : 'Home District', value: p.homeDistrict },
    { label: isBengali ? 'বর্তমান ঠিকানা (Present Address)' : 'Present Address', value: p.address },
    { label: isBengali ? 'স্থায়ী ঠিকানা (Permanent Address)' : 'Permanent Address', value: p.permanentAddress }
  ].filter(item => Boolean(item.value && item.value.trim()));

  if (personalItems.length > 0) {
    sections.push(createSectionHeading(isBengali ? 'ব্যক্তিগত তথ্যাবলী (Personal Details)' : 'Personal Details'));

    const personalRows = personalItems.map(item => {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: item.label, bold: true, size: 19 })] })]
          }),
          new TableCell({
            width: { size: 5, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: ':', size: 19 })] })]
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: item.value || '', size: 19 })] })]
          })
        ]
      });
    });

    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: personalRows,
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE }
        }
      })
    );
  }

  // 7. LANGUAGES
  if (data.languages && data.languages.length > 0) {
    sections.push(createSectionHeading(isBengali ? 'ভাষাগত দক্ষতা (Language Proficiency)' : 'Languages'));
    const langList = data.languages.map(l => `${l.name} (${l.level})`).join('  •  ');
    sections.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: langList, size: 20 })]
      })
    );
  }

  // 8. REFERENCES
  if (data.references && data.references.length > 0) {
    sections.push(createSectionHeading(isBengali ? 'রেফারেন্স (References)' : 'References'));
    
    data.references.forEach(ref => {
      const lines = [
        ref.name ? `${ref.name}` : '',
        ref.designation ? `${ref.designation}${ref.organization ? `, ${ref.organization}` : ''}` : '',
        ref.phone ? `Phone: ${ref.phone}` : '',
        ref.email ? `Email: ${ref.email}` : '',
        ref.relation ? `Relationship: ${ref.relation}` : ''
      ].filter(Boolean);

      sections.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: lines[0] || 'Reference', bold: true, size: 21 }),
            new TextRun({ text: lines.length > 1 ? `\n${lines.slice(1).join(' | ')}` : '', size: 19, color: '475569' })
          ]
        })
      );
    });
  }

  // 9. DECLARATION & SIGNATURE
  const declarationStatement = data.declaration?.text || (
    isBengali 
      ? 'আমি এই মর্মে অঙ্গীকার করিতেছি যে, উপরে বর্ণিত যাবতীয় তথ্য সম্পূর্ণ সত্য ও সঠিক।' 
      : 'I hereby declare that all the information provided above is true and accurate to the best of my knowledge.'
  );

  sections.push(
    new Paragraph({
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({
          text: declarationStatement,
          italics: true,
          size: 18,
          color: '64748b'
        })
      ]
    })
  );

  sections.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 240 },
      children: [
        new TextRun({
          text: `________________________\n${displayName}\n(${isBengali ? 'স্বাক্ষর' : 'Signature'})`,
          bold: true,
          size: 19
        })
      ]
    })
  );

  // Build Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 inch (720 dxa)
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: sections
      }
    ]
  });

  return await Packer.toBlob(doc);
};

/**
 * Triggers instant download of the Word (.docx) document in the user's browser.
 */
export const exportAsWordDocx = async (
  resume: ResumeDocument | { data: ResumeData; title?: string; accentColor?: string; font?: string },
  filename?: string
): Promise<boolean> => {
  try {
    const blob = await generateWordDocx(resume);
    const candidateName = resume.data.personal.fullName || resume.title || 'Resume';
    const finalFilename = `${(filename || candidateName).replace(/[^\w\s\u0980-\u09FF-]/gi, '').trim() || 'Resume'}.docx`;

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = finalFilename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Word (.docx) Export Error:', err);
    return false;
  }
};
