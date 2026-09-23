import React, { useState, useCallback } from 'react';
import { 
  User, Briefcase, GraduationCap, Code, FolderGit2,
  Share2, Plus, Trash2, Sparkles, ChevronDown, ChevronUp, 
  X, Check, ZoomIn, Loader2, Award, Globe, ShieldCheck,
  ArrowUp, ArrowDown, ArrowRight, ExternalLink, HelpCircle, Users, FileCheck, Mail, FileUp
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { 
  ResumeData, Education, WorkExperience, Project, 
  Certification, LanguageSkill, Award as AwardType, Language 
} from '../types';
import { 
  generateProfessionalSummary, 
  suggestSkills, 
  improveExperienceBullets 
} from '../services/aiService';
import { calculateBDAge } from '../templates/layouts/BDGovtBioDataLayout';

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  language: Language;
  onOpenAIModal?: () => void;
  onOpenCoverLetter?: () => void;
  onOpenImportModal?: () => void;
  darkMode?: boolean;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const ResumeForm: React.FC<Props> = ({ 
  data, 
  onChange, 
  language, 
  onOpenAIModal, 
  onOpenCoverLetter,
  onOpenImportModal,
  darkMode 
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string>('personal');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [improvingExpId, setImprovingExpId] = useState<string | null>(null);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Image Cropper State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(prev => prev === section ? '' : section);
  };

  // 1. Personal Info
  const updatePersonal = (field: string, value: string) => {
    onChange({
      ...data,
      personal: { ...data.personal, [field]: value }
    });
  };

  // Image Cropping logic
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    canvas.width = Math.min(pixelCrop.width, 400);
    canvas.height = Math.min(pixelCrop.height, 400);
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return canvas.toDataURL('image/jpeg', 0.88);
  };

  const handleSaveCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        if (croppedImage) {
          updatePersonal('photo', croppedImage);
          setImageToCrop(null);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 2. Summary AI
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateProfessionalSummary(data, language, 'modern');
      if (summary) {
        updatePersonal('summary', summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // 3. Work Experience
  const addExperience = () => {
    const newItem: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      duration: '',
      location: '',
      description: ''
    };
    onChange({ ...data, experience: [...(data.experience || []), newItem] });
    setActiveAccordion('experience');
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    const updated = (data.experience || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, experience: updated });
  };

  const deleteExperience = (id: string) => {
    onChange({ ...data, experience: (data.experience || []).filter(item => item.id !== id) });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const list = [...(data.experience || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    onChange({ ...data, experience: list });
  };

  const handleImproveExperienceBullets = async (id: string) => {
    const exp = (data.experience || []).find(e => e.id === id);
    if (!exp || !exp.description.trim()) return;
    setImprovingExpId(id);
    try {
      const improved = await improveExperienceBullets(
        exp.position || data.personal.title,
        exp.company || '',
        exp.description,
        language
      );
      updateExperience(id, 'description', improved);
    } catch (e) {
      console.error(e);
    } finally {
      setImprovingExpId(null);
    }
  };

  // 4. Education
  const addEducation = () => {
    const newItem: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      institute: '',
      year: '',
      result: '',
      location: '',
      description: ''
    };
    onChange({ ...data, education: [...(data.education || []), newItem] });
    setActiveAccordion('education');
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = (data.education || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, education: updated });
  };

  const deleteEducation = (id: string) => {
    onChange({ ...data, education: (data.education || []).filter(item => item.id !== id) });
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const list = [...(data.education || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    onChange({ ...data, education: list });
  };

  // 5. Projects
  const addProject = () => {
    const newItem: Project = {
      id: `proj-${Date.now()}`,
      title: '',
      tech: '',
      description: '',
      link: ''
    };
    onChange({ ...data, projects: [...(data.projects || []), newItem] });
    setActiveAccordion('projects');
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    const updated = (data.projects || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, projects: updated });
  };

  const deleteProject = (id: string) => {
    onChange({ ...data, projects: (data.projects || []).filter(item => item.id !== id) });
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const list = [...(data.projects || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    onChange({ ...data, projects: list });
  };

  // 6. Skills
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({ ...data, skills: [...data.skills, trimmed] });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange({ ...data, skills: data.skills.filter(s => s !== skillToRemove) });
  };

  const handleSuggestSkills = async () => {
    setIsSuggestingSkills(true);
    try {
      const skills = await suggestSkills(data, language);
      const unique = skills.filter(s => !data.skills.some(existing => existing.toLowerCase() === s.toLowerCase()));
      setSuggestedSkills(unique);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  // 7. Certifications
  const addCertification = () => {
    const newItem: Certification = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      url: ''
    };
    onChange({ ...data, certifications: [...(data.certifications || []), newItem] });
    setActiveAccordion('certifications');
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    const updated = (data.certifications || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, certifications: updated });
  };

  const deleteCertification = (id: string) => {
    onChange({ ...data, certifications: (data.certifications || []).filter(item => item.id !== id) });
  };

  // 8. Languages
  const addLanguageSkill = () => {
    const newItem: LanguageSkill = {
      id: `lang-${Date.now()}`,
      name: '',
      level: 'Fluent'
    };
    onChange({ ...data, languages: [...(data.languages || []), newItem] });
    setActiveAccordion('languages');
  };

  const updateLanguageSkill = (id: string, field: keyof LanguageSkill, value: string) => {
    const updated = (data.languages || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, languages: updated });
  };

  const deleteLanguageSkill = (id: string) => {
    onChange({ ...data, languages: (data.languages || []).filter(item => item.id !== id) });
  };

  // 9. Awards
  const addAward = () => {
    const newItem: AwardType = {
      id: `award-${Date.now()}`,
      title: '',
      issuer: '',
      year: '',
      description: ''
    };
    onChange({ ...data, awards: [...(data.awards || []), newItem] });
    setActiveAccordion('awards');
  };

  const updateAward = (id: string, field: keyof AwardType, value: string) => {
    const updated = (data.awards || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, awards: updated });
  };

  const deleteAward = (id: string) => {
    onChange({ ...data, awards: (data.awards || []).filter(item => item.id !== id) });
  };

  // 10. Socials
  const updateSocials = (field: string, value: string) => {
    onChange({
      ...data,
      socials: { ...data.socials, [field]: value }
    });
  };

  // 11. References
  const addReference = () => {
    const newItem = {
      id: `ref-${Date.now()}`,
      name: '',
      designation: '',
      organization: '',
      phone: '',
      email: '',
      address: '',
      relation: ''
    };
    onChange({ ...data, references: [...(data.references || []), newItem] });
    setActiveAccordion('references');
  };

  const updateReference = (id: string, field: string, value: string) => {
    const updated = (data.references || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, references: updated });
  };

  const deleteReference = (id: string) => {
    onChange({ ...data, references: (data.references || []).filter(item => item.id !== id) });
  };

  // 12. Declaration & Signature
  const updateDeclaration = (field: string, value: any) => {
    onChange({
      ...data,
      declaration: {
        ...(data.declaration || {
          enabled: true,
          text: 'I hereby declare that all the information stated in this Curriculum Vitae is true, correct, and authentic to the best of my knowledge and belief.',
          date: '',
          place: ''
        }),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* MATCHING COVER LETTER QUICK ACTION */}
      {onOpenCoverLetter && (
        <div className="p-3 sm:p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <span>Matching Cover Letter Available</span>
                <span className="text-[10px] bg-emerald-200/70 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.2 rounded font-black uppercase">
                  1-Click
                </span>
              </h4>
              <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400 truncate">
                Synchronized with your CV's font, color &amp; contact info
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCoverLetter}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs transition-all flex items-center gap-1"
          >
            <span>Open Studio</span>
            <ExternalLink size={12} />
          </button>
        </div>
      )}

      {/* AUTO-FILL FROM OLD CV / PDF BANNER */}
      {onOpenImportModal && (
        <div className="p-3 sm:p-3.5 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-indigo-950/40 border border-indigo-200/90 dark:border-indigo-800/60 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileUp size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <span>Have an Existing CV or BDJobs Profile?</span>
                <span className="text-[10px] bg-indigo-200/70 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.2 rounded font-black uppercase">
                  5 Sec
                </span>
              </h4>
              <p className="text-[11px] text-indigo-700/90 dark:text-indigo-400 truncate">
                Upload your old PDF or paste raw text to auto-fill all sections automatically
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenImportModal}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs transition-all flex items-center gap-1"
          >
            <span>Import CV</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* SECTION 1: PERSONAL INFORMATION */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('personal')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Personal Information
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Contact details, target job title, and headshot
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data.personal.fullName && (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                {data.personal.fullName}
              </span>
            )}
            {activeAccordion === 'personal' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'personal' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {/* Photo & Basic Details */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
                {/* Photo 1 (Primary) */}
                <div className="relative group text-center flex-shrink-0">
                  <div className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shadow-inner">
                    {data.personal.photo ? (
                      <img 
                        src={data.personal.photo} 
                        alt="Profile 1" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex flex-col items-center p-1 text-slate-400">
                        <User size={22} />
                        <span className="text-[8px] font-bold mt-1">Photo 1</span>
                      </div>
                    )}
                  </div>
                  {data.personal.photo && (
                    <button
                      type="button"
                      onClick={() => updatePersonal('photo', '')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600"
                      title="Remove Photo 1"
                    >
                      <X size={12} />
                    </button>
                  )}
                  <span className="text-[9px] font-bold text-slate-400 block mt-1">Main Copy</span>
                </div>

                {/* Photo 2 (Attested Copy or Second Slot) */}
                <div className="relative group text-center flex-shrink-0">
                  <div className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shadow-inner">
                    {data.personal.photo2 || data.personal.photo ? (
                      <img 
                        src={data.personal.photo2 || data.personal.photo} 
                        alt="Profile 2" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex flex-col items-center p-1 text-slate-400">
                        <User size={22} />
                        <span className="text-[8px] font-bold mt-1 text-center">Photo 2</span>
                      </div>
                    )}
                  </div>
                  {data.personal.photo2 && (
                    <button
                      type="button"
                      onClick={() => updatePersonal('photo2', '')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600"
                      title="Remove Photo 2"
                    >
                      <X size={12} />
                    </button>
                  )}
                  <span className="text-[9px] font-bold text-slate-400 block mt-1">2nd Copy</span>
                </div>

                {/* Photo 3 (Third Slot for Govt/Triple Photo Mode) */}
                <div className="relative group text-center flex-shrink-0">
                  <div className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shadow-inner">
                    {data.personal.photo3 || data.personal.photo ? (
                      <img 
                        src={data.personal.photo3 || data.personal.photo} 
                        alt="Profile 3" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex flex-col items-center p-1 text-slate-400">
                        <User size={22} />
                        <span className="text-[8px] font-bold mt-1 text-center">Photo 3</span>
                      </div>
                    )}
                  </div>
                  {data.personal.photo3 && (
                    <button
                      type="button"
                      onClick={() => updatePersonal('photo3', '')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600"
                      title="Remove Photo 3"
                    >
                      <X size={12} />
                    </button>
                  )}
                  <span className="text-[9px] font-bold text-slate-400 block mt-1">3rd Copy</span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm">
                    <span>Upload &amp; Crop Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                  {data.personal.photo && !data.personal.photo2 && (
                    <button
                      type="button"
                      onClick={() => updatePersonal('photo2', data.personal.photo || '')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>2-Photo Copy</span>
                    </button>
                  )}
                  {data.personal.photo && !data.personal.photo3 && (
                    <button
                      type="button"
                      onClick={() => updatePersonal('photo3', data.personal.photo || '')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>3-Photo Copy (Govt)</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Standard Bangladesh Passport Size (35mm × 45mm / 2&quot; × 2&quot;). Single, 2-copy or 3-copy.
                </p>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={data.personal.fullName}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  placeholder="e.g. Mohammad Rahim Uddin"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Target Job Title *
                </label>
                <input
                  type="text"
                  value={data.personal.title}
                  onChange={(e) => updatePersonal('title', e.target.value)}
                  placeholder="e.g. Senior Officer / Software Engineer"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Father&apos;s Name (পিতার নাম)
                </label>
                <input
                  type="text"
                  value={data.personal.fatherName || ''}
                  onChange={(e) => updatePersonal('fatherName', e.target.value)}
                  placeholder="e.g. Md. Abdul Karim"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Mother&apos;s Name (মাতার নাম)
                </label>
                <input
                  type="text"
                  value={data.personal.motherName || ''}
                  onChange={(e) => updatePersonal('motherName', e.target.value)}
                  placeholder="e.g. Begum Rokeya"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  placeholder="e.g. rahim.uddin@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={data.personal.phone}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Present Address (বর্তমান ঠিকানা)
                </label>
                <input
                  type="text"
                  value={data.personal.address}
                  onChange={(e) => updatePersonal('address', e.target.value)}
                  placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka-1205"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Permanent Address (স্থায়ী ঠিকানা)
                </label>
                <input
                  type="text"
                  value={data.personal.permanentAddress || ''}
                  onChange={(e) => updatePersonal('permanentAddress', e.target.value)}
                  placeholder="e.g. Vill: Joypur, P.O: Chandpur, Dist: Cumilla"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Date of Birth (জন্ম তারিখ)
                </label>
                <input
                  type="text"
                  value={data.personal.dob || ''}
                  onChange={(e) => updatePersonal('dob', e.target.value)}
                  placeholder="e.g. 15 March 1996"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  National ID / NID / Birth Cert. (জাতীয় পরিচয়পত্র নং)
                </label>
                <input
                  type="text"
                  value={data.personal.nid || ''}
                  onChange={(e) => updatePersonal('nid', e.target.value)}
                  placeholder="e.g. 19961234567890123"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Religion (ধর্ম)
                </label>
                <input
                  type="text"
                  value={data.personal.religion || ''}
                  onChange={(e) => updatePersonal('religion', e.target.value)}
                  placeholder="e.g. Islam / Hinduism / Christianity / Buddhism"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Marital Status (বৈবাহিক অবস্থা)
                </label>
                <input
                  type="text"
                  value={data.personal.maritalStatus || ''}
                  onChange={(e) => updatePersonal('maritalStatus', e.target.value)}
                  placeholder="e.g. Single / Married"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Blood Group (রক্তের গ্রুপ)
                </label>
                <input
                  type="text"
                  value={data.personal.bloodGroup || ''}
                  onChange={(e) => updatePersonal('bloodGroup', e.target.value)}
                  placeholder="e.g. B (+ve) / A (+ve) / O (+ve)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Personal Website / Portfolio
                </label>
                <input
                  type="text"
                  value={data.personal.website || ''}
                  onChange={(e) => updatePersonal('website', e.target.value)}
                  placeholder="e.g. https://myprofile.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BD Govt Specific Fields Block */}
              <div className="sm:col-span-2 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-emerald-200 dark:border-emerald-900/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-300">
                      বাংলাদেশ সরকারি চাকরি / বিডি গভর্মেন্ট বায়ো-ডাটা ফিল্ডস (BD Govt Job Specifics)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">
                    জনপ্রশাসন ও সরকারি চাকুরীর নির্ধারিত ফরম্যাট
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      প্রার্থীর নাম (বাংলায়)
                    </label>
                    <input
                      type="text"
                      value={data.personal.fullNameBn || ''}
                      onChange={(e) => updatePersonal('fullNameBn', e.target.value)}
                      placeholder="যেমন: মোঃ জহিরুল হাসান অনিক"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      নিজ জেলা (Home District)
                    </label>
                    <input
                      type="text"
                      value={data.personal.homeDistrict || ''}
                      onChange={(e) => updatePersonal('homeDistrict', e.target.value)}
                      placeholder="যেমন: ঢাকা / কুমিল্লা / চট্টগ্রাম / চাঁদপুর"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      কোটা সংক্রান্ত তথ্য (Quota Category)
                    </label>
                    <select
                      value={data.personal.quota || ''}
                      onChange={(e) => updatePersonal('quota', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">প্রযোজ্য নহে (সাধারণ কোটা)</option>
                      <option value="মুক্তিযোদ্ধা / শহীদ মুক্তিযোদ্ধার সন্তান">মুক্তিযোদ্ধা / শহীদ মুক্তিযোদ্ধার সন্তান</option>
                      <option value="মুক্তিযোদ্ধার নাতি-নাতনি">মুক্তিযোদ্ধার নাতি-নাতনি</option>
                      <option value="ক্ষুদ্র নৃ-গোষ্ঠী কোটা">ক্ষুদ্র নৃ-গোষ্ঠী কোটা</option>
                      <option value="শারীরিক প্রতিবন্ধী ও এতিম কোটা">শারীরিক প্রতিবন্ধী ও এতিম কোটা</option>
                      <option value="আনসার ও গ্রাম প্রতিরক্ষা সদস্য কোটা">আনসার ও গ্রাম প্রতিরক্ষা সদস্য কোটা</option>
                      <option value="অন্যান্য কোটা">অন্যান্য কোটা</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      বিজ্ঞপ্তি নং ও তারিখ (Circular No & Date)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={data.personal.circularNo || ''}
                        onChange={(e) => updatePersonal('circularNo', e.target.value)}
                        placeholder="বিজ্ঞপ্তি নং"
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                      />
                      <input
                        type="date"
                        value={data.personal.circularDate || ''}
                        onChange={(e) => {
                          const cDate = e.target.value;
                          updatePersonal('circularDate', cDate);
                          if (data.personal.dob) {
                            const calculated = calculateBDAge(data.personal.dob, cDate, true);
                            if (calculated) updatePersonal('ageText', calculated);
                          }
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        বিজ্ঞপ্তির তারিখে প্রার্থীর বয়স (Age on Circular Date)
                      </label>
                      {data.personal.dob && (
                        <button
                          type="button"
                          onClick={() => {
                            const calculated = calculateBDAge(data.personal.dob, data.personal.circularDate, true);
                            if (calculated) updatePersonal('ageText', calculated);
                          }}
                          className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>অটো ক্যালকুলেট করুন (Auto Calculate)</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={data.personal.ageText || ''}
                      onChange={(e) => updatePersonal('ageText', e.target.value)}
                      placeholder="যেমন: ২৭ বছর ০৩ মাস ১৫ দিন"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: EXECUTIVE SUMMARY */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('summary')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Professional Executive Summary
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                2-4 sentence career overview capturing your top achievements
              </p>
            </div>
          </div>
          {activeAccordion === 'summary' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {activeAccordion === 'summary' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                {data.personal.summary ? `${data.personal.summary.length} characters` : 'No summary written yet'}
              </span>

              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isGeneratingSummary ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Sparkles size={13} />
                )}
                <span>{isGeneratingSummary ? 'Drafting...' : 'AI Auto-Draft'}</span>
              </button>
            </div>

            <textarea
              value={data.personal.summary}
              onChange={(e) => updatePersonal('summary', e.target.value)}
              rows={3}
              placeholder="Write a compelling executive summary or click 'AI Auto-Draft' to generate one tailored to your profile..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs leading-relaxed font-normal outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Career Objective (ক্যারিয়ার অবজেক্টিভ)
                </label>
                <span className="text-[10px] text-slate-400">
                  Often required for Bangladesh BD Jobs, Banks &amp; Freshers
                </span>
              </div>
              <textarea
                value={data.personal.careerObjective || ''}
                onChange={(e) => updatePersonal('careerObjective', e.target.value)}
                rows={3}
                placeholder="e.g. To secure a challenging and responsible position in a dynamic organization where I can apply my academic background and analytical skills to contribute towards organizational goals..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs leading-relaxed font-normal outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: WORK EXPERIENCE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('experience')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Work Experience
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {(data.experience || []).length} recorded employment positions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
              {(data.experience || []).length}
            </span>
            {activeAccordion === 'experience' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'experience' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
            {(data.experience || []).map((exp, index) => (
              <div 
                key={exp.id} 
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-3 relative group"
              >
                {/* Item Top Controls */}
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                      {exp.position || 'Untitled Role'} {exp.company ? `@ ${exp.company}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveExperience(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => moveExperience(index, 'down')}
                      disabled={index === (data.experience.length - 1)}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="Delete Experience"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Job Title / Role</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="e.g. Google Cloud"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Duration / Period</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                      placeholder="e.g. 2021 - Present"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      placeholder="e.g. San Francisco, CA (or Remote)"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-500">
                      Key Responsibilities &amp; Impact (Use • for bullets)
                    </label>

                    <button
                      onClick={() => handleImproveExperienceBullets(exp.id)}
                      disabled={improvingExpId === exp.id || !exp.description.trim()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                    >
                      {improvingExpId === exp.id ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Sparkles size={11} />
                      )}
                      <span>AI STAR Bullets</span>
                    </button>
                  </div>

                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={4}
                    placeholder="• Spearheaded development of..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs leading-relaxed outline-none"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addExperience}
              className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              <span>Add Work Experience</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 4: EDUCATION */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('education')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Education &amp; Academics
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {(data.education || []).length} degrees or credentials
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
              {(data.education || []).length}
            </span>
            {activeAccordion === 'education' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'education' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
            {(data.education || []).map((edu, index) => (
              <div 
                key={edu.id} 
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                      {edu.degree || 'Degree'} {edu.institute ? `@ ${edu.institute}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveEducation(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => moveEducation(index, 'down')}
                      disabled={index === (data.education.length - 1)}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="Delete Education"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Degree / Certificate</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="e.g. B.S. in Computer Science, HSC, SSC"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institute}
                      onChange={(e) => updateEducation(edu.id, 'institute', e.target.value)}
                      placeholder="e.g. Stanford University / Dhaka College"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Board / University (বোর্ড)</label>
                    <input
                      type="text"
                      value={edu.board || ''}
                      onChange={(e) => updateEducation(edu.id, 'board', e.target.value)}
                      placeholder="e.g. Dhaka, Rajshahi, Cumilla Board"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Group / Major / Field (বিভাগ/বিষয়)</label>
                    <input
                      type="text"
                      value={edu.group || ''}
                      onChange={(e) => updateEducation(edu.id, 'group', e.target.value)}
                      placeholder="e.g. Science, Commerce, Arts, CSE"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Year / Dates</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                      placeholder="e.g. 2016 - 2020"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Grade / GPA / Honors</label>
                    <input
                      type="text"
                      value={edu.result}
                      onChange={(e) => updateEducation(edu.id, 'result', e.target.value)}
                      placeholder="e.g. GPA 5.00 / CGPA 3.85"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addEducation}
              className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              <span>Add Education</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 5: PROJECTS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('projects')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FolderGit2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Key Projects &amp; Case Studies
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {(data.projects || []).length} highlighted initiatives
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
              {(data.projects || []).length}
            </span>
            {activeAccordion === 'projects' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'projects' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
            {(data.projects || []).map((proj, index) => (
              <div 
                key={proj.id} 
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                      {proj.title || 'Untitled Project'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveProject(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => moveProject(index, 'down')}
                      disabled={index === (data.projects.length - 1)}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="Delete Project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Project Name</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                      placeholder="e.g. Enterprise Cloud Orchestrator"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Project Link / Repo</label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                      placeholder="e.g. github.com/username/project"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Technologies Used</label>
                  <input
                    type="text"
                    value={proj.tech}
                    onChange={(e) => updateProject(proj.id, 'tech', e.target.value)}
                    placeholder="e.g. React, TypeScript, Docker, Kubernetes"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Description &amp; Metrics</label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                    rows={2}
                    placeholder="High-level description of what the project solved and its impact..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addProject}
              className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              <span>Add Project</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 6: SKILLS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('skills')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Code size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Skills &amp; Proficiencies
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {data.skills.length} technical &amp; professional capabilities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
              {data.skills.length}
            </span>
            {activeAccordion === 'skills' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'skills' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {/* Input & AI Trigger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkillInput);
                      setNewSkillInput('');
                    }
                  }}
                  placeholder="Type a skill and press Enter..."
                  className="bg-transparent text-xs font-semibold outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddSkill(newSkillInput);
                    setNewSkillInput('');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2 py-1 bg-blue-50 dark:bg-blue-950/80 rounded-lg"
                >
                  Add
                </button>
              </div>

              <button
                type="button"
                onClick={handleSuggestSkills}
                disabled={isSuggestingSkills}
                aria-label="AI Suggest Skills based on job title and experience"
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
              >
                {isSuggestingSkills ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Sparkles size={13} />
                )}
                <span>{isSuggestingSkills ? 'Suggesting Skills...' : 'AI Suggest Skills'}</span>
              </button>
            </div>

            {/* AI Suggested Chips */}
            {suggestedSkills.length > 0 && (
              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    AI Suggested Skills
                  </span>
                  <button
                    onClick={() => {
                      suggestedSkills.forEach(handleAddSkill);
                      setSuggestedSkills([]);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    + Add All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedSkills.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        handleAddSkill(s);
                        setSuggestedSkills(prev => prev.filter(item => item !== s));
                      }}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Skills Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title={`Remove ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 7: CERTIFICATIONS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('certifications')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Certifications &amp; Licenses
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {(data.certifications || []).length} professional credentials
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
              {(data.certifications || []).length}
            </span>
            {activeAccordion === 'certifications' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'certifications' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {(data.certifications || []).map((cert) => (
              <div 
                key={cert.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {cert.name || 'New Certification'}
                  </span>
                  <button
                    onClick={() => deleteCertification(cert.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="Certification Name"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    placeholder="Issuer (e.g. AWS)"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                  />
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                    placeholder="Year / Valid thru"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addCertification}
              className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus size={13} />
              <span>Add Certification</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 8: LANGUAGES */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('languages')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Globe size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Languages
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {(data.languages || []).length} languages spoken
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
              {(data.languages || []).length}
            </span>
            {activeAccordion === 'languages' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'languages' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {(data.languages || []).map((lang) => (
              <div key={lang.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => updateLanguageSkill(lang.id, 'name', e.target.value)}
                  placeholder="Language (e.g. English)"
                  className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                />
                <select
                  value={lang.level}
                  onChange={(e) => updateLanguageSkill(lang.id, 'level', e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                >
                  <option value="Native / Bilingual">Native / Bilingual</option>
                  <option value="Full Professional">Full Professional</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Elementary">Elementary</option>
                </select>
                <button
                  onClick={() => deleteLanguageSkill(lang.id)}
                  className="p-2 text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={addLanguageSkill}
              className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus size={13} />
              <span>Add Language</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 9: AWARDS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('awards')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Award size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Honors &amp; Awards
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {(data.awards || []).length} recorded recognitions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
              {(data.awards || []).length}
            </span>
            {activeAccordion === 'awards' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'awards' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {(data.awards || []).map((award) => (
              <div 
                key={award.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {award.title || 'Honor / Award'}
                  </span>
                  <button onClick={() => deleteAward(award.id)} className="p-1 text-slate-400 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                    placeholder="Award Title"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                  />
                  <input
                    type="text"
                    value={award.issuer}
                    onChange={(e) => updateAward(award.id, 'issuer', e.target.value)}
                    placeholder="Issuer / Organization"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addAward}
              className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus size={13} />
              <span>Add Honor / Award</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 10: SOCIAL & CONTACT LINKS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('socials')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Social Profiles &amp; Web Links
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                LinkedIn, GitHub, Portfolio, Twitter/X
              </p>
            </div>
          </div>
          {activeAccordion === 'socials' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {activeAccordion === 'socials' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={data.socials.linkedin}
                  onChange={(e) => updateSocials('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={data.socials.github}
                  onChange={(e) => updateSocials('github', e.target.value)}
                  placeholder="github.com/username"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Personal Portfolio</label>
                <input
                  type="text"
                  value={data.socials.portfolio}
                  onChange={(e) => updateSocials('portfolio', e.target.value)}
                  placeholder="username.dev"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Twitter / X</label>
                <input
                  type="text"
                  value={data.socials.twitter || ''}
                  onChange={(e) => updateSocials('twitter', e.target.value)}
                  placeholder="twitter.com/username"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 11: REFERENCES */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('references')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                References (রেফারেন্স)
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {(data.references || []).length} professional or academic referees
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
              {(data.references || []).length}
            </span>
            {activeAccordion === 'references' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'references' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {(data.references || []).map((ref, index) => (
              <div 
                key={ref.id} 
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {ref.name || 'Untitled Referee'}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteReference(ref.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Delete Reference"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Full Name &amp; Title *</label>
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                      placeholder="e.g. Prof. Dr. Mohammad Shamsul Alam"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Designation / Role *</label>
                    <input
                      type="text"
                      value={ref.designation}
                      onChange={(e) => updateReference(ref.id, 'designation', e.target.value)}
                      placeholder="e.g. Professor &amp; Chairman / Senior Director"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Organization / Institute *</label>
                    <input
                      type="text"
                      value={ref.organization}
                      onChange={(e) => updateReference(ref.id, 'organization', e.target.value)}
                      placeholder="e.g. University of Dhaka / Brain Station 23"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Relation</label>
                    <input
                      type="text"
                      value={ref.relation || ''}
                      onChange={(e) => updateReference(ref.id, 'relation', e.target.value)}
                      placeholder="e.g. Academic Supervisor / Former Manager"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={ref.phone}
                      onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                      placeholder="+880 1711-xxxxxx"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={ref.email}
                      onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                      placeholder="referee@example.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addReference}
              className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus size={13} />
              <span>Add Referee (নতুন রেফারেন্স যোগ করুন)</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 12: DECLARATION & SIGNATURE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleAccordion('declaration')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileCheck size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Declaration &amp; Digital Signature (ঘোষণাপত্র ও স্বাক্ষর)
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Official CV declaration text, signing date, place, and signature
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              {data.declaration?.enabled !== false ? 'Active' : 'Disabled'}
            </span>
            {activeAccordion === 'declaration' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>

        {activeAccordion === 'declaration' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Enable Declaration &amp; Signature on CV
              </span>
              <input
                type="checkbox"
                checked={data.declaration?.enabled !== false}
                onChange={(e) => updateDeclaration('enabled', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {data.declaration?.enabled !== false && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-500">
                      Declaration Text (ঘোষণাপত্র বয়ান)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateDeclaration('text', 'I hereby declare that all the information stated in this Curriculum Vitae is true, correct, and authentic to the best of my knowledge and belief.')}
                        className="text-[10px] text-blue-600 hover:underline font-medium"
                      >
                        English Preset
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDeclaration('text', 'আমি এই মর্মে অঙ্গীকার করিতেছি যে, উপরে বর্ণিত যাবতীয় তথ্যাবলি আমার জ্ঞান ও বিশ্বাস মতে সম্পূর্ণ সত্য ও নির্ভুল।')}
                        className="text-[10px] text-blue-600 hover:underline font-medium"
                      >
                        বাংলা প্রিসেট
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={data.declaration?.text || ''}
                    onChange={(e) => updateDeclaration('text', e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-normal outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Signing Date (তারিখ)
                    </label>
                    <input
                      type="text"
                      value={data.declaration?.date || ''}
                      onChange={(e) => updateDeclaration('date', e.target.value)}
                      placeholder="e.g. 17 September 2026"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Signing Place (স্থান)
                    </label>
                    <input
                      type="text"
                      value={data.declaration?.place || ''}
                      onChange={(e) => updateDeclaration('place', e.target.value)}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Digital Signature Text or Candidate Name
                  </label>
                  <input
                    type="text"
                    value={data.personal.signature || data.personal.fullName}
                    onChange={(e) => updatePersonal('signature', e.target.value)}
                    placeholder="Candidate Signature Text"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold font-serif italic outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    রেজুমি বা বায়োডাটার নিচে অফিসিয়াল স্বাক্ষর হিসেবে প্রদর্শিত হবে।
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* IMAGE CROP MODAL */}
      {imageToCrop && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Crop Profile Headshot</h3>
              <button 
                onClick={() => setImageToCrop(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="relative h-64 sm:h-72 w-full bg-slate-950">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={true}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <ZoomIn size={16} className="text-slate-400" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setImageToCrop(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCrop}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Check size={14} />
                  <span>Crop &amp; Apply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;
