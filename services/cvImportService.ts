import { ResumeData } from '../types';
import { parseResumeText } from '../utils/cvParser';
import { getGeminiApiKey } from './aiService';

export interface CVParseResult {
  data: Partial<ResumeData>;
  rawText?: string;
  source: 'ai' | 'heuristic';
}

/**
 * Converts a File to Base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Reads plain text from a text file (.txt)
 */
function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Parse CV from an uploaded File (PDF or TXT)
 */
export async function parseCVFromFile(file: File): Promise<CVParseResult> {
  const userApiKey = getGeminiApiKey();

  // If plain text file
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    const text = await fileToText(file);
    return parseCVFromText(text);
  }

  // If PDF
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const base64 = await fileToBase64(file);

    try {
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userApiKey ? { 'x-gemini-api-key': userApiKey } : {})
        },
        body: JSON.stringify({
          pdfBase64: base64,
          userApiKey
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          return {
            data: result.data,
            rawText: result.rawText,
            source: 'ai'
          };
        }

        // If returned rawText, run rule-based heuristic parser
        if (result.rawText) {
          const parsed = parseResumeText(result.rawText);
          return {
            data: parsed,
            rawText: result.rawText,
            source: 'heuristic'
          };
        }
      }
    } catch (err) {
      console.warn('Backend parse error, falling back to local extractor:', err);
    }
  }

  throw new Error('Unsupported file format. Please upload a PDF or TXT file, or paste your CV text.');
}

/**
 * Parse CV directly from raw text (BDJobs text, LinkedIn text, Word copy-paste)
 */
export async function parseCVFromText(rawText: string): Promise<CVParseResult> {
  const userApiKey = getGeminiApiKey();

  if (!rawText || !rawText.trim()) {
    throw new Error('Please enter or paste your CV text.');
  }

  try {
    const response = await fetch('/api/parse-cv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userApiKey ? { 'x-gemini-api-key': userApiKey } : {})
      },
      body: JSON.stringify({
        rawText,
        userApiKey
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.data) {
        return {
          data: result.data,
          rawText,
          source: 'ai'
        };
      }
    }
  } catch (err) {
    console.warn('Network parse error, using offline heuristic parser:', err);
  }

  // Local offline heuristic parser
  const parsed = parseResumeText(rawText);
  return {
    data: parsed,
    rawText,
    source: 'heuristic'
  };
}
