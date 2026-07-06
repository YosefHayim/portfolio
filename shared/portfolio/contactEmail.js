export const CONTACT_RECIPIENT_DEFAULT = 'yosefisabag@gmail.com';
// Raw row example: "[SEND_EMAIL:{\"senderName\":\"Name\"}]" captures the JSON payload.
export const CONTACT_EMAIL_MARKER_REGEX = /\[SEND_EMAIL:(\{[\s\S]*?\})\]/;
export const CONTACT_EMAIL_MARKER_EXAMPLE =
  '[SEND_EMAIL:{"senderName":"Name","senderEmail":"email@example.com","subject":"Brief Subject","message":"Message content"}]';
// Raw row example: "Tom & Jerry" becomes "Tom &amp; Jerry".
const AMPERSAND_PATTERN = /&/g;
// Raw row example: "<tag>" escapes the opening angle bracket.
const LESS_THAN_PATTERN = /</g;
// Raw row example: "<tag>" escapes the closing angle bracket.
const GREATER_THAN_PATTERN = />/g;
// Raw row example: "\"quoted\"" escapes double quotes.
const DOUBLE_QUOTE_PATTERN = /"/g;
// Raw row example: "Joseph's" escapes apostrophes.
const SINGLE_QUOTE_PATTERN = /'/g;

const EMAIL_TEXT_COLOR = 'rgb(51, 51, 51)';
const EMAIL_BRAND_START = 'rgb(5, 223, 114)';
const EMAIL_BRAND_END = 'rgb(0, 180, 216)';
const EMAIL_PANEL_BACKGROUND = 'rgb(249, 249, 249)';
const EMAIL_PANEL_BORDER = 'rgb(224, 224, 224)';

export const parseContactEmailMarker = (content) => {
  const match = content.match(CONTACT_EMAIL_MARKER_REGEX);
  if (!match) {
    return null;
  }

  // Raw row example: match[1] contains the JSON object inside "[SEND_EMAIL:{...}]".
  const markerPayload = match.at(1);
  if (markerPayload === undefined) {
    return null;
  }

  try {
    const data = JSON.parse(markerPayload);
    if (
      typeof data.senderName === 'string' &&
      typeof data.senderEmail === 'string' &&
      typeof data.subject === 'string' &&
      typeof data.message === 'string'
    ) {
      return data;
    }
  } catch {
    return null;
  }

  return null;
};

export const stripContactEmailMarker = (content) =>
  content.replace(CONTACT_EMAIL_MARKER_REGEX, '').trim();

export const markContactEmailStatus = (messages, messageId, emailStatus) =>
  messages.map((message) =>
    message.id === messageId ? { ...message, emailStatus } : message,
  );

export const findPendingContactEmailRequest = (messages, isStreaming) => {
  const lastMessage = messages.at(-1);
  if (
    isStreaming ||
    lastMessage?.role !== 'assistant' ||
    lastMessage.emailStatus
  ) {
    return null;
  }

  const emailData = parseContactEmailMarker(lastMessage.content);
  return emailData ? { messageId: lastMessage.id, emailData } : null;
};

export const createContactEmailPreview = (response, maxLength = 80) => {
  const preview = stripContactEmailMarker(response).slice(0, maxLength);
  return preview + (response.length > maxLength ? '...' : '');
};

export const createPortfolioEmail = (input) => {
  const text = `New message from your portfolio website:

From: ${input.senderName}
Email: ${input.senderEmail}
Subject: ${input.subject}

Message:
${input.message}

---
This email was sent via the AI chat on your portfolio website.
`;

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:${EMAIL_TEXT_COLOR}">
  <div style="max-width:600px;margin:0 auto;padding:20px">
    <div style="background:linear-gradient(135deg,${EMAIL_BRAND_START},${EMAIL_BRAND_END});color:white;padding:20px;border-radius:8px 8px 0 0">
      <h2 style="margin:0">New Portfolio Message</h2>
    </div>
    <div style="background:${EMAIL_PANEL_BACKGROUND};padding:20px;border:1px solid ${EMAIL_PANEL_BORDER};border-top:none">
      <p><strong>From:</strong> ${escapeHtml(input.senderName)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(input.senderEmail)}">${escapeHtml(input.senderEmail)}</a></p>
      <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
      <div style="background:white;padding:15px;border-radius:8px;border:1px solid ${EMAIL_PANEL_BORDER};white-space:pre-wrap">${escapeHtml(input.message)}</div>
    </div>
  </div>
</body>
</html>`;

  return {
    subject: `[Portfolio] ${input.subject}`,
    text,
    html,
  };
};

const escapeHtml = (value) =>
  value
    .replace(AMPERSAND_PATTERN, '&amp;')
    .replace(LESS_THAN_PATTERN, '&lt;')
    .replace(GREATER_THAN_PATTERN, '&gt;')
    .replace(DOUBLE_QUOTE_PATTERN, '&quot;')
    .replace(SINGLE_QUOTE_PATTERN, '&apos;');
