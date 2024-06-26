import { Schema, model, models } from "mongoose";

const MemeSchema = new Schema({
  file: { type: String, required: false },
  caption: { type: String, required: false },
  likes: { type: Number, default: 0, required: false },
  upvotes: { type: Number, default: 0, required: false },
  downvotes: { type: Number, default: 0, required: false },
  views: { type: Number, default: 0, required: false },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  authorId: { type: String, required: true },
  tag: { type: String, required: false },
  date: { type: Date, default: Date.now, required: false },
})

const Meme = models.Meme || model("Meme", MemeSchema)
export default Meme