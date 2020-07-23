import { Router } from "express";
import {
  getPostsByPage,
  getPostsByPageWithUser,
  getTopPostsByPageWithUser,
  getTopPostsByPage,
} from "../controlers/postsController";

const router = Router();

router.get("/posts", async (req, res, next) => {
  try {
    const pageString: any = req.query.page;
    const page = parseInt(pageString, 10);
    const order = req.query.order;
    console.log(page, order);

    if (page <= 0) {
      console.log(`${page}`);
      throw new Error("invalid page number");
    }

    if (!order) {
      throw new Error(`${order}`);
    }

    let posts = {};
    let timerange = 0;
    switch (order) {
      case "new":
        if (!!req.session!.userId)
          posts = await getPostsByPageWithUser(page, req.session!.userId);
        else posts = await getPostsByPage(page);
        return res.status(200).json({ posts });
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
      posts = await getTopPostsByPageWithUser(
        page,
        req.session!.userId,
        timerange
      );
    else posts = await getTopPostsByPage(page, timerange);
    console.log(posts);
    res.status(200).json({ posts });
  } catch (err) {
    return next(new Error(err));
  }
});

export { router as posts };
