import { db } from '../config/db.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';

export const findUserByEmail = async (email) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
};
