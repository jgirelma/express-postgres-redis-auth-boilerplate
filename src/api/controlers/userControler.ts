import { query } from "../../db";
import { hash } from "bcryptjs";

export const createUser = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string
) => {
  const hashedPassword = await hash(password, 12);
  const {
    rows,
  } = await query(
    "INSERT INTO users(firstname, lastname, email, password) VALUES($1,$2,$3,$4) RETURNING id, firstname, lastname, email",
    [firstname, lastname, email, hashedPassword]
  );

  const user = rows[0];

  return user;
};

export const getUserById = async (id: string) => {
  const {
    rows,
  } = await query(
    "SELECT id,firstname,lastname,email FROM users WHERE id=$1 LIMIT 1",
    [id]
  );

  return rows[0];
};

export const getUserByEmail = async (email: string) => {
  const {
    rows,
  } = await query(
    "SELECT id,firstname,lastname,email FROM users WHERE email=$1 LIMIT 1",
    [email]
  );

  return rows[0];
};

export const getUserHashedPasswordById = async (id:any) => {
  const {
    rows,
  } = await query(
    "SELECT password FROM users WHERE id=$1 LIMIT 1",
    [id]
  );

  return rows[0];
}
