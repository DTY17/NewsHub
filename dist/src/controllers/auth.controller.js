"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuth = exports.loginAdmin = exports.validToken = exports.refreshToken = exports.loginUser = exports.userDetails = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_2 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const token_1 = require("../utils/token");
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const { firstname, lastname, email, password, roles, watchlist } = req.body;
        const existingUser = await userModel_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email exists" });
        }
        const hash = await bcrypt_1.default.hash(password, 10);
        const user = await userModel_1.User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hash,
            roles: [userModel_2.Role.User],
            watchlist: watchlist,
        });
        res.status(201).json({
            message: "User registed",
            data: { email: user.email, roles: user.roles },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal; server error",
        });
    }
};
exports.registerUser = registerUser;
const userDetails = async (req, res) => {
    try {
        const { email } = req.params;
        console.log(email);
        const existingUser = await userModel_1.User.findOne({ email });
        if (existingUser) {
            return res
                .status(200)
                .json({ message: "User Details", data: existingUser });
        }
        else {
            return res.status(401).json({ message: "No User" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal; server error",
        });
    }
};
exports.userDetails = userDetails;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        const existingUser = await userModel_1.User.findOne({ email, roles: { $in: [1] } });
        if (existingUser) {
            const passwordCheck = await bcrypt_1.default.compare(password, existingUser.password);
            if (passwordCheck) {
                const token = (0, token_1.signAccessToken)(existingUser);
                const refresh_token = (0, token_1.signRefreshToken)(existingUser);
                return res.status(201).json({
                    message: "User registed",
                    data: {
                        email: existingUser.email,
                        roles: existingUser.roles,
                        token: token,
                        refresh_token: refresh_token
                    },
                });
            }
        }
        else {
            return res.status(401).json({
                message: "invalid credentials",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal; server error",
        });
    }
};
exports.loginUser = loginUser;
const refreshToken = async (req, res) => {
    const REFRESH_SECRET = process.env.REFRESH_SECRET;
    try {
        const { token_r } = req.params;
        console.log(exports.refreshToken);
        if (!exports.refreshToken) {
            return res.status(400).json({
                message: true,
            });
        }
        const payload = jsonwebtoken_1.default.verify(token_r, REFRESH_SECRET);
        const user = await userModel_1.User.findById(payload.sub);
        if (!user) {
            return res.status(400).json({
                message: false,
            });
        }
        const token = (0, token_1.signAccessToken)(user);
        return res.status(200).json({
            message: true,
            token: token,
        });
    }
    catch (err) {
        //console.log(err)
        return res.status(200).json({
            message: false,
        });
    }
};
exports.refreshToken = refreshToken;
const validToken = async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { token } = req.params;
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = payload;
        res.status(200).json({
            message: true
        });
    }
    catch (err) {
        console.log(err);
        res.status(200).json({
            message: false
        });
    }
};
exports.validToken = validToken;
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        const existingUser = await userModel_1.User.findOne({ email, roles: { $in: [0] } });
        if (existingUser) {
            const passwordCheck = await bcrypt_1.default.compare(password, existingUser.password);
            if (passwordCheck) {
                const token = (0, token_1.signAccessToken)(existingUser);
                const refresh_token = (0, token_1.signRefreshToken)(existingUser);
                return res.status(201).json({
                    message: "Admin Login Successful",
                    data: {
                        email: existingUser.email,
                        roles: existingUser.roles,
                        token: token,
                        refresh_token: refresh_token
                    },
                });
            }
        }
        else {
            return res.status(402).json({
                message: "invalid credentials",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal; server error",
        });
    }
};
exports.loginAdmin = loginAdmin;
const updateAuth = async (req, res) => {
    try {
        const { firstName, lastName, avatarUrl } = req.body;
        const { id } = req.params;
        const user = await userModel_1.User.findOne({ email: id });
        console.log("image : ", avatarUrl);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (firstName)
            user.firstname = firstName;
        if (lastName)
            user.lastname = lastName;
        if (avatarUrl)
            user.image = avatarUrl;
        user.save();
        return res.status(200).json({
            message: "Updated"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "NotUpdated"
        });
    }
};
exports.updateAuth = updateAuth;
