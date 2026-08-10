import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

// Fail fast at boot if config is missing/malformed, instead of failing
// mysteriously later at the first DB query or token sign attempt.
const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DB_SERVER: z.string().min(1),
  DB_SERVER_INSTANCE: z.string().min(1),
  DB_PORT: z.coerce.number().default(1433),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_ENCRYPT: z.coerce.boolean().default(true),
  DB_TRUST_SERVER_CERT: z.coerce.boolean().default(true),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  SESSION_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  CORS_ORIGIN: z.string().default('*'),

  UPLOAD_DIR: z.string().default('uploads'),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(5),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;
export default env;