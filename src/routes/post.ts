import { Router } from "express";
import {
  getById,
  getPost,
  insert,
  mostPopular,
  mostView,
  recent,
  savePost,
  searchPost,
  deletePost,
  updatePost,
  getComment,
  increaseView,
  postCount,
  getViewSum,
} from "../controllers/post.controller";
import { Role } from "../models/userModel";
import { roleCheck } from "../middleware/roleCheck";
import { authenticate } from "../middleware/auth";

const postRouter = Router();

postRouter.post("/save-post", authenticate , roleCheck([Role.Admin]), insert);
postRouter.post("/get-post", getPost);
postRouter.post(
  "/search-post/:data/:genre/:page/:user",
  searchPost
);
postRouter.post("/post-by-id/:id", getById);
postRouter.post("/save-post", authenticate , roleCheck([Role.Admin]), savePost);
postRouter.post("/most-popular/:genre", mostPopular);
postRouter.post("/most-view/:genre", mostView);
postRouter.post("/recent/:genre" , recent);
postRouter.post("/delete/:id", authenticate , roleCheck([Role.Admin]), deletePost);
postRouter.post("/update", authenticate , roleCheck([Role.Admin]), updatePost);
postRouter.post("/get-comment/:id", authenticate , roleCheck([Role.Admin,Role.User]), getComment);
postRouter.post("/post-by-id-view/:id", increaseView);
postRouter.post("/post-by-id-view/:id", increaseView);
postRouter.post("/count", postCount);
postRouter.post("/view-count", getViewSum);

export default postRouter;
