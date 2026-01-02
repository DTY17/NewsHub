
import mongoose, { Document, Schema } from "mongoose"

export enum Genre{
    Finance , Sports , Technology , Environment , Health , Business , Travel , Politics , 
}

export enum ContentOrder{
    Paragraph , Image , Topic
}

export interface IPost extends Document{
    _id: mongoose.Types.ObjectId
    image : string[]
    paragraph: string[]
    topic: string
    order: ContentOrder[]
    genre: Genre[]
    views : Number
    date : Date
    comment : mongoose.Types.ObjectId[]
}

const postSchema = new mongoose.Schema<IPost>({
        image: [{ type: String, required: true }],
        paragraph: [{ type: String, required: true }],
        topic: { type: String, required: true },
        order: [{ type: String, enum: Object.values(ContentOrder), required: true }],
        genre: [{ type: String, enum: Object.values(Genre), required: true }],
        views: { type: Number, required: true },
        date : { type: Date, required: true , default: Date.now },
        comment : [{ type: Schema.Types.ObjectId, ref: "Comment", required: false }],
    },
    {
        timestamps: true,
    }
);
export const Post = mongoose.model<IPost>("Post", postSchema)