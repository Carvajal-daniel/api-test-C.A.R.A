import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// O jeito correto nas novas versões do Drizzle ORM:
export const db = drizzle({ client: pool });
