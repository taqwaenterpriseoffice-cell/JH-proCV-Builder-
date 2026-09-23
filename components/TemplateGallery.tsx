import React, { useState, useMemo } from 'react';
import { 
  Search, Sparkles, Eye, ArrowRight, ShieldCheck, 
  ArrowLeft, Check, LayoutGrid, SlidersHorizontal, Layers
} from 'lucide-react';
import { ThemeOption, ThemeType } from '../types';
import { THEMES, DEFAULT_DATA, DEFAULT_PRINT_OPTIONS } from '../constants';
import { ResumePreview } from './ResumePreview';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface TemplateGalleryProps {
  onSelectTemplate: (themeId: ThemeType, initialFont?: string, initialAccent?: string) => void;
  onBackToDashboard: () => void;
  darkMode: boolean;
  activeResumeTheme?: ThemeType;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onBackToDashboard,
  darkMode,
  activeResumeTheme
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewingTemplate, setPreviewingTemplate] = useState<ThemeOption | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 12;

  // Category Tabs
  const categories = useMemo(() => {
    const set = new Set<string>();
    THEMES.forEach(t => set.add(t.category));
    set.delete('Bangladesh Formats');
    return ['All', 'Bangladesh Formats', 'ATS High-Score', ...Array.from(set)];
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return THEMES.filter(t => {
      // Category filter
      if (selectedCategory === 'ATS High-Score') {
        if (!t.tags?.some(tag => tag.toLowerCase().includes('ats')) && (t.atsScore || 0) < 95) {
          return false;
        }
      } else if (selectedCategory !== 'All' && t.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesLabel = t.label.toLowerCase().includes(query);
        const matchesCategory = t.category.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        const matchesTags = t.tags?.some(tag => tag.toLowerCase().includes(query));
        const matchesRecommended = t.recommendedFor?.toLowerCase().includes(query);
        return matchesLabel || matchesCategory || matchesDesc || matchesTags || matchesRecommended;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredTemplates.length / PAGE_SIZE) || 1;
  const displayedTemplates = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTemplates.slice(start, start + PAGE_SIZE);
  }, [filteredTemplates, currentPage, PAGE_SIZE]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation & Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            {THEMES.length} Professional Designs
          </span>
        </div>

        {/* Page Hero Title */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          darkMode 
            ? 'bg-slate-900/90 border-slate-800 text-white' 
            : 'bg-white border-slate-200/90 shadow-sm text-slate-900'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                <Sparkles size={13} />
                <span>Recruiter-Tested Templates</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Select Your Resume Template
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose a foundation tailored to your career level and industry. Every template is engineered for ATS compliance, crisp single-page presentation, and flexible typography customization.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="w-full md:w-72 relative">
              <label htmlFor="template-search" className="sr-only">Search templates</label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={15} />
              </div>
              <input
                id="template-search"
                type="text"
                placeholder="Search 70+ templates, roles, ATS..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 scrollbar-none" role="tablist" aria-label="Template Categories">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = cat === 'All' 
                ? THEMES.length 
                : cat === 'ATS High-Score' 
                  ? THEMES.filter(t => (t.atsScore || 0) >= 95).length
                  : THEMES.filter(t => t.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm scale-102'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] ${isActive ? 'opacity-80' : 'text-slate-400'}`}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 space-y-4 p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            No templates match "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try searching for different terms like "executive", "ats", "developer", or clear your filter.
          </p>
          <button
            type="button"
            onClick={() => { handleSearchChange(''); handleCategorySelect('All'); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            Show All Templates
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-800 dark:text-slate-200">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredTemplates.length)}</strong> of <strong className="text-slate-800 dark:text-slate-200">{filteredTemplates.length}</strong> templates
            </span>
            {totalPages > 1 && (
              <span>Page {currentPage} of {totalPages}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {displayedTemplates.map((template) => {
              const isCurrentlyActive = activeResumeTheme === template.id;

            return (
              <div
                key={template.id}
                id={`template-card-${template.id}`}
                className={`group rounded-3xl border transition-all flex flex-col overflow-hidden shadow-sm hover:shadow-xl ${
                  isCurrentlyActive
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : darkMode 
                      ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                      : 'bg-white border-slate-200 hover:border-blue-400/80'
                }`}
              >
                {/* Visual Thumbnail Area (Realistic Live Scaled Miniature) */}
                <div className="relative h-64 sm:h-72 bg-slate-100 dark:bg-slate-950 overflow-hidden border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-center p-3">
                  {/* Miniature Scaled Resume */}
                  <div 
                    className="w-[780px] pointer-events-none select-none transform scale-[0.27] sm:scale-[0.29] origin-top rounded-sm shadow-md transition-transform duration-300 group-hover:scale-[0.29] sm:group-hover:scale-[0.31]"
                    aria-hidden="true"
                  >
                    <ResumePreview
                      data={DEFAULT_DATA}
                      theme={template.id}
                      font="Inter"
                      language="en"
                      printOptions={DEFAULT_PRINT_OPTIONS}
                      accentColor="#2563eb"
                      fontSize="normal"
                    />
                  </div>

                  {/* Gradient Overlay & Hover Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewingTemplate(template)}
                        className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                        aria-label={`Preview ${template.label} template`}
                      >
                        <Eye size={13} />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectTemplate(template.id)}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                        aria-label={`Select ${template.label} template`}
                      >
                        <Sparkles size={13} />
                        <span>Select Template</span>
                      </button>
                    </div>
                  </div>

                  {/* Top Badges over Thumbnail */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                      {template.category}
                    </span>

                    {template.atsScore && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white shadow-sm backdrop-blur-sm flex items-center gap-1">
                        <ShieldCheck size={11} />
                        <span>ATS {template.atsScore}%</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${template.color}`}></span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                        {template.label}
                      </h3>
                      {isCurrentlyActive && (
                        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>

                    {template.recommendedFor && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate pt-1">
                        Best for: <span className="text-slate-600 dark:text-slate-300">{template.recommendedFor}</span>
                      </p>
                    )}
                  </div>

                  {/* Card Bottom CTA Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPreviewingTemplate(template)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={`Preview ${template.label}`}
                    >
                      <Eye size={13} />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectTemplate(template.id)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-400"
                      aria-label={`Select ${template.label}`}
                    >
                      <span>Select Template</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              Page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-xl text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    )}

      {/* Large Interactive Preview Modal */}
      {previewingTemplate && (
        <TemplatePreviewModal
          isOpen={!!previewingTemplate}
          onClose={() => setPreviewingTemplate(null)}
          template={previewingTemplate}
          onUseTemplate={(themeId, font, accent) => {
            onSelectTemplate(themeId, font, accent);
            setPreviewingTemplate(null);
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};
