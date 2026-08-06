import type { ContactEmailInput, ContactEmailStatus } from '@shared/portfolio/contactEmail.js';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  emailStatus?: ContactEmailStatus;
};

export type EmailData = ContactEmailInput;
