const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
