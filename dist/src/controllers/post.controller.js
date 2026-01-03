"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = insert;
exports.getPost = getPost;
exports.searchPost = searchPost;
exports.getById = getById;
exports.savePost = savePost;
exports.mostPopular = mostPopular;
exports.mostView = mostView;
exports.recent = recent;
exports.deletePost = deletePost;
exports.updatePost = updatePost;
exports.getComment = getComment;
exports.increaseView = increaseView;
exports.postCount = postCount;
exports.getViewSum = getViewSum;
exports.getLoadWatchlist = getLoadWatchlist;
const dotenv_1 = __importDefault(require("dotenv"));
const postModel_1 = require("../models/postModel");
const userModel_1 = require("../models/userModel");
dotenv_1.default.config();
async function insert(req, res) {
    try {
        const body = req.body;
        const post = await postModel_1.Post.create({
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
    }
    catch (err) {
        res.status(200).json({
            message: "Error occured",
            error: err,
        });
    }
}
async function getPost(req, res) {
    try {
        const posts = await postModel_1.Post.find();
        res.status(200).json({
            message: "successfully recieved",
            data: posts,
        });
    }
    catch (err) {
        // console.log(err);
    }
}
async function searchPost(req, res) {
    try {
        const { data, genre, page, user } = req.params;
        const limit = 9;
        const skip = (parseInt(page) - 1) * limit;
        const filter = {};
        if (data && data.toLowerCase() !== "all") {
            filter.topic = { $regex: data, $options: "i" };
        }
        if (genre && genre.toLowerCase() !== "all") {
            filter.genre = { $regex: genre, $options: "i" };
        }
        const u = await userModel_1.User.findOne({ email: user });
        if (!u) {
            return res.status(404).json({ message: "User not found" });
        }
        const posts = await postModel_1.Post.find(filter).skip(skip).limit(limit);
        const watch_list = u.watchlist?.length || 0;
        posts.forEach((post) => {
            post.isWatchList = false;
        });
        for (let i = 0; i < watch_list; i++) {
            for (let j = 0; j < posts.length; j++) {
                if (u.watchlist && u.watchlist[i] == posts[j]._id) {
                    posts[j].isWatchList = true;
                }
            }
        }
        const total = await postModel_1.Post.countDocuments(filter);
        res.status(200).json({
            message: "successfully received",
            data: {
                posts,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (err) {
        // console.log(err);
        res.status(500).json({
            message: "Error occurred",
            error: err,
        });
    }
}
async function getById(req, res) {
    try {
        const { id } = req.params;
        const posts = await postModel_1.Post.findById({ _id: id });
        if (!posts) {
            return res.status(404).json({ message: "Post not found" });
        }
        posts.views = Number(posts.views) + 1;
        await posts.save();
        res.status(200).json({
            message: "successfully received",
            data: posts,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error occurred",
            error: err,
        });
    }
}
async function savePost(req, res) {
    try {
        const { topic, genre, views, paragraph, image, order, comment } = req.body;
        const posts = await postModel_1.Post.create({
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
    }
    catch (err) {
        // console.log(err);
        res.status(500).json({
            message: "Error occurred",
            error: err,
        });
    }
}
async function mostPopular(req, res) {
    try {
        const { genre } = req.params;
        let posts;
        if (genre == "All") {
            posts = await postModel_1.Post.find().sort({ views: -1 }).limit(9);
        }
        else {
            posts = await postModel_1.Post.find({ genre: genre }).sort({ views: -1 }).limit(9);
        }
        if (!posts || posts.length === 0) {
            return res.status(200).json({ message: "No posts found", data: [] });
        }
        res.status(200).json({
            message: "successfully recieved",
            data: posts,
        });
    }
    catch (err) {
        // console.log(err);
    }
}
async function mostView(req, res) {
    try {
        const { genre } = req.params;
        let posts;
        if (genre == "All") {
            posts = await postModel_1.Post.find().sort({ views: -1 }).limit(9);
        }
        else {
            posts = await postModel_1.Post.find({ genre: genre }).sort({ views: -1 }).limit(9);
        }
        if (!posts || posts.length === 0) {
            return res.status(200).json({ message: "No posts found", data: [] });
        }
        res.status(200).json({
            message: "successfully recieved",
            data: posts,
        });
        // console.log(genre);
    }
    catch (err) {
        // console.log(err);
    }
}
async function recent(req, res) {
    try {
        const { genre } = req.params;
        let posts;
        if (genre == "All") {
            posts = await postModel_1.Post.find().sort({ date: -1 }).limit(9);
        }
        else {
            posts = await postModel_1.Post.find({ genre: genre }).sort({ date: -1 }).limit(9);
        }
        // console.log("recent", posts);
        if (!posts || posts.length === 0) {
            return res.status(200).json({ message: "No posts found", data: [] });
        }
        res.status(200).json({
            message: "successfully recieved",
            data: posts,
        });
    }
    catch (err) {
        // console.log(err);
    }
}
async function deletePost(req, res) {
    try {
        const { id } = req.params;
        const action = await postModel_1.Post.deleteOne({ _id: id });
        res.status(200).json({
            message: "successfully deleted",
            data: action,
        });
    }
    catch (err) {
        // console.log(err);
    }
}
async function updatePost(req, res) {
    try {
        const { _id, topic, genre, views, paragraph, image, order } = req.body;
        const posts = await postModel_1.Post.updateOne({ _id: _id }, { $set: { topic, genre, views, paragraph, image, order } });
        res.status(200).json({
            message: "successfully updated",
            data: posts,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error occurred",
            error: err,
        });
    }
}
async function getComment(req, res) {
    try {
        const { _id } = req.params;
        const posts = await postModel_1.Post.findOne({ _id: _id });
        res.status(200).json({
            message: "comments recieved",
            data: posts?.comment,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error occurred",
            error: err,
        });
    }
}
async function increaseView(req, res) {
    try {
        const { _id } = req.params;
        let post = await postModel_1.Post.findById(_id);
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
    }
    catch (err) {
        res.status(500).json({
            message: "Error occurred",
            error: err,
        });
    }
}
async function postCount(req, res) {
    try {
        console.log("get count");
        const count = await postModel_1.Post.countDocuments();
        res.status(200).json({
            count: count,
        });
    }
    catch (err) {
        // console.log(err);
    }
}
async function getViewSum(req, res) {
    try {
        const total = await postModel_1.Post.aggregate([
            { $group: { _id: null, sumViews: { $sum: "$views" } } },
        ]);
        console.log();
        res.status(200).json({
            view: total[0].sumViews,
        });
    }
    catch (err) {
        // console.log(err);
    }
}
async function getLoadWatchlist(req, res) {
    try {
        const { data, genre, page } = req.params;
        const limit = 9;
        const skip = (parseInt(page) - 1) * limit;
        const filter = {};
        if (data && data.toLowerCase() !== "all") {
            filter.topic = { $regex: data, $options: "i" };
        }
        if (genre && genre.toLowerCase() !== "all") {
            filter.genre = { $regex: genre, $options: "i" };
        }
        const posts = await postModel_1.Post.find(filter).skip(skip).limit(limit);
        const total = await postModel_1.Post.countDocuments(filter);
        res.status(200).json({
            message: "successfully received",
            data: {
                posts,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error occurred",
            error: err,
        });
    }
}
