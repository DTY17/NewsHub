import jwt from "jsonwebtoken";
import  { IUser }  from "../models/userModel";
import dotEnv from "dotenv";

dotEnv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string

export const signAccessToken = (users: IUser) => {
  return jwt.sign({ sub: users._id.toString(), role: users.roles }, JWT_SECRET, {
    expiresIn: "10m",
  });
};
export const signRefreshToken = (user: IUser): string => {
  return jwt.sign({ sub: user._id.toString(), roles: user.roles }, REFRESH_SECRET, {
    expiresIn: "50m"
  })
}