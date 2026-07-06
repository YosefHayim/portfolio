import {
  CONTACT_EMAIL_MARKER_REGEX,
  type ContactEmailInput,
  type ContactEmailStatus,
  parseContactEmailMarker,
  stripContactEmailMarker,
} from '@shared/portfolio/contactEmail.js';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  emailStatus?: ContactEmailStatus;
};

export type EmailData = ContactEmailInput;

export const EMAIL_MARKER_REGEX = CONTACT_EMAIL_MARKER_REGEX;
export const parseEmailMarker = parseContactEmailMarker;
export const stripEmailMarker = stripContactEmailMarker;
