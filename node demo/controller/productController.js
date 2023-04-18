const Product = require("../model/productModel");
const AppError = require("../errorHandler/AppError");
const ProductType = require("../model/productTypeModel");
const asyncHandler = require("express-async-handler");
exports.getAllProduct = async (req, res, next) => {
  try {
    const product = await Product.find().populate("productType");
    if (product.length == 0) {
      return res.status(200).json({
        status: "success",
        message: "No data found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    return next(new AppError("No product exists", 500));
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { productName, expireDate, price, productType, description } =
      req.body;
    console.log(productName, expireDate, price, productType, description);
    let producttypeID;
    const producttype = await ProductType.findOne({ _id: productType });

    if (!producttype) {
      return next(new AppError("ProductType does not exists", 404));
    } else {
      producttypeID = producttype._id;
    }

    const product = await Product.create({
      productType: producttypeID,
      productName,
      expireDate,
      price,
      description,
      photo: req.file.filename,
    });

    if (product) {
      res.status(201).json({
        data: product,
        message: "Product Created Successfully",
      });
    }
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError("Id is not exist", 400));
    }
    if (!req.body) {
      return next(new AppError("body is not exist", 400));
    }
    if (req.params.id.length != 24) {
      next(new AppError("Product is not a found", 404));
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.findProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    return next(new AppError({ err }, 500));
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError("Id is not exist", 404));
    }
    const productExists = await Product.findById(req.params.id);
    if (!productExists)
      return next(new AppError("Product does not exists", 400));

    // if (productExists.user_id.toString() !== req.user.id) {
    //   return next(
    //     new AppError("User don't have access to delete product", 401)
    //   );
    // }
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.mostRecentProduct = async (req, res, next) => {
  try {
    const recentValue = await Product.find().sort({ timestamp: -1 }).limit(1);
    res.status(200).json({
      status: "success",
      data: {
        recentValue,
      },
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};
exports.getProductByProductType = async (req, res, next) => {
  try {
    const product = await Product.find({ productType: req.params.id });
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};
