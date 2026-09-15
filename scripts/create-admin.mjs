import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'School Administrator' } = process.env;
if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD.');
if (ADMIN_PASSWORD.length < 10) throw new Error('ADMIN_PASSWORD must be at least 10 characters.');

const sql = neon(DATABASE_URL);
const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await sql`INSERT INTO users (email, password_hash, role, full_name) VALUES (${ADMIN_EMAIL.toLowerCase()}, ${hash}, 'admin', ${ADMIN_NAME}) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin', full_name = EXCLUDED.full_name`;
console.log(`Admin account ready: ${ADMIN_EMAIL}`);
