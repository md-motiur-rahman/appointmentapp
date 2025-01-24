import express from "express"
import { getMe, login, logout, signup } from "../controllers/auth.controller.js"
import protectedRoute from "../middleware/protectedRoute.js"

const authRouter = express.Router()

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/logout", protectedRoute, logout)
authRouter.get("/me", protectedRoute, getMe)

export default authRouter