type CacheEntry = {
  response: string;
  timestamp: number;
};

const CACHE_TTL = 1000 * 60 * 60;
const MAX_CACHE_SIZE = 100;
// Raw row example: "Hello, world!" becomes "Hello world" before whitespace normalization.
const NON_WORD_OR_SPACE_PATTERN = /[^\w\s]/g;
// Raw row example: "hello   world" becomes "hello world".
const REPEATED_SPACE_PATTERN = /\s+/g;
// Raw row example: "tell me about your portfolio" should match /portfolio/.
const CACHEABLE_MESSAGE_PATTERNS = [
  /skill/,
  /tech/,
  /proficien/,
  /stack/,
  /language/,
  /project/,
  /built/,
  /portfolio/,
  /work.*on/,
  /experience/,
  /background/,
  /career/,
  /job/,
  /who.*is/,
  /tell.*about/,
  /introduce/,
  /education/,
  /degree/,
  /study/,
  /bootcamp/,
  /contact/,
  /reach/,
  /hire/,
];

export class ResponseCache {
  private readonly cache = new Map<string, CacheEntry>();

  get size(): number {
    return this.cache.size;
  }

  get(message: string): string | null {
    if (!this.isCacheable(message)) {
      return null;
    }

    const key = this.generateKey(message);
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  set(message: string, response: string): void {
    if (!this.isCacheable(message)) {
      return;
    }

    if (this.cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(this.generateKey(message), {
      response,
      timestamp: Date.now(),
    });
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: MAX_CACHE_SIZE,
    };
  }

  private generateKey(message: string): string {
    return message
      .toLowerCase()
      .trim()
      .replace(NON_WORD_OR_SPACE_PATTERN, '')
      .replace(REPEATED_SPACE_PATTERN, ' ');
  }

  private isCacheable(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return CACHEABLE_MESSAGE_PATTERNS.some((pattern) => pattern.test(lowerMessage));
  }
}

export const responseCache = new ResponseCache();
