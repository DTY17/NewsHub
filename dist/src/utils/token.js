"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const signAccessToken = (users) => {
    return jsonwebtoken_1.default.sign({ sub: users._id.toString(), role: users.roles }, JWT_SECRET, {
        expiresIn: "10m",
    });
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ sub: user._id.toString(), roles: user.roles }, REFRESH_SECRET, {
        expiresIn: "50m"
    });
};
exports.signRefreshToken = signRefreshToken;
