import { query } from "../../db";

export const getVote = async (user_id: number, comment_id: number) => {
  const {
    rows,
  } = await query(
    "SELECT * FROM comment_votes WHERE user_id=$1 AND comment_id=$2",
    [user_id.toString(), comment_id.toString()]
  );

  return rows[0];
};

export const voteComment = async (
  user_id: number,
  comment_id: number,
  status: number
) => {
  await query("DELETE FROM comment_votes WHERE user_id=$1 AND comment_id=$2", [
    user_id.toString(),
    comment_id.toString(),
  ]);

  const { rows } = await query("INSERT INTO comment_votes(user_id, comment_id, status) VALUES($1, $2, $3) RETURNING *", [user_id.toString(), comment_id.toString(), status.toString()]);

  return rows[0]
};
