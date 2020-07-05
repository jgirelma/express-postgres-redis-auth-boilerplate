import { Router } from "express"
import { register } from "./routes/register"
import { logout } from "./routes/logout"
import { login } from "./routes/login"
import { user } from "./routes/user"

const router = Router()

router.use(register)

router.use(logout)

router.use(login)

router.use(user)

export { router as apiRouter }