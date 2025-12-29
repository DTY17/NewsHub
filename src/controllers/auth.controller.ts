import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import { Role } from "../models/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { signAccessToken, signRefreshToken } from "../utils/token";

dotenv.config();
const secret = process.env.JWT_SECRET as string;
export interface AUthRequest extends Request {
  user?: any
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { firstname, lastname, email, password, roles, watchlist } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hash,
      roles: [Role.User],
      watchlist: watchlist,
    });

    res.status(201).json({
      message: "User registed",
      data: { email: user.email, roles: user.roles },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal; server error",
    });
  }
};

export const userDetails = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    console.log(email);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User Details", data: existingUser });
    } else {
      return res.status(401).json({ message: "No User" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal; server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const existingUser = await User.findOne({ email, roles: { $in: [1] } });
    if (existingUser) {
      const passwordCheck = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (passwordCheck) {
        const token = signAccessToken(existingUser)
        const refresh_token = signRefreshToken(existingUser)
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
    } else {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal; server error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
  try {
    const { token_r } = req.params;
    console.log(refreshToken)
    if (!refreshToken) {
      
      return res.status(400).json({
        message: true,
      });
    }
    const payload = jwt.verify(token_r, REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(400).json({
        message: false,
      });
    }

    const token = signAccessToken(user);
    return res.status(200).json({
      message: true,
      token: token,
    });
    
  } catch (err) {
    //console.log(err)
    return res.status(200).json({
      message: false,
    });
  }
};

export const validToken = async (req: AUthRequest, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const { token } = req.params;
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    res.status(200).json({
      message: true
    })
  } catch (err) {
    console.log(err)
    res.status(200).json({
      message: false
    })
  }      
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const existingUser = await User.findOne({ email, roles: { $in: [0] } });
    if (existingUser) {
      const passwordCheck = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (passwordCheck) {
        const token = signAccessToken(existingUser)
        const refresh_token = signRefreshToken(existingUser)
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
    } else {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal; server error",
    });
  }
};

export const updateAuth = async (req: Request, res: Response) => {
  try {
    const { firstName , lastName , avatarUrl } = req.body;
    const { id } = req.params;
    const user = await User.findOne({ email : id });
    console.log("image : ",avatarUrl)
    if (!user) { return res.status(404).json({ message: "User not found" }); }

    if (firstName) user.firstname = firstName; 
    if (lastName) user.lastname = lastName; 
    if (avatarUrl) user.image = avatarUrl;

    user.save()
    return res.status(200).json({ 
      message: "Updated" 
    })
  } catch (err) {
    return res.status(500).json({ 
      message: "NotUpdated" 
    })
  }
};

