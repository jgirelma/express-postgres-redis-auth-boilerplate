import { Router } from "express";
import { loggedInMiddleware } from "../middleware/auth";

const router = Router();

router.post("/logout", loggedInMiddleware, (req, res, next) => {
  req.session!.destroy((err) => {
    if(err) return next(new Error(err))
    
    res.clearCookie("sid")
    res.status(200).json({message:"ok"})
  })
})

export { router as logout }