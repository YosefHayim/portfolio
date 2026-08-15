/**
 * Operational HTTP failure messages. Core throws plain `Error` with these messages;
 * Express maps them to status codes only at the HTTP boundary (`errorHandler`).
 */
export const HTTP_ERROR_MESSAGE = {
  invalidRequestBody: 'Invalid request body',
  invalidAudioContentType: 'Invalid content type. Expected audio file.',
  noAudioData: 'No audio data received',
  emailNotConfigured: 'Email service is not configured',
  aiNotConfigured: 'AI provider is not configured',
  noAiResponse: 'No response from AI',
} as const;

export type HttpErrorMessage = (typeof HTTP_ERROR_MESSAGE)[keyof typeof HTTP_ERROR_MESSAGE];

/**
 * Throws a plain Error for an operational HTTP failure.
 * Status codes are applied only by the HTTP boundary, not on the Error instance.
 *
 * @param message - Known operational failure message.
 * @param options - Optional ErrorOptions (e.g. `cause` from a decode failure).
 * @returns Never — always throws.
 * @example
 * throwHttpError(HTTP_ERROR_MESSAGE.invalidRequestBody, { cause: decodeError });
 */
export const throwHttpError = (message: HttpErrorMessage, options?: ErrorOptions): never => {
  throw new Error(message, options);
};
