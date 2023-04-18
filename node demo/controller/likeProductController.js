const AppError = require("../errorHandler/AppError");
const Like = require("../model/likeProduct");
const DisLike = require("../model/dislikeproduct");
const Product = require("../model/productModel");

///////////////////////////////////////////
/////create like

const like = async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError("product not found", 404));
    }

    await DisLike.findOneAndDelete({
      user_id: req.user.id,
      product_id: id,
    });

    const existinglike = await Like.findOne({
      user_id: req.user.id,
      product_id: id,
    });
    if (existinglike) {
      return next(new AppError("you are already like this product", 400));
    }
    const like = await Like.create({
      user_id: req.user.id,
      product_id: id,
    });
    res.status(400).json({
      status: "success",
      msg: "successfully liked this product",
      like,
    });
  } catch (err) {
    return next(new AppError("some thing went wrong in like controller", 404));
  }
};

//////////////////////////////////////////////////////
////create dislike
const dislike = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError("product is not found", 404));
    }

    await Like.findOneAndDelete({
      user_id: req.user.id,
      product_id: id,
    });

    const existingdislike = await DisLike.findOne({
      user_id: req.user.id,
      product_id: id,
    });
    if (existingdislike) {
      return next(new AppError("you Have already dislike this product", 400));
    }
    const dislike = await DisLike.create({
      user_id: req.user.id,
      product_id: id,
    });
    res.status(400).json({
      status: "success",
      msg: "successfully disliked this product",
      dislike,
    });
  } catch (err) {
    return next(
      new AppError("some thing went wrong in dislike controller", 404)
    );
  }
};

//////////////////////////////////////////////////
///get most liked product
const MostLikedProduct = async (req, res, next) => {
  const likedProduct = await Like.aggregate([
    {
      $group: {
        _id: "$product_id",
        count: { $sum: 1 }, // counting no. of documents pass
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 1,
    },
  ]).exec();
  if (likedProduct.length == 0) {
    return next(new AppError("not found any like on product", 404));
  }
  const product = likedProduct[0];
  const mostlikedProduct = await Product.findById(product._id);

  if (mostlikedProduct) {
    res.json({
      output: mostlikedProduct,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
};

module.exports = { like, dislike, MostLikedProduct };
