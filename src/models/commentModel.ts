import mongoose, { Document, Schema } from "mongoose"


export interface IComment extends Document{
    _id: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
    comment: string
}

const commentSchema = new mongoose.Schema<IComment>({
        user : { type: Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);
export const Comment = mongoose.model<IComment>("Comment", commentSchema)