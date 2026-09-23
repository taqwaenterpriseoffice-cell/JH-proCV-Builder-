import { ResumeDocument } from '../types';
import { authService } from './authService';

export const cloudResumeService = {
  async fetchUserResumes(): Promise<ResumeDocument[] | null> {
    const token = authService.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.resumes || [];
    } catch (err) {
      console.error('Failed to fetch user resumes from cloud', err);
      return null;
    }
  },

  async saveResumeToCloud(resume: ResumeDocument): Promise<boolean> {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(resume)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save resume to cloud', err);
      return false;
    }
  },

  async deleteResumeFromCloud(id: string): Promise<boolean> {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete resume from cloud', err);
      return false;
    }
  },

  async syncAllResumes(resumes: ResumeDocument[]): Promise<{ success: number; failed: number }> {
    const token = authService.getToken();
    if (!token) return { success: 0, failed: resumes.length };

    let success = 0;
    let failed = 0;

    for (const resume of resumes) {
      const ok = await this.saveResumeToCloud(resume);
      if (ok) success++;
      else failed++;
    }

    return { success, failed };
  }
};
