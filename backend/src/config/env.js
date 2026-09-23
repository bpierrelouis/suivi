import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_ORIGIN: z.string().url(),
  JWT_SECRET: z.string().min(32),
  SESSION_TTL: z.string().default("8h"),
  ADMIN_PASSWORD: z.string().min(8),
  MANAGER_PASSWORD: z.string().min(8),
  SIMULATED_PASSWORD: z.string().min(8),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Configuration invalide", parsed.error.flatten().fieldErrors);
  throw new Error("La configuration du serveur est invalide.");
}

export const env = parsed.data;
