import { query } from "../../db";

export const getVote = async (user_id: number, post_id: number) => {
  const {
    rows,
  } = await query(
    "SELECT * FROM post_votes WHERE user_id=$1 AND post_id=$2",
    [user_id.toString(), post_id.toString()]
  );

  return rows[0];
};

export const votePost = async (
  user_id: number,
  post_id: number,
  status: number
) => {
  await query("DELETE FROM post_votes WHERE user_id=$1 AND post_id=$2", [
    user_id.toString(),
    post_id.toString(),
  ]);

  const { rows } = await query("INSERT INTO post_votes(user_id, post_id, status) VALUES($1, $2, $3) RETURNING *", [user_id.toString(), post_id.toString(), status.toString()]);

  return rows[0]
};