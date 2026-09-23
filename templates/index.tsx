import React from 'react';
import { ExtendedThemeOption, TemplateRenderProps } from './types';
import { TEMPLATE_REGISTRY } from './registry';
import { SingleColumnATSLayout } from './layouts/SingleColumnATSLayout';
import { SidebarLayout } from './layouts/SidebarLayout';
import { ExecutiveBannerLayout } from './layouts/ExecutiveBannerLayout';
import { TechTerminalLayout } from './layouts/TechTerminalLayout';
import { CreativeEditorialLayout } from './layouts/CreativeEditorialLayout';
import { CompactDensityLayout } from './layouts/CompactDensityLayout';
import { SpecializedLayout } from './layouts/SpecializedLayout';
import { BangladeshCVLayout } from './layouts/BangladeshCVLayout';
import { BDGovtBioDataLayout } from './layouts/BDGovtBioDataLayout';

export * from './types';
export * from './registry';
export * from './primitives';
export * from './layouts/BangladeshCVLayout';
export * from './layouts/BDGovtBioDataLayout';

export const getTemplateById = (themeId: string): ExtendedThemeOption => {
  const found = TEMPLATE_REGISTRY.find(t => t.id === themeId);
  if (found) return found;
  // Fallback to ATS Professional if not found
  return TEMPLATE_REGISTRY[0];
};

export const EngineTemplateRenderer: React.FC<TemplateRenderProps & { theme: string }> = ({
  theme,
  data,
  font = 'Inter',
  language = 'en' as const,
  printOptions,
  accentColor = '#2563eb',
  fontSize = 'normal' as const
}) => {
  const template = getTemplateById(theme);
  const config = template.config || {};

  const commonProps: TemplateRenderProps = {
    data,
    font,
    language,
    printOptions,
    accentColor,
    fontSize,
    templateConfig: config
  };

  // Special case: Bangladesh Government Prescribed 1-Page Bio-Data format
  if (theme === 'bd-govt' || config.bdVariant === 'govt') {
    return <BDGovtBioDataLayout {...commonProps} />;
  }

  switch (template.family) {
    case 'ats-linear':
      return <SingleColumnATSLayout {...commonProps} />;

    case 'dual-sidebar-left':
    case 'dual-sidebar-right':
      return <SidebarLayout {...commonProps} />;

    case 'executive-banner':
      return <ExecutiveBannerLayout {...commonProps} />;

    case 'tech-developer':
      return <TechTerminalLayout {...commonProps} />;

    case 'creative-editorial':
      return <CreativeEditorialLayout {...commonProps} />;

    case 'compact-dense':
      return <CompactDensityLayout {...commonProps} />;

    case 'academic-specialized':
      return <SpecializedLayout {...commonProps} />;

    case 'bangladesh-cv':
      return <BangladeshCVLayout {...commonProps} />;

    default:
      return <SingleColumnATSLayout {...commonProps} />;
  }
};
