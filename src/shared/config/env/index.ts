import { envSchema } from "./schema"

// Environment config barrel export
export * from "./schema"

export const env = envSchema.parse(import.meta.env)
