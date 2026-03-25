import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["article", "tweet", "youtube", "image", "pdf"],
      required: true,
    },

    title: String,
    description: String,
    url: String,
    thumbnail: String,

    content: String, // extracted text

    tags: [String],

    embedding: {
      type: [Number], 
      default: [],
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Memory", memorySchema);