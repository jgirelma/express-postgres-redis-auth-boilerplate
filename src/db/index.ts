import { Pool } from "pg";

const db_config = {
  user: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.NODE_ENV === 'production' ? 'postgres' : 'localhost',
  database: process.env.POSTGRES_DB,
  port: process.env.NODE_ENV === 'production' ? 5432 : 5431,
}

const pool = new Pool(db_config);

export const query = (text: string, params: string[]) =>{
  return pool.query(text, params)
}

export const createTable = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users
  (id SERIAL PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  firstname VARCHAR(100), 
  lastname VARCHAR(100), 
  password VARCHAR(100) NOT NULL)`);
}

export const dropTable = async () => {
  await pool.query(`DROP TABLE IF EXISTS users`)
}
