// src/db/client.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js'; // Ajuste o caminho para o seu schema

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });