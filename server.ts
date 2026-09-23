import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { PDFParse } from 'pdf-parse';
import { initDatabase, db, UserRecord, ResumeRecord } from './server/db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// In-memory active tokens map: token -> userId
const sessions = new Map<string, { userId: string; expiresAt: number }>();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_jhsoft_cv_salt').digest('hex');
}

function generateToken(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 }); // 30 days
  return token;
}

async function authenticate(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Session expired. Please login again.' });
  }
  const user = await db.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found.' });
  }
  (req as any).user = user;
  next();
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mysqlConfigured: !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
  });
});

// Auth: Register (Shop details, owner details, password)
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { shopName, ownerName, email, phone, password, address, geminiApiKey } = req.body;

    if (!shopName || !ownerName || !email || !password) {
      return res.status(400).json({ error: 'Shop name, Owner name, Email, and Password are required.' });
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const userId = `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const newUser: UserRecord = {
      id: userId,
      shop_name: shopName.trim(),
      owner_name: ownerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      password_hash: hashPassword(password),
      address: address ? address.trim() : '',
      gemini_api_key: geminiApiKey ? geminiApiKey.trim() : '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.createUser(newUser);
    const token = generateToken(userId);

    const safeUser = {
      id: newUser.id,
      shopName: newUser.shop_name,
      ownerName: newUser.owner_name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      geminiApiKey: newUser.gemini_api_key
    };

    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to create shop account.' });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.getUserByEmail(email);
    if (!user || user.password_hash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);
    const safeUser = {
      id: user.id,
      shopName: user.shop_name,
      ownerName: user.owner_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      geminiApiKey: user.gemini_api_key
    };

    res.json({ user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login.' });
  }
});

// Auth: Get current profile
app.get('/api/auth/me', authenticate, async (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  res.json({
    user: {
      id: user.id,
      shopName: user.shop_name,
      ownerName: user.owner_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      geminiApiKey: user.gemini_api_key
    }
  });
});

// Auth: Update shop profile & custom Gemini API Key
app.put('/api/auth/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as UserRecord;
    const { shopName, ownerName, phone, address, geminiApiKey } = req.body;

    const updated = await db.updateUser(user.id, {
      shop_name: shopName !== undefined ? shopName : user.shop_name,
      owner_name: ownerName !== undefined ? ownerName : user.owner_name,
      phone: phone !== undefined ? phone : user.phone,
      address: address !== undefined ? address : user.address,
      gemini_api_key: geminiApiKey !== undefined ? geminiApiKey : user.gemini_api_key
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: {
        id: updated.id,
        shopName: updated.shop_name,
        ownerName: updated.owner_name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        geminiApiKey: updated.gemini_api_key
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update shop details.' });
  }
});

// Resume: List all for current shop/user
app.get('/api/resumes', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as UserRecord;
    const records = await db.getResumesByUserId(user.id);
    const parsed = records.map((r) => {
      let dataObj = {};
      let printOptObj = {};
      try { dataObj = JSON.parse(r.data_json); } catch (e) {}
      try { printOptObj = r.print_options_json ? JSON.parse(r.print_options_json) : {}; } catch (e) {}
      return {
        id: r.id,
        title: r.title,
        theme: r.theme,
        font: r.font,
        language: r.language,
        accentColor: r.accent_color,
        fontSize: r.font_size,
        data: dataObj,
        printOptions: printOptObj,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      };
    });
    res.json({ resumes: parsed });
  } catch (error) {
    console.error('Fetch resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes from database.' });
  }
});

// Resume: Save or update a single resume
app.post('/api/resumes', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as UserRecord;
    const resume = req.body;

    if (!resume || !resume.id || !resume.title) {
      return res.status(400).json({ error: 'Resume ID and title are required.' });
    }

    const record: ResumeRecord = {
      id: resume.id,
      user_id: user.id,
      title: resume.title,
      theme: resume.theme || 'modern',
      font: resume.font || 'Inter',
      language: resume.language || 'en',
      accent_color: resume.accentColor || '#2563eb',
      font_size: resume.fontSize || 'normal',
      data_json: JSON.stringify(resume.data || {}),
      print_options_json: JSON.stringify(resume.printOptions || {}),
      created_at: resume.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.saveResume(record);
    res.json({ success: true, id: resume.id });
  } catch (error) {
    console.error('Save resume error:', error);
    res.status(500).json({ error: 'Failed to save resume to database.' });
  }
});

// Resume: Delete resume
app.delete('/api/resumes/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as UserRecord;
    const id = String(req.params.id);
    const deleted = await db.deleteResume(id, user.id);
    res.json({ success: deleted });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume.' });
  }
});

// AI Proxy: Use user's key or server environment key
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, userApiKey } = req.body;
    const headerKey = req.headers['x-gemini-api-key'] as string;
    const apiKey = (userApiKey || headerKey || process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(400).json({
        error: 'Please configure your own Google Gemini API key in the AI Assistant or Account Settings.'
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: systemInstruction
        ? { systemInstruction: String(systemInstruction) }
        : undefined
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const message = error?.message || 'Gemini API call failed. Please check your API key.';
    res.status(500).json({ error: message });
  }
});

// CV Parser: Extracts structured ResumeData from PDF base64 or Raw Text
app.post('/api/parse-cv', async (req: Request, res: Response) => {
  try {
    const { rawText, pdfBase64, userApiKey } = req.body;
    const headerKey = req.headers['x-gemini-api-key'] as string;
    const apiKey = (userApiKey || headerKey || process.env.GEMINI_API_KEY || '').trim();

    let extractedText = (rawText || '').trim();

    // If PDF base64 was sent, extract raw text using pdf-parse
    if (pdfBase64) {
      let parser: any = null;
      try {
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        const pdfBuffer = Buffer.from(cleanBase64, 'base64');
        parser = new PDFParse({ data: pdfBuffer });
        const pdfData = await parser.getText();
        if (pdfData && pdfData.text) {
          extractedText = pdfData.text.trim();
        }
      } catch (pdfErr) {
        console.error('PDF Parse text error:', pdfErr);
      } finally {
        if (parser && typeof parser.destroy === 'function') {
          try {
            await parser.destroy();
          } catch (e) {
            // ignore cleanup errors
          }
        }
      }
    }

    if (!extractedText && !pdfBase64) {
      return res.status(400).json({ error: 'Please provide either a PDF file or CV text to parse.' });
    }

    // If Gemini is available, use Gemini 2.5 Flash to extract 100% structured JSON
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are an expert Resume & CV Parsing Engine specialized in both International and Bangladesh Job Market standards.
Extract the candidate's CV information and return a strictly valid JSON object adhering to this schema:
{
  "personal": {
    "fullName": "Candidate full name",
    "title": "Professional title or role",
    "email": "email address",
    "phone": "phone number",
    "address": "present address",
    "permanentAddress": "permanent address if any",
    "careerObjective": "career objective statement if any",
    "summary": "professional summary if any",
    "fathersName": "father's name if any",
    "mothersName": "mother's name if any",
    "dateOfBirth": "date of birth",
    "religion": "religion if any",
    "maritalStatus": "Single / Married",
    "bloodGroup": "e.g. B+, O+",
    "nid": "national id number",
    "nationality": "Bangladeshi or other",
    "gender": "Male / Female / Other"
  },
  "education": [
    {
      "id": "edu_1",
      "degree": "e.g. B.Sc in CSE / HSC / SSC",
      "institute": "e.g. University / College / School",
      "location": "location",
      "passingYear": "e.g. 2024",
      "grade": "e.g. 3.75 or 5.00",
      "board": "e.g. Dhaka or University"
    }
  ],
  "experience": [
    {
      "id": "exp_1",
      "position": "Job title",
      "company": "Company / Organization",
      "location": "City, Country",
      "startDate": "Start date",
      "endDate": "End date or Present",
      "current": true,
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "languages": [{"id": "lang_1", "name": "English", "level": "Fluent"}],
  "references": [
    {
      "id": "ref_1",
      "name": "Referee name",
      "designation": "Designation",
      "organization": "Organization",
      "phone": "phone",
      "email": "email"
    }
  ]
}
Return ONLY pure JSON. No markdown ticks, no backticks, no comments.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Parse this CV:\n\n${extractedText}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        const jsonStr = (response.text || '').replace(/^```json/g, '').replace(/```$/g, '').trim();
        const parsedData = JSON.parse(jsonStr);
        return res.json({ success: true, data: parsedData, rawText: extractedText });
      } catch (geminiError) {
        console.error('Gemini parse error, falling back to local heuristic:', geminiError);
      }
    }

    // Fallback: Return extracted raw text so client heuristic parser handles it
    res.json({ success: true, rawText: extractedText, isHeuristic: true });
  } catch (err: any) {
    console.error('CV Parse endpoint error:', err);
    res.status(500).json({ error: err?.message || 'Failed to parse CV.' });
  }
});

// -------------------------------------------------------------
// Start Server with Vite or Static Dist
// -------------------------------------------------------------
async function startServer() {
  await initDatabase();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JH Soft CV full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
