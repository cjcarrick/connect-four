import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Autocomplete for environment variables

const path = resolve(process.cwd(), '.env')
dotenv.config({ path })

type EnvVars = {
  VITE_SOCKETT: string
}

type AnyOtherKey<T extends { [k: string]: any }> = T &
  Omit<{ [k: string]: any }, keyof T>

export const env = process.env as unknown as Readonly<AnyOtherKey<EnvVars>>
