import { Router } from "express";
import { registerUser , userDetails , loginUser, refreshToken, validToken, loginAdmin, updateAuth, getUsers } from "../controllers/auth.controller";
import { updatePost } from "../controllers/post.controller";
import { authenticate } from "../middleware/auth";
import { roleCheck } from "../middleware/roleCheck";
import { Role } from "../models/userModel";

const authrouter = Router()

authrouter.post("/register",registerUser)
authrouter.post("/user-detail/:email", userDetails)
authrouter.post("/login",loginUser)
authrouter.post("/admin/login",loginAdmin)
authrouter.post("/refresh/:token_r", refreshToken)
authrouter.get("/valid/:token", validToken)
authrouter.post("/update/:id", authenticate , roleCheck([Role.User]) , updateAuth)
authrouter.get("/users",authenticate , roleCheck([Role.User]), getUsers)

export default authrouter
