import React, { useEffect, useRef, useState } from 'react';
import { PageMargin, PageMode } from '../types';

export interface A4PageContainerProps {
  children: React.ReactNode;
  pageMode?: PageMode;
  pageMargin?: PageMargin;
  font?: string;
  accentColor?: string;
  candidateName?: string;
  documentTitle?: string;
  className?: string;
  onPageCountChange?: (count: number) => void;
}

// Exact A4 dimensions in CSS pixels at 96 DPI
export const A4_WIDTH_PX = 794;   // 210mm
export const A4_HEIGHT_PX = 1123; // 297mm

export const MARGIN_CONFIGS: Record<PageMargin, { top: number; bottom: number; left: number; right: number; label: string; css: string }> = {
  compact: { top: 38, bottom: 38, left: 42, right: 42, label: '10mm (Compact)', css: '10mm 11mm' },
  normal: { top: 56, bottom: 56, left: 56, right: 56, label: '15mm (Standard)', css: '15mm 15mm' },
  spacious: { top: 76, bottom: 76, left: 70, right: 70, label: '20mm (Spacious)', css: '20mm 18.5mm' },
};

/**
 * Individual A4 Page Sheet component
 * Strictly enforces 210mm x 297mm dimensions, configurable margins,
 * and page footer indicator.
 */
export const A4PageSheet: React.FC<{
  pageNumber: number;
  totalPages: number;
  margin: PageMargin;
  candidateName?: string;
  documentTitle?: string;
  accentColor?: string;
  font?: string;
  children: React.ReactNode;
  className?: string;
  scale?: number;
}> = ({
  pageNumber,
  totalPages,
  margin,
  candidateName,
  documentTitle = 'Curriculum Vitae',
  accentColor = '#2563eb',
  font,
  children,
  className = '',
  scale = 1
}) => {
  const marginConfig = MARGIN_CONFIGS[margin] || MARGIN_CONFIGS.normal;

  return (
    <div 
      className={`a4-page-sheet relative bg-white text-slate-900 shadow-md print:shadow-none print:m-0 mx-auto transition-all ${className}`}
      data-page-number={pageNumber}
      data-total-pages={totalPages}
      style={{
        width: `${A4_WIDTH_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        boxSizing: 'border-box',
        fontFamily: font?.includes("'") ? font : `'${font || 'Inter'}', sans-serif`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      {/* Printable Body with Configured Margins */}
      <div 
        className="a4-page-content flex-1 w-full"
        style={{
          paddingTop: `${marginConfig.top}px`,
          paddingBottom: `${Math.max(20, marginConfig.bottom - 16)}px`,
          paddingLeft: `${marginConfig.left}px`,
          paddingRight: `${marginConfig.right}px`,
          boxSizing: 'border-box',
          overflow: 'hidden',
          ...(scale !== 1 ? {
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: `${100 / scale}%`
          } : {})
        }}
      >
        {children}
      </div>

      {/* Elegant Page Footer Indicator (Screen & Print Safe) */}
      <div 
        className="a4-page-footer w-full flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/80 px-8 py-1.5 bg-white print:bg-transparent shrink-0"
        style={{
          paddingLeft: `${marginConfig.left}px`,
          paddingRight: `${marginConfig.right}px`,
          boxSizing: 'border-box'
        }}
      >
        <div className="flex items-center gap-1.5 font-medium truncate max-w-[60%]">
          {candidateName && <span className="font-semibold text-slate-600 truncate">{candidateName}</span>}
          {candidateName && <span className="text-slate-300">•</span>}
          <span className="truncate">{documentTitle}</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-slate-500 tabular-nums">
          <span>Page {pageNumber} of {totalPages}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * A4PageContainer wraps one or more A4PageSheet elements.
 * Supports auto, 1-page, 2-page, and 3-page layouts.
 */
export const A4PageContainer: React.FC<A4PageContainerProps> = ({
  children,
  pageMode = 'auto',
  pageMargin = 'normal',
  font = 'Inter',
  accentColor = '#2563eb',
  candidateName,
  documentTitle,
  className = '',
  onPageCountChange
}) => {
  return (
    <div 
      id="resume-content"
      className={`a4-document-root flex flex-col items-center gap-6 print:gap-0 w-full ${className}`}
      data-page-mode={pageMode}
      data-page-margin={pageMargin}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: `${A4_WIDTH_PX}px`
      }}
    >
      {children}
    </div>
  );
};

export default A4PageContainer;
