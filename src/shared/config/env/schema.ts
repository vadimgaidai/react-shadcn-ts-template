import { z } from "zod"

/**
 * All env vars must be defined here for type safety
 */
const envSchema = z.object({
  MODE: z.enum(["development", "production"]).default("development"),
  VITE_API_URL: z.string().url().default("http://localhost:3000"),
  VITE_APP_NAME: z.string().default("React App"),
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
})

export type Env = z.infer<typeof envSchema>

export { envSchema }
