import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().trim().min(2).max(255),
  password: z.string().min(6).max(128),
});

export const resultLookupSchema = z.object({
  session: z.string().trim().min(4).max(50),
  term: z.string().trim().min(3).max(50),
});
