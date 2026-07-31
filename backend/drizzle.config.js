import 'dotenv/config';

/** @type {import('drizzle-kit').Config} */
export default {
  schema: './src/models/schema.js',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'klinik_pratama',
    port: Number(process.env.DB_PORT) || 3306,
  },
};
