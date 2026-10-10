import type { Language } from '../../language/savedLanguage';

type WorkExamplesText = {
  website: {
    address: string;
    received: string;
    monthlyReport: string;
  };
  app: {
    onDeviceAi: string;
  };
  automation: {
    spreadsheet: string;
    invoice: string;
    sent: string;
  };
  aiTool: {
    question: string;
    answer: string;
  };
  extension: {
    address: string;
    promptQueue: string;
    runningAlone: string;
  };
};

export const workExamplesText: Record<Language, WorkExamplesText> = {
  en: {
    website: {
      address: 'donations.example.org',
      received: 'Received',
      monthlyReport: 'Monthly report',
    },
    app: { onDeviceAi: 'On-device AI' },
    automation: { spreadsheet: 'Sheet', invoice: 'Invoice', sent: 'Sent' },
    aiTool: {
      question: 'How many eBay orders came in today?',
      answer: 'Three. Two shipped, one is waiting for a label.',
    },
    extension: {
      address: 'chatgpt.com',
      promptQueue: 'Queue: 12 prompts',
      runningAlone: 'Running on its own',
    },
  },
  he: {
    website: {
      address: 'donations.example.org',
      received: 'נקלט',
      monthlyReport: 'דוח חודשי',
    },
    app: { onDeviceAi: 'AI על המכשיר' },
    automation: { spreadsheet: 'אקסל', invoice: 'חשבונית', sent: 'נשלחה' },
    aiTool: {
      question: 'כמה הזמנות נכנסו היום ב-eBay?',
      answer: 'שלוש. שתיים כבר נשלחו, אחת מחכה לתווית.',
    },
    extension: {
      address: 'chatgpt.com',
      promptQueue: 'תור: 12 פרומפטים',
      runningAlone: 'רץ לבד',
    },
  },
};
