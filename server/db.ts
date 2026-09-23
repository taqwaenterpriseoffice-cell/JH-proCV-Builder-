import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

export interface UserRecord {
  id: string;
  shop_name: string;
  owner_name: string;
  email: string;
  phone?: string;
  password_hash: string;
  address?: string;
  gemini_api_key?: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeRecord {
  id: string;
  user_id: string;
  title: string;
  theme: string;
  font: string;
  language: string;
  accent_color: string;
  font_size: string;
  data_json: string;
  print_options_json?: string;
  created_at: string;
  updated_at: string;
}

let mysqlPool: mysql.Pool | null = null;
const localDbDir = path.join(process.cwd(), 'data');
const localDbFile = path.join(localDbDir, 'db.json');

interface LocalDbSchema {
  users: UserRecord[];
  resumes: ResumeRecord[];
}

function readLocalDb(): LocalDbSchema {
  if (!fs.existsSync(localDbDir)) {
    fs.mkdirSync(localDbDir, { recursive: true });
  }
  if (!fs.existsSync(localDbFile)) {
    const initial: LocalDbSchema = { users: [], resumes: [] };
    fs.writeFileSync(localDbFile, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(localDbFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading local database fallback file', err);
    return { users: [], resumes: [] };
  }
}

function writeLocalDb(data: LocalDbSchema) {
  if (!fs.existsSync(localDbDir)) {
    fs.mkdirSync(localDbDir, { recursive: true });
  }
  fs.writeFileSync(localDbFile, JSON.stringify(data, null, 2), 'utf-8');
}

export async function initDatabase() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

  if (host && user && database) {
    try {
      console.log(`Connecting to MySQL at ${host}:${port}/${database}...`);
      mysqlPool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Test connection
      const connection = await mysqlPool.getConnection();
      console.log('MySQL Database connected successfully.');

      // Ensure tables exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) NOT NULL PRIMARY KEY,
          shop_name VARCHAR(191) NOT NULL,
          owner_name VARCHAR(191) NOT NULL,
          email VARCHAR(191) NOT NULL UNIQUE,
          phone VARCHAR(64) NULL,
          password_hash VARCHAR(255) NOT NULL,
          address TEXT NULL,
          gemini_api_key TEXT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS resumes (
          id VARCHAR(64) NOT NULL PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          title VARCHAR(255) NOT NULL,
          theme VARCHAR(64) NOT NULL DEFAULT 'modern',
          font VARCHAR(64) NOT NULL DEFAULT 'Inter',
          language VARCHAR(16) NOT NULL DEFAULT 'en',
          accent_color VARCHAR(32) NOT NULL DEFAULT '#2563eb',
          font_size VARCHAR(16) NOT NULL DEFAULT 'normal',
          data_json LONGTEXT NOT NULL,
          print_options_json TEXT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_resumes_user_id (user_id),
          CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      connection.release();
      return { type: 'mysql', connected: true };
    } catch (error) {
      console.error('MySQL connection failed, falling back to local file database:', error);
      mysqlPool = null;
    }
  } else {
    console.log('No DB_HOST / DB_USER found in environment. Initializing local database file storage for dev/preview.');
  }

  // Local storage initialization
  readLocalDb();
  return { type: 'local_file', connected: true };
}

export const db = {
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    if (mysqlPool) {
      const [rows] = await mysqlPool.query<mysql.RowDataPacket[]>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      return (rows[0] as UserRecord) || null;
    }
    const state = readLocalDb();
    return state.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserById(id: string): Promise<UserRecord | null> {
    if (mysqlPool) {
      const [rows] = await mysqlPool.query<mysql.RowDataPacket[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      return (rows[0] as UserRecord) || null;
    }
    const state = readLocalDb();
    return state.users.find((u) => u.id === id) || null;
  },

  async createUser(user: UserRecord): Promise<void> {
    if (mysqlPool) {
      await mysqlPool.query(
        'INSERT INTO users (id, shop_name, owner_name, email, phone, password_hash, address, gemini_api_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.shop_name, user.owner_name, user.email, user.phone || null, user.password_hash, user.address || null, user.gemini_api_key || null, user.created_at, user.updated_at]
      );
      return;
    }
    const state = readLocalDb();
    state.users.push(user);
    writeLocalDb(state);
  },

  async updateUser(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
    const existing = await this.getUserById(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (mysqlPool) {
      await mysqlPool.query(
        'UPDATE users SET shop_name = ?, owner_name = ?, phone = ?, address = ?, gemini_api_key = ?, updated_at = ? WHERE id = ?',
        [merged.shop_name, merged.owner_name, merged.phone || null, merged.address || null, merged.gemini_api_key || null, merged.updated_at, id]
      );
      return merged;
    }

    const state = readLocalDb();
    state.users = state.users.map((u) => (u.id === id ? merged : u));
    writeLocalDb(state);
    return merged;
  },

  async getResumesByUserId(userId: string): Promise<ResumeRecord[]> {
    if (mysqlPool) {
      const [rows] = await mysqlPool.query<mysql.RowDataPacket[]>(
        'SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC',
        [userId]
      );
      return rows as ResumeRecord[];
    }
    const state = readLocalDb();
    return state.resumes.filter((r) => r.user_id === userId).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  async getResumeById(id: string): Promise<ResumeRecord | null> {
    if (mysqlPool) {
      const [rows] = await mysqlPool.query<mysql.RowDataPacket[]>('SELECT * FROM resumes WHERE id = ? LIMIT 1', [id]);
      return (rows[0] as ResumeRecord) || null;
    }
    const state = readLocalDb();
    return state.resumes.find((r) => r.id === id) || null;
  },

  async saveResume(resume: ResumeRecord): Promise<void> {
    if (mysqlPool) {
      await mysqlPool.query(
        `INSERT INTO resumes (id, user_id, title, theme, font, language, accent_color, font_size, data_json, print_options_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           theme = VALUES(theme),
           font = VALUES(font),
           language = VALUES(language),
           accent_color = VALUES(accent_color),
           font_size = VALUES(font_size),
           data_json = VALUES(data_json),
           print_options_json = VALUES(print_options_json),
           updated_at = VALUES(updated_at)`,
        [
          resume.id,
          resume.user_id,
          resume.title,
          resume.theme,
          resume.font,
          resume.language,
          resume.accent_color,
          resume.font_size,
          resume.data_json,
          resume.print_options_json || null,
          resume.created_at,
          resume.updated_at
        ]
      );
      return;
    }

    const state = readLocalDb();
    const index = state.resumes.findIndex((r) => r.id === resume.id);
    if (index >= 0) {
      state.resumes[index] = resume;
    } else {
      state.resumes.push(resume);
    }
    writeLocalDb(state);
  },

  async deleteResume(id: string, userId: string): Promise<boolean> {
    if (mysqlPool) {
      const [result] = await mysqlPool.query<mysql.ResultSetHeader>(
        'DELETE FROM resumes WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return result.affectedRows > 0;
    }

    const state = readLocalDb();
    const initialLen = state.resumes.length;
    state.resumes = state.resumes.filter((r) => !(r.id === id && r.user_id === userId));
    writeLocalDb(state);
    return state.resumes.length < initialLen;
  }
};
