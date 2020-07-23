import { query } from "../../db";

export const createComment = async (
  by: number,
  post_id: number,
  body: string,
  parent_id?: number
) => {
  const date = Math.floor(Date.now() / 1000);
  if (!!parent_id) {
    const { rows } = await query(
      `
    INSERT INTO comments
    (by, post_id, body, timestamp, parent_id) 
    VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [
        by.toString(),
        post_id.toString(),
        body,
        date.toString(),
        parent_id.toString(),
      ]
    );
    return rows[0];
  } else {
    const { rows } = await query(
      `
    INSERT INTO comments
    (by, post_id, body, timestamp) 
    VALUES($1, $2, $3, $4) RETURNING *`,
      [by.toString(), post_id.toString(), body, date.toString()]
    );
    return rows[0];
  }
};

export const getComment = async (id: number) => {
  const { rows } = await query("SELECT * FROM comments WHERE id=$1", [
    id.toString(),
  ]);
  return rows[0];
};

export const deleteComment = async (id: number) => {
  await query(
    `
  UPDATE comments
  SET
    by = 11,
    body = '[Deleted]',
  WHERE id = $1
  `,
    [id.toString()]
  );
};

export const getCommentsByPostId = async (post_id: number) => {
  const { rows } = await query(
    `
  SELECT
    comments.id,
    comments.by,
    comments.post_id,
    comments.body,
    comments.timestamp,
    comments.parent_id,
    comments.score,
    users.firstname,
    users.lastname
  FROM comments 
  INNER JOIN users on users.id = comments.by
  WHERE comments.post_id=$1
  ORDER BY comments.timestamp DESC`,
    [post_id.toString()]
  );
  return rows;
};

export const getCommentsByPostIdWithUser = async (post_id: number, user_id: number) => {
  const { rows } = await query(
    `
  SELECT

    comments.id,
    comments.by,
    comments.post_id,
    comments.body,
    comments.timestamp,
    comments.parent_id,
    comments.score,
    users.firstname,
    users.lastname,
    comment_votes.status
  FROM comments 
  INNER JOIN users on users.id = comments.by
  LEFT JOIN comment_votes on comment_votes.user_id = $2 AND comment_votes.comment_id = comments.id
  WHERE comments.post_id=$1
  ORDER BY comments.timestamp DESC`,
    [post_id.toString(), user_id.toString()]
  );
  return rows;
};

export const upVoteComment = async (id: number) => {
  const { rows } = await query(
    `
  UPDATE comments
  SET score = score + 1
  WHERE id=$1 
  RETURNING score
  `,
    [id.toString()]
  );
  return rows[0].score;
};

export const downVoteComment = async (id: number) => {
  const { rows } = await query(
    `
  UPDATE comments
  SET score = score - 1
  WHERE id=$1 
  RETURNING score
  `,
    [id.toString()]
  );
  return rows[0].score;
};

export const getTopCommentsByPostId = async (post_id: number, timerange : number) => {
  const { rows } = await query(
    `
  SELECT
    comments.id,
    comments.by,
    comments.post_id,
    comments.body,
    comments.timestamp,
    comments.parent_id,
    comments.score,
    users.firstname,
    users.lastname
  FROM comments 
  INNER JOIN users on users.id = comments.by
  WHERE comments.post_id=$1 AND comments.timestamp > $2
  ORDER BY comments.score DESC`,
    [post_id.toString(), timerange.toString()]
  );
  return rows;
};

export const getTopCommentsByPostIdWithUser = async (post_id: number, user_id: number, timerange: number) => {
  const { rows } = await query(
    `
  SELECT

    comments.id,
    comments.by,
    comments.post_id,
    comments.body,
    comments.timestamp,
    comments.parent_id,
    comments.score,
    users.firstname,
    users.lastname,
    comment_votes.status
  FROM comments 
  INNER JOIN users on users.id = comments.by
  LEFT JOIN comment_votes on comment_votes.user_id = $2 AND comment_votes.comment_id = comments.id
  WHERE comments.post_id=$1 AND comments.timestamp > $3
  ORDER BY comments.score DESC`,
    [post_id.toString(), user_id.toString(), timerange.toString()]
  );
  return rows;
};