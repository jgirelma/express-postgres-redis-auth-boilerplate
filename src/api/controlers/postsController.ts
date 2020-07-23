import { query } from '../../db'

export const createPost = async (by : number, title : string, body : string) => {
  const date = Math.floor(Date.now()/1000);
  const { rows } = await query(`INSERT INTO posts(by, title, body, timestamp) VALUES($1, $2, $3, $4) RETURNING *`, [by.toString(), title, body, date.toString()])
  return rows[0]
}

export const getPost = async (id : number) => {
  const { rows } = await query(`
    SELECT 
      posts.id,
      posts.by,
      posts.title,
      posts.body,
      posts.score,
      posts.timestamp,
      users.firstname,
      users.lastname
    FROM posts
    INNER JOIN users on users.id = posts.by 
    WHERE posts.id=$1`, [id.toString()])
  return rows[0]
}

export const getPostWithUser = async (id : number, user_id: number) => {
  const { rows } = await query(`
    SELECT 
      posts.id,
      posts.by,
      posts.title,
      posts.body,
      posts.score,
      posts.timestamp,
      users.firstname,
      users.lastname,
      post_votes.status
    FROM posts
    INNER JOIN users on users.id = posts.by 
    LEFT JOIN post_votes on post_votes.post_id=posts.id AND post_votes.user_id=$2
    WHERE posts.id=$1`, [id.toString(), user_id.toString()])
  return rows[0]
}

export const deletePost = async (id: number) => {
  await query(`
    UPDATE posts
    SET 
      by = 11, 
      title = '[Deleted]', 
      body = '[Deleted]'
    WHERE id = $1
  `, [id.toString()])
}

export const getPostsByPage = async (page : number) => {
  const offset = (page - 1) * 15;
  const { rows } = await query(`
  SELECT 
    posts.id,
    posts.by,
    posts.title,
    posts.body,
    posts.score,
    posts.timestamp,
    users.firstname,
    users.lastname
  FROM posts 
  INNER JOIN users on users.id = posts.by
  ORDER BY timestamp DESC LIMIT 15 OFFSET $1`, [offset.toString()])
  return rows
}

export const getPostsByPageWithUser = async (page : number, user_id : number) => {
  const offset = (page - 1) * 15;
  const { rows } = await query(`
  SELECT 
    posts.id,
    posts.by,
    posts.title,
    posts.body,
    posts.score,
    posts.timestamp,
    users.firstname,
    users.lastname,
    post_votes.status
  FROM posts 
  INNER JOIN users on users.id = posts.by
  LEFT JOIN post_votes on post_votes.post_id = posts.id AND post_votes.user_id = $2
  ORDER BY timestamp DESC LIMIT 15 OFFSET $1`, [offset.toString(), user_id.toString()])
  return rows
}


export const upVotePost = async (id:number) => {
  const { rows } = await query(`
  UPDATE posts
  SET score = score + 1
  WHERE id=$1 
  RETURNING score
  `, [id.toString()])
  return rows[0].score
}


export const downVotePost = async (id:number) => {
  const { rows } = await query(`
  UPDATE posts
  SET score = score - 1
  WHERE id=$1 
  RETURNING score
  `, [id.toString()])
  return rows[0].score
}

export const getTopPostsByPage = async (page : number, timerange : number) => {
  console.log(timerange)
  const offset = (page - 1) * 15;
  const { rows } = await query(`
  SELECT 
    posts.id,
    posts.by,
    posts.title,
    posts.body,
    posts.score,
    posts.timestamp,
    users.firstname,
    users.lastname
  FROM posts 
  INNER JOIN users on users.id = posts.by
  WHERE posts.timestamp > $2
  ORDER BY posts.score DESC LIMIT 15 OFFSET $1`, [offset.toString(), timerange.toString()])
  return rows
}

export const getTopPostsByPageWithUser = async (page : number, user_id : number, timerange : number) => {
  const offset = (page - 1) * 15;
  const { rows } = await query(`
  SELECT 
    posts.id,
    posts.by,
    posts.title,
    posts.body,
    posts.score,
    posts.timestamp,
    users.firstname,
    users.lastname,
    post_votes.status
  FROM posts 
  INNER JOIN users on users.id = posts.by
  LEFT JOIN post_votes on post_votes.post_id = posts.id AND post_votes.user_id = $2
  WHERE timestamp > $3
  ORDER BY posts.score DESC LIMIT 15 OFFSET $1`, [offset.toString(), user_id.toString(), timerange.toString()])
  return rows
}