import mongoose, { Document, Schema } from "mongoose";

export enum Role {
  Admin,
  User,
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: Role[];
  watchlist?: mongoose.Types.ObjectId[];
  image?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, enum: Object.values(Role) }],
    watchlist: [{ type: Schema.Types.ObjectId, ref: "Post" }], 
    image: {type: String, required: false}
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model<IUser>("User", userSchema);
