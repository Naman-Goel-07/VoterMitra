import 'server-only';
import { z } from 'zod';
import { ROLES } from './labels';

const optionalString = z.string().trim().min(1).optional();
const optionalSetting = <T>(schema: z.ZodType<T>, value?: string) =>
  schema.safeParse(value?.trim() || undefined).data;

export function env() {
  return {
    DATABASE_URL: optionalSetting(optionalString, process.env.DATABASE_URL),
    GNANI_API_KEY: optionalSetting(optionalString, process.env.GNANI_API_KEY),
    GEMINI_API_KEY: optionalSetting(optionalString, process.env.GEMINI_API_KEY),
    TELEGRAM_BOT_TOKEN: optionalSetting(optionalString, process.env.TELEGRAM_BOT_TOKEN),
    TELEGRAM_SECRET_TOKEN: optionalSetting(
      z.string().regex(/^[A-Za-z0-9_-]{32,256}$/),
      process.env.TELEGRAM_SECRET_TOKEN,
    ),
    DASHBOARD_REVIEWER_NAME: optionalSetting(z.string().min(2).max(60), process.env.DASHBOARD_REVIEWER_NAME),
    DASHBOARD_REVIEWER_ROLE: optionalSetting(z.enum(ROLES), process.env.DASHBOARD_REVIEWER_ROLE),
    DASHBOARD_PASSCODE: optionalSetting(z.string().min(16).max(256), process.env.DASHBOARD_PASSCODE),
    SESSION_SECRET: optionalSetting(z.string().min(32), process.env.SESSION_SECRET),
    BENCHMARK_PLANTED_TOTAL: optionalSetting(
      z.coerce.number().int().nonnegative(),
      process.env.BENCHMARK_PLANTED_TOTAL,
    ),
    PUBLIC_BASE_URL: optionalSetting(z.url({ protocol: /^https?$/ }), process.env.PUBLIC_BASE_URL),
  };
}
