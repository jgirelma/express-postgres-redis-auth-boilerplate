import { getCommentsByPostId, getCommentsByPostIdWithUser, getTopCommentsByPostId, getTopCommentsByPostIdWithUser } from "../controlers/commentsController"
import { Router } from "express"

const router = Router()

router.get('/comments/:post_id', async (req, res, next) => {
  try {
    const post_id = parseInt(req.params.post_id, 10)
    const order = req.query.order

    let comments = {};
    let timerange = 0;

    switch (order) {
      case "new":
        if (!!req.session!.userId)
          comments = await getCommentsByPostIdWithUser(post_id, req.session!.userId);
        else comments = await getCommentsByPostId(post_id);
        res.status(200).json({ comments });
        return
      case "day":
        timerange = Math.floor(Date.now() / 1000) - 86400;
        break;
      case "week":
        timerange = Math.floor(Date.now() / 1000) - 604800;
        break;
      case "month":
        timerange = Math.floor(Date.now() / 1000) - 2629800;
        break;
      case "all":
        timerange = 0;
        break;
      default:
        throw new Error("Invalid Order");
    }

    if (!!req.session!.userId)
      comments = await getTopCommentsByPostIdWithUser(
        post_id,
        req.session!.userId,
        timerange
      );
    else comments = await getTopCommentsByPostId(post_id, timerange);

    res.status(200).json({ comments });
  } catch(err) {
    next(new Error(err))
  }
})

export { router as comments }