import { Router } from "express";
import { loggedInMiddleware } from "../middleware/auth";
import { getUserById } from "../controlers/userControler";

const router = Router();

router.post("/user", loggedInMiddleware, async (req, res) => {
  const userId = req.session!.userId;

  const user = await getUserById(userId);

  res.status(200).json({ message: "OK", user });
});

export {router as user}