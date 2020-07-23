import { Pool } from "pg";

const db_config = {
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.NODE_ENV === "production" ? "postgres" : "localhost",
  database: process.env.POSTGRES_DB,
  port: process.env.NODE_ENV === "production" ? 5432 : 5431,
};

const pool = new Pool(db_config);

export const query = (text: string, params: string[]) => {
  return pool.query(text, params);
};

export const createUsersTable = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users
  (id SERIAL PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  firstname VARCHAR(100), 
  lastname VARCHAR(100), 
  password VARCHAR(100) NOT NULL)`);
};

export const dropTable = async () => {
  await pool.query(`DROP TABLE IF EXISTS users`);
};

export const createPostsTable = async () => {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    by integer NOT NULL REFERENCES users(id),
    title text NOT NULL,
    body text NOT NULL,
    timestamp integer NOT NULL)`);
};

export const dropPostsTable = async () => {
  await pool.query(`DROP TABLE IF EXISTS posts`);
};

export const createCommentsTable = async () => {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    by integer NOT NULL REFERENCES users(id),
    post_id integer NOT NULL REFERENCES posts(id),
    body text NOT NULL,
    timestamp integer NOT NULL,
    parent_id integer REFERENCES comments(id) )`);
};

export const dropCommentsTable = async () => {
  await pool.query(`
  DROP TABLE IF NOT EXISTS comments
  `);
};

export const createCommentVotesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comment_votes (
      user_id integer NOT NULL REFERENCES users(id),
      comment_id integer NOT NULL REFERENCES comments(id),
      vote integer NOT NULL,
      PRIMARY KEY (user_id, comment_id)
    )
  `)
}

export const createPostVotesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS post_votes (
      user_id integer NOT NULL REFERENCES users(id),
      post_id integer NOT NULL REFERENCES posts(id),
      vote integer NOT NULL,
      PRIMARY KEY (user_id, post_id)
    )
  `)
}
