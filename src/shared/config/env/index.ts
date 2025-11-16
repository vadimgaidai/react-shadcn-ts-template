import { envSchema } from "./schema"

export * from "./schema"

export const env = envSchema.parse(import.meta.env)
