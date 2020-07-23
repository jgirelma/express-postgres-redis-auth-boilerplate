import { Router } from "express"
import { register } from "./routes/register"
import { logout } from "./routes/logout"
import { login } from "./routes/login"
import { user } from "./routes/user"
import { post } from "./routes/post"
import { posts } from "./routes/posts"
import { comments } from "./routes/comments"
import { comment } from "./routes/comment"

const router = Router()

router.use((req, _res, next) => {
  console.log(req)
  next()
})

router.use(register)

router.use(logout)

router.use(login)

router.use(user)

router.use(posts)

router.use(post)

router.use(comment)

router.use(comments)

export { router as apiRouter }