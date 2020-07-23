import { Router } from "express";
import { loggedInMiddleware } from "../middleware/auth";
import {
  postSchema,
  deletePostSchema,
  votePostSchema,
} from "../validation/post";
import {
  createPost,
  getPost,
  deletePost,
  upVotePost,
  downVotePost,
  getPostWithUser,
} from "../controlers/postsController";
import { votePost, getVote } from "../controlers/postVotesController";

const router = Router();

router.post("/newpost", loggedInMiddleware, async (req, res, next) => {
  try {
    await postSchema.validateAsync(req.body);
  } catch (err) {
    return next(new Error(err));
  }

  const { title, body } = req.body;

  try {
    const createdPost = await createPost(req.session!.userId, title, body);
    res.status(200).json({ post: createdPost });
  } catch (err) {
    return next(new Error(err));
  }
});

router.post("/deletepost", loggedInMiddleware, async (req, res, next) => {
  try {
    await deletePostSchema.validateAsync(req.body);
  } catch (err) {
    return next(new Error(err));
  }

  const post = await getPost(req.body.id);

  if (!post || post.by !== req.session!.userId) {
    return next(new Error("Invalid Delete Request"));
  }

  await deletePost(req.body.id);

  res.status(200).json({ message: "ok" });
});

router.get("/post/:post_id", async (req, res, next) => {
  console.log(req.params.post_id);
  try {
    const post_id = parseInt(req.params.post_id, 10);

    let post = {};

    if (!!req.session!.userId)
      post = await getPostWithUser(post_id, req.session!.userId);
    else post = await getPost(post_id);

    res.status(200).json({ post });
  } catch (err) {
    next(new Error(err));
  }
});

router.post("/post/upvote", loggedInMiddleware, async (req, res, next) => {
  try {
    await votePostSchema.validateAsync(req.body);
  } catch (err) {
    return next(new Error(err));
  }

  //Check if valid comment

  const post = await getPost(req.body.post_id);

  if (!post) {
    return next(new Error("no post with this id"));
  }

  const vote = await getVote(req.session!.userId, req.body.post_id);
  console.log(vote);
  // status with vote, -1 : set status to 1, add two to score
  // 0, set status to 1, add one to score
  // 1 set status to 0, subtract one from score

  // no status set status to 1 and add one to score

  let score = 0;
  let status = 0;
  try {
    if (!vote || vote.status == 0) {
      await votePost(req.session!.userId, req.body.post_id, 1);
      score = await upVotePost(req.body.post_id);
      status = 1;
    } else if (vote.status == -1) {
      await votePost(req.session!.userId, req.body.post_id, 1);
      await upVotePost(req.body.post_id);
      score = await upVotePost(req.body.post_id);
      status = 1;
    } else {
      await votePost(req.session!.userId, req.body.post_id, 0);
      score = await downVotePost(req.body.post_id);
      status = 0;
    }
  } catch (err) {
    console.log(err);
    return next(new Error(err));
  }

  res.status(200).json({ score, status });
});

router.post("/post/downvote", loggedInMiddleware, async (req, res, next) => {
  try {
    await votePostSchema.validateAsync(req.body);
  } catch (err) {
    return next(new Error(err));
  }

  //Check if valid comment

  const post = await getPost(req.body.post_id);

  if (!post) {
    console.log(req.body.post_id);
    return next(new Error("no post with this id"));
  }

  const vote = await getVote(req.session!.userId, req.body.post_id);
  console.log(vote);
  // -1, set stat to 0 and add one
  // 0, set stat to -1 and sub one
  // 1, set stat to -1 and sub two

  // no, set -1 and sub 1

  let score = 0;
  let status = 0;
  if (!vote || vote.status == 0) {
    await votePost(req.session!.userId, req.body.post_id, -1);
    score = await downVotePost(req.body.post_id);
    status = -1;
  } else if (vote.status == -1) {
    await votePost(req.session!.userId, req.body.post_id, 0);
    score = await upVotePost(req.body.post_id);
    status = 0;
  } else {
    await votePost(req.session!.userId, req.body.post_id, -1);
    await downVotePost(req.body.post_id);
    score = await downVotePost(req.body.post_id);
    status = -1;
  }

  res.status(200).json({ score, status });
});

export { router as post };
