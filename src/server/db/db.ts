import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw Error("no valid database url found")

export const db = drizzle(DATABASE_URL)