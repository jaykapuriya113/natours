const User = require("../model/userModel");
const AppError = require("../errorHandler/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUsers = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  try {
    if (password.includes(" ")) {
      return next(new AppError("avoiad all space"));
    }

    const existeuser = await User.find({ email: req.body.email });
    if (existeuser.length > 0) {
      return next(new AppError("Already user exist", 409));
    }

    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      dats: {
        user: newUser,
      },
    });
  } catch (err) {
    if (err.name == "ValidationError")
      return next(new AppError(err.message, 404));
    return next(new AppError("your request is not fullfiled.", 404));
  }
};
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new AppError("please provide email n pass", 400));
    }
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return next(new AppError("user not exist", 404));
    }
    const passwordexist = await bcrypt.compare(password, user.password);
    if (passwordexist) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      // const token=signToken(user._id);
      res.status(200).json({
        status: "success",
        data: {
          user,
          token,
        },
      });
    }
  } catch (err) {
    return next(new AppError("Incorrect email or password", 403));
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    return next(new AppError("data dose not exist", 500));
  }
};
