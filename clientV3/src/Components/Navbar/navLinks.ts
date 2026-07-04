export type SectionLink = {
  id: string;
  label: string;
};

// Anchor targets that exist as section ids in OnePagePortfolio.
export const SECTION_LINKS: SectionLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'writing', label: 'Writing' },
];
