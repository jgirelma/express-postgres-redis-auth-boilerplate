import { Router } from "express";
import { isNotLoggedInMiddleware } from "../middleware/auth";
import { loginSchema } from "../validation/auth";
import {
  getUserByEmail,
  getUserHashedPasswordById,
} from "../controlers/userControler";
import { compare } from "bcryptjs";

const router = Router();

router.post("/login", isNotLoggedInMiddleware, async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
  } catch(err) {
    return next(new Error(err))
  }

  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) return next(new Error("Invalid Email/Password"));

  const userFieldsOnlyPassword = await getUserHashedPasswordById(user.id);

  const match = await compare(password, userFieldsOnlyPassword.password);

  if (!match) return next(new Error("Invalid Email/Password"));

  req.session!.userId = user.id;

  res.status(200).json({ message: "logged in", user });
});

export { router as login };
