import { Request, Response } from "express";
import dotenv from "dotenv";
import { Comment } from "../models/commentModel";
import { User } from "../models/userModel";
import { Post } from "../models/postModel";

dotenv.config();

export async function getByUser(req: Request, res: Response) {
  try {
    const { _id, postId, comment } = req.params;

    const user = await User.findOne({ email: _id });
    const post = await Post.findById(postId);

    if (!user || !post) {
      return res.status(404).json({ message: "User or Post not found" });
    }

    const newComment = await Comment.create({
      user: user._id,
      comment,
      post: post._id,
    });

    post.comment.push(newComment._id);
    await post.save();

    res.status(200).json({ data: newComment });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
export async function getByPost(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("comment");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "successfully received data",
      data: post,
    });
  } catch (err) {
    res.status(500).json({ err });
  }
}

export async function insert(req: Request, res: Response) {
  try {
    const { user, post, comment } = req.body;
    const userdata = await User.findOne({ email: user });
    const postdata = await Post.findById(post);

    if (!userdata || !postdata) {
      return res.status(404).json({ message: "User or Post not found" });
    }

    const newComment = await Comment.create({
      user: userdata._id,
      comment,
      post: postdata._id,
    });

    postdata.comment.push(newComment._id);
    await postdata.save();
    console.log("post ;;;", postdata);
    res.status(200).json({
      message: "successfully saved",
      data: newComment,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await Comment.deleteOne({ _id: id });

    res.status(200).json({ message: "successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id, comment } = req.body;

    await Comment.updateOne({ _id: id }, { comment });

    res.status(200).json({ message: "successfully updated" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function getAllID(req: Request, res: Response) {
  try {
    const { data } = req.body;
    console.log(data)
    let commetList = [];
    for (let i = 0; i < data.length; i++) {
      const newComment = await Comment.findById(data[i]).populate("user", "firstname lastname email image");
      commetList.push(newComment);
    }

    console.log(commetList)
    res.status(200).json({ data: commetList });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
