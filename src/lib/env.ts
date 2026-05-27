import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  AUTH_SECRET: z.string().min(16).optional(),
  AUTH_URL: z.string().url().optional(),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  CRON_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }
  return parsed.data;
}

export const env = parseEnv();

/** Call at server startup in production to fail fast on missing secrets. */
export function assertProductionEnv() {
  if (env.NODE_ENV !== "production") return;

  const required = ["AUTH_SECRET", "DATABASE_URL", "CRON_SECRET"] as const;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required production env vars: ${missing.join(", ")}`);
  }
}
