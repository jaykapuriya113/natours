// const AppError = require("../errorHandler/AppError");
// const jwt = require("jsonwebtoken");
// exports.protect = async (req, res, next) => {
//   try {
//     let token;
//     console.log(req.headers);
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }
//     if (!token) {
//       return next(new AppError("you are not login", 401));
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const freshUser = await User.findById(decoded.id);
//     req.user = freshUser;
//     next();
//   } catch (err) {
//     return next(new AppError(err));
//   }
// };

const AppError = require("../errorHandler/AppError");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    );
    {
      token = req.headers.authorization.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const freshuser = await User.findById(decoded._id);
    if (!freshuser) {
      next(new AppError("you are not log in", 403));
    }

    req.user = freshuser;
    next();
  } catch (err) {
    next(new AppError("you are not log in", 403));
  }
};
module.exports = { protect };
