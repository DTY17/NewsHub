"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByUser = getByUser;
exports.getByPost = getByPost;
exports.insert = insert;
exports.remove = remove;
exports.update = update;
exports.getAllID = getAllID;
const dotenv_1 = __importDefault(require("dotenv"));
const commentModel_1 = require("../models/commentModel");
const userModel_1 = require("../models/userModel");
const postModel_1 = require("../models/postModel");
dotenv_1.default.config();
async function getByUser(req, res) {
    try {
        const { _id, postId, comment } = req.params;
        const user = await userModel_1.User.findOne({ email: _id });
        const post = await postModel_1.Post.findById(postId);
        if (!user || !post) {
            return res.status(404).json({ message: "User or Post not found" });
        }
        const newComment = await commentModel_1.Comment.create({
            user: user._id,
            comment,
            post: post._id,
        });
        post.comment.push(newComment._id);
        await post.save();
        res.status(200).json({ data: newComment });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
async function getByPost(req, res) {
    try {
        const { id } = req.params;
        const post = await postModel_1.Post.findById(id).populate("comment");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({
            message: "successfully received data",
            data: post,
        });
    }
    catch (err) {
        res.status(500).json({ err });
    }
}
async function insert(req, res) {
    try {
        const { user, post, comment } = req.body;
        const userdata = await userModel_1.User.findOne({ email: user });
        const postdata = await postModel_1.Post.findById(post);
        if (!userdata || !postdata) {
            return res.status(404).json({ message: "User or Post not found" });
        }
        const newComment = await commentModel_1.Comment.create({
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
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
async function remove(req, res) {
    try {
        const { id } = req.params;
        await commentModel_1.Comment.deleteOne({ _id: id });
        res.status(200).json({ message: "successfully deleted" });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
async function update(req, res) {
    try {
        const { id, comment } = req.body;
        await commentModel_1.Comment.updateOne({ _id: id }, { comment });
        res.status(200).json({ message: "successfully updated" });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
async function getAllID(req, res) {
    try {
        const { data } = req.body;
        console.log(data);
        let commetList = [];
        for (let i = 0; i < data.length; i++) {
            const newComment = await commentModel_1.Comment.findById(data[i]).populate("user", "firstname lastname email image");
            commetList.push(newComment);
        }
        console.log(commetList);
        res.status(200).json({ data: commetList });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
