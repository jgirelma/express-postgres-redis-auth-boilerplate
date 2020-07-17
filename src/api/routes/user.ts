import { Router } from "express";
import { getUserById } from "../controlers/userControler";

const router = Router();

const isLoggedIn = (req: any) => {
  return !!req.session!.userId;
};

router.post("/user", async (req, res) => {
  if (!isLoggedIn(req)) {
    res.clearCookie('sid')
    res.status(401)
    res.json({message: 'Not Authorized: Please Login'})
  } else {
    const userId = req.session!.userId;

    const user = await getUserById(userId);

    res.status(200).json({ message: "OK", user });
  }
});

export { router as user };
