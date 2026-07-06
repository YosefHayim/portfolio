import process from 'node:process';
import { config } from 'dotenv';
import { Schema } from 'effect';

config();

const EnvSchema = Schema.Struct({
  OPENAI_API_KEY: Schema.String.pipe(Schema.minLength(1)),
  PORT: Schema.optionalWith(Schema.String, { default: () => '3000' }),
  NODE_ENV: Schema.optionalWith(Schema.Literal('development', 'production', 'test'), {
    default: () => 'development',
  }),
  FRONTEND_URL: Schema.optionalWith(Schema.String, {
    default: () => 'http://localhost:5173',
  }),
  EMAIL_USER: Schema.optional(Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))),
  EMAIL_PASS: Schema.optional(Schema.String),
});

export const env = Schema.decodeUnknownSync(EnvSchema)(process.env);
