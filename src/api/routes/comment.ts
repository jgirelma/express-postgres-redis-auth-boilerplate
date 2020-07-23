import { Router } from "express";
import { commentSchema, deleteCommentSchema, voteCommentSchema } from "../validation/comment";
import { getPost } from "../controlers/postsController";
import { createComment, getComment, deleteComment, downVoteComment, upVoteComment } from "../controlers/commentsController";
import { loggedInMiddleware } from "../middleware/auth";
import { getVote, voteComment } from "../controlers/commentVotesController";

const router = Router();

router.post("/newcomment", loggedInMiddleware, async (req, res, next) => {
  try {
    await commentSchema.validateAsync(req.body);
  } catch (err) {
    return next(new Error(err));
  }

  const { body, post_id, parent_id } = req.body;

  const ParentPost = await getPost(post_id)

  if (!ParentPost) {
    return next(new Error("Invalid Post Id"))
  }

  if (parent_id) {
    const parentComment = await getComment(parent_id)

    if(!parentComment) {
      return next(new Error("Invalid parent comment : doesnt exist"))
    }

    if(parentComment.post_id !== parseInt(post_id,10)) {
      return next(new Error("Parent comment post id does not match"))
    }
  }

  const comment = await createComment(req.session!.userId, post_id, body, parent_id)

  res.status(200).json({comment})
});

router.post('/deletecomment', loggedInMiddleware, async (req, res, next) => {
  try {
    await deleteCommentSchema.validateAsync(req.body)
  } catch (err) {
    return next(new Error(err))
  }

  const comment = await getComment(req.body.id)

  if (!comment || comment.by !== req.session!.userId) {
    return next(new Error('Invalid Delete Request'))
  }

  await deleteComment(req.body.post_id)

  res.status(200).json({message:'ok'})
})

router.post('/comment/upvote', loggedInMiddleware, async (req, res, next) => {
  try {
    await voteCommentSchema.validateAsync(req.body)
  } catch (err) {
    return next(new Error(err))
  }

  //Check if valid comment

  const comment = await getComment(req.body.comment_id)

  if (!comment) {
    return  next(new Error("no comment with this id"))
  }

  const vote = await getVote(req.session!.userId, req.body.comment_id)

  // status with vote, -1 : set status to 1, add two to score
  // 0, set status to 1, add one to score
  // 1 set status to 0, subtract one from score

  // no status set status to 1 and add one to score
  
  let score = 0
  let status = 0
  if(!vote || vote.status == 0) {
    await voteComment(req.session!.userId, req.body.comment_id, 1)
    score = await upVoteComment(req.body.comment_id)
    status = 1
  } else if (vote.status == -1) {
    await voteComment(req.session!.userId, req.body.comment_id, 1)
    await upVoteComment(req.body.comment_id)
    score = await upVoteComment(req.body.comment_id)
    status = 1
  } else {
    await voteComment(req.session!.userId, req.body.comment_id, 0)
    score = await downVoteComment(req.body.comment_id)
    status = 0
  }

  res.status(200).json({score, status})
})

router.post('/comment/downvote', loggedInMiddleware, async (req, res, next) => {
  try {
    await voteCommentSchema.validateAsync(req.body)
  } catch (err) {
    return next(new Error(err))
  }

  //Check if valid comment

  const comment = await getComment(req.body.comment_id)

  if (!comment) {
    return  next(new Error("no comment with this id"))
  }

  const vote = await getVote(req.session!.userId, req.body.comment_id)

  // -1, set stat to 0 and add one
  // 0, set stat to -1 and sub one
  // 1, set stat to -1 and sub two

  // no, set -1 and sub 1
  let status = 0
  let score = 0
  if(!vote || vote.status == 0) {
    await voteComment(req.session!.userId, req.body.comment_id, -1)
    score = await downVoteComment(req.body.comment_id)
    status = -1
  } else if (vote.status == -1) {
    await voteComment(req.session!.userId, req.body.comment_id, 0)
    score = await upVoteComment(req.body.comment_id)
    status = 0
  } else {
    await voteComment(req.session!.userId, req.body.comment_id, -1)
    await downVoteComment(req.body.comment_id)
    score = await downVoteComment(req.body.comment_id)
    status = -1
  }

  res.status(200).json({score, status})
})

export { router as comment }