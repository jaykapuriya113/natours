const Product = require("../model/productModel");
const AppError = require("../errorHandler/AppError");
const Comment = require("../model/commentmodel");

exports.comment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError("Product does not exists", 403));
    }

    const addComment = new Comment({
      user_id: req.user.id,
      product_id: product.id,
      comment: req.body.comment,
    });
    const created = await addComment.save();

    if (created) {
      res.json({
        status: "Comment Added Successfully",
        data: addComment,
      });
    }
  } catch (error) {
    return next(new AppError("Something went wrong", 500));
  }
};
