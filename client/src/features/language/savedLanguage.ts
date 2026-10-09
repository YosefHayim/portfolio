import { Effect, Schema } from 'effect';

const LanguageSchema = Schema.Literal('en', 'he');
const decodeLanguage = Schema.decodeUnknownOption(LanguageSchema);
const languageStorageKey = 'jts-language';

export type Language = typeof LanguageSchema.Type;

export const browserLanguage = (locale: string): Language => {
  const normalized = locale.toLowerCase();
  return normalized === 'he' || normalized.startsWith('he-') ? 'he' : 'en';
};

export const loadLanguage = (): Language => {
  const readPreference = Effect.try(() => localStorage.getItem(languageStorageKey));
  const readOrWarn = Effect.catchAll(readPreference, (error) =>
    Effect.as(Effect.logWarning('language_storage_unavailable', error), null),
  );
  const saved = Effect.runSync(readOrWarn);
  const decoded = decodeLanguage(saved);
  if (decoded._tag === 'Some') return decoded.value;
  return browserLanguage(navigator.language);
};

export const saveLanguage = (language: Language) => {
  const writePreference = Effect.try(() => localStorage.setItem(languageStorageKey, language));
  const writeOrWarn = Effect.catchAll(writePreference, (error) =>
    Effect.logWarning('language_storage_unavailable', error),
  );
  Effect.runSync(writeOrWarn);
};
