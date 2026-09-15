import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is not configured');

export const sql = neon(databaseUrl);

export async function queryNeon<T = Record<string, unknown>>(queryText: string, params: unknown[] = []) {
  return sql.query(queryText, params) as Promise<T[]>;
}
