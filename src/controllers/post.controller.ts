import { Request, Response } from "express";

import dotenv from "dotenv";
import { Post } from "../models/postModel";
dotenv.config();

export async function insert(req: Request, res: Response) {
  try {
    const body = req.body;
    const post = await Post.create({
      image: body.image,
      paragraph: body.paragraph,
      topic: body.topic,
      order: body.order,
      genre: body.genre,
      views: 0,
      comment: body.comment,
    });

    res.status(200).json({
      message: "successfully saved",
    });
  } catch (err) {
    res.status(200).json({
      message: "Error occured",
      error: err,
    });
  }
}

export async function getPost(req: Request, res: Response) {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "successfully recieved",
      data: posts,
    });
  } catch (err) {
    // console.log(err);
  }
}

export async function searchPost(req: Request, res: Response) {
  try {
    const { data, genre, page } = req.params;

    const limit = 9;
    const skip = (parseInt(page) - 1) * limit;

    const filter: any = {};
    if (data && data.toLowerCase() !== "all") {
      filter.topic = { $regex: data, $options: "i" };
    }
    if (genre && genre.toLowerCase() !== "all") {
      filter.genre = { $regex: genre, $options: "i" };
    }

    const posts = await Post.find(filter).skip(skip).limit(limit);
    const total = await Post.countDocuments(filter);

    res.status(200).json({
      message: "successfully received",
      data: {
        posts,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      message: "Error occurred",
      error: err,
    });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const posts = await Post.findById({ _id: id });
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }

    posts.views = Number(posts.views) + 1;
    await posts.save();
    console.log("post :::::::::::::::::::::::::::::::::::::\n", posts);
    res.status(200).json({
      message: "successfully received",
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error occurred",
      error: err,
    });
  }
}

export async function savePost(req: Request, res: Response) {
  try {
    const { topic, genre, views, paragraph, image, order, comment } = req.body;

    const posts = await Post.create({
      topic,
      genre,
      views,
      paragraph,
      image,
      order,
      comment,
    });

    res.status(200).json({
      message: "successfully saved",
      data: posts,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      message: "Error occurred",
      error: err,
    });
  }
}

export async function mostPopular(req: Request, res: Response) {
  try {
    const { genre } = req.params;
    let posts;
    if (genre == "All") {
      posts = await Post.find().sort({ views: -1 }).limit(9);
    } else {
      posts = await Post.find({ genre: genre }).sort({ views: -1 }).limit(9);
    }

    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "No posts found", data: [] });
    }

    res.status(200).json({
      message: "successfully recieved",
      data: posts,
    });
  } catch (err) {
    // console.log(err);
  }
}

export async function mostView(req: Request, res: Response) {
  try {
    const { genre } = req.params;
    let posts;
    if (genre == "All") {
      posts = await Post.find().sort({ views: -1 }).limit(9);
    } else {
      posts = await Post.find({ genre: genre }).sort({ views: -1 }).limit(9);
    }

    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "No posts found", data: [] });
    }

    res.status(200).json({
      message: "successfully recieved",
      data: posts,
    });
    // console.log(genre);
  } catch (err) {
    // console.log(err);
  }
}

export async function recent(req: Request, res: Response) {
  try {
    const { genre } = req.params;
    let posts;
    if (genre == "All") {
      posts = await Post.find().sort({ date: -1 }).limit(9);
    } else {
      posts = await Post.find({ genre: genre }).sort({ date: -1 }).limit(9);
    }
    // console.log("recent", posts);

    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "No posts found", data: [] });
    }
    
    res.status(200).json({
      message: "successfully recieved",
      data: posts,
    });
  } catch (err) {
    // console.log(err);
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const action = await Post.deleteOne({ _id: id });
    res.status(200).json({
      message: "successfully deleted",
      data: action,
    });
  } catch (err) {
    // console.log(err);
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const { _id, topic, genre, views, paragraph, image, order } = req.body;
    const posts = await Post.updateOne(
      { _id: _id },
      { $set: { topic, genre, views, paragraph, image, order } }
    );

    res.status(200).json({
      message: "successfully updated",
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error occurred",
      error: err,
    });
  }
}

export async function getComment(req: Request, res: Response) {
  try {
    const { _id } = req.params;
    const posts = await Post.findOne({ _id: _id });

    res.status(200).json({
      message: "comments recieved",
      data: posts?.comment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error occurred",
      error: err,
    });
  }
}

export async function increaseView(req: Request, res: Response) {
  try {
    const { _id } = req.params;
    let post = await Post.findById(_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    let V = Number(post.views) + 1;
    post.views = Number(post.views) + 1;
    await post.save();

    res.status(200).json({
      message: "View count updated",
      views: V,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error occurred",
      error: err,
    });
  }
}

export async function postCount(req: Request, res: Response) {
  try {
    console.log("get count");
    const count = await Post.countDocuments();
    res.status(200).json({
      count: count,
    });
  } catch (err) {
    // console.log(err);
  }
}

export async function getViewSum(req: Request, res: Response) {
  try {
    const total = await Post.aggregate([
      { $group: { _id: null, sumViews: { $sum: "$views" } } },
    ]);
    console.log();

    res.status(200).json({
      view: total[0].sumViews,
    });
  } catch (err) {
    // console.log(err);
  }
}
