import { SAMPLE_RESPONSES } from '@/data/chatContext';

export function getOfflineResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes('skill') ||
    lowerMessage.includes('tech') ||
    lowerMessage.includes('proficien')
  ) {
    return SAMPLE_RESPONSES.skills;
  }

  if (
    lowerMessage.includes('project') ||
    lowerMessage.includes('built') ||
    lowerMessage.includes('portfolio')
  ) {
    return SAMPLE_RESPONSES.projects;
  }

  if (
    lowerMessage.includes('experience') ||
    lowerMessage.includes('work') ||
    lowerMessage.includes('job') ||
    lowerMessage.includes('career')
  ) {
    return SAMPLE_RESPONSES.experience;
  }

  if (
    lowerMessage.includes('hire') ||
    lowerMessage.includes('why') ||
    lowerMessage.includes('candidate') ||
    lowerMessage.includes('good fit')
  ) {
    return SAMPLE_RESPONSES.hire;
  }

  if (
    lowerMessage.includes('contact') ||
    lowerMessage.includes('reach') ||
    lowerMessage.includes('email')
  ) {
    return `You can reach Joseph through:

- **GitHub**: github.com/YosefHayim
- **WhatsApp**: Available on the website
- **LinkedIn**: Link available in the sidebar

Feel free to download his resume for more details!`;
  }

  if (
    lowerMessage.includes('education') ||
    lowerMessage.includes('degree') ||
    lowerMessage.includes('bootcamp')
  ) {
    return `**Education**

- **Open University of Israel** - B.Sc Computer Science (Oct 2025 - Present)
- **IITC College** - Full Stack Development (Jul 2024 - Mar 2025)
 - 795-hour intensive program
 - Graduated with Excellence
 - Covered JavaScript, React, Node.js, Python, and more`;
  }

  if (lowerMessage.includes('military') || lowerMessage.includes('idf')) {
    return `**Military Service**

Joseph served as an Infantry Commander in the IDF (Nov 2018 - Jul 2021):

- **Unit**: Gdud 931
- **Role**: Infantry Commander
- **Achievements**: 2x Excellence Awards

This experience shaped his discipline, leadership skills, and ability to perform under pressure - qualities he brings to software development.`;
  }

  return `I can help you learn about Joseph! Here are some things I can tell you about:

- **Technical skills** and proficiencies
- **Projects** he's built
- **Work experience** and career journey
- **Education** and certifications
- **Military background**
- **Why he'd be a great hire**

What would you like to know?`;
}
