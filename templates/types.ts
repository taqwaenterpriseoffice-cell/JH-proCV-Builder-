import React from 'react';
import { ResumeData, Language, PrintOptions, FontSize, ThemeOption } from '../types';

export interface TemplateConfig {
  specType?: 'medical' | 'academic' | 'europass' | 'ngo' | string;
  mode?: 'light' | 'matrix-dark' | 'clean-slate' | string;
  sidebarPosition?: 'left' | 'right';
  density?: 'compact' | 'ultra' | 'normal' | string;
  bdVariant?: 'standard' | 'executive' | 'govt' | 'triple-photo' | 'modern-it' | 'bilingual' | string;
  photoLayout?: 'none' | 'single-right' | 'single-left' | 'dual' | 'triple' | string;
  academicStyle?: 'table' | 'cards' | 'linear' | string;
  [key: string]: any;
}

export interface TemplateRenderProps {
  data: ResumeData;
  font?: string;
  language?: Language;
  printOptions?: PrintOptions;
  accentColor?: string;
  fontSize?: FontSize;
  templateConfig?: TemplateConfig;
}

export type LayoutFamily = 
  | 'ats-linear'
  | 'dual-sidebar-left'
  | 'dual-sidebar-right'
  | 'executive-banner'
  | 'tech-developer'
  | 'creative-editorial'
  | 'compact-dense'
  | 'academic-specialized'
  | 'bangladesh-cv';

export interface ExtendedThemeOption extends ThemeOption {
  family: LayoutFamily;
  config?: Record<string, any>;
}
