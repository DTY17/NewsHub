import express from "express";
import authrouter from "./src/routes/auth";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRouter from "./src/routes/post";
import cors from "cors";
import commentRouter from "./src/routes/comment";
import { authenticate } from "./src/middleware/auth";

dotenv.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI as string;

const app = express();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://news-hub-lime-two.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "authorization"],
    credentials: true,
  })
);

app.use("/api/abc/user", authrouter);
app.use("/api/abc/post", postRouter);
app.use("/api/abc/comment", commentRouter);

mongoose
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
