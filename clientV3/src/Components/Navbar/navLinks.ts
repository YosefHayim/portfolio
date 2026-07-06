export type SectionLink = {
  id: string;
};

// Anchor targets that exist as section ids in OnePagePortfolio. Labels are
// resolved at render time via i18n key `nav.<id>`.
export const SECTION_LINKS: SectionLink[] = [
  { id: 'home' },
  { id: 'stack' },
  { id: 'experience' },
  { id: 'projects' },
  { id: 'writing' },
];
