import express from "express"
import { login, logout, signup } from "../controllers/auth.controller.js"
import protectedRoute from "../middleware/protectedRoute.js"

const authRouter = express.Router()

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/logout", protectedRoute, logout)

export default authRouter