import { Router } from "express";
import { getAllID, getByPost, getByUser, insert, remove, update } from "../controllers/comment.controller";
import { authenticate } from "../middleware/auth";

const commentRouter = Router()

commentRouter.post("/save-comment", authenticate , insert)
commentRouter.post("/delete-comment/:id", authenticate , remove)
commentRouter.post("/update-comment/:id/:comment", authenticate , update)

commentRouter.post("/get-by-user-comment/:user", authenticate , getByUser)
commentRouter.post("/get-by-post-comment/:post", authenticate , getByPost)
commentRouter.post("/get-all-by-id", authenticate , getAllID)

export default commentRouter