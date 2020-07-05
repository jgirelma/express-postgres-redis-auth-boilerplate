import { Router } from "express"
import { isNotLoggedInMiddleware } from "../middleware/auth"
import { loginSchema } from "../validation/auth"
import { getUserByEmail, createUser } from "../controlers/userControler"

const router = Router()

router.post('/register', isNotLoggedInMiddleware, async (req, res, next) => {
  loginSchema.validate(req.body)

  const { email, password, firstname, lastname } = req.body

  if (!!(await getUserByEmail(email))) return next(new Error("Email In Use"))

  const user = await createUser(firstname, lastname, email, password)

  req.session!.userId = user.id

  res.status(201).json({message:"User registered, loggend in"})
})

export { router as register }