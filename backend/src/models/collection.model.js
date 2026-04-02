import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#00E19E",
    },
    icon: {
      type: String,
      default: "📁",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);