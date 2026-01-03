"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_1 = __importDefault(require("./src/routes/post"));
const cors_1 = __importDefault(require("cors"));
const comment_1 = __importDefault(require("./src/routes/comment"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowedOrigins = [
    "http://localhost:5173",
    "https://news-hub-lime-two.vercel.app",
    "https://newshub-front-end-vgyl.vercel.app",
    "https://newshub-front-end.vercel.app"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "authorization"],
    credentials: true,
}));
app.use("/api/abc/user", auth_1.default);
app.use("/api/abc/post", post_1.default);
app.use("/api/abc/comment", comment_1.default);
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("DB connected");
})
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
app.listen(PORT, () => {
    console.log("Server is running");
});
