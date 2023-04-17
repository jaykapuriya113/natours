const express = require("express");
const producutController = require("../controller/productController");
const likeController = require("../controller/likeProductController");
const commentController = require("../controller/commentController");
const authController = require("../controller/authController");
const upload = require("../multer");
const router = express.Router();

router
  .route("/")
  .post(upload.uploadUserPhoto, producutController.createProduct)
  .get(producutController.getAllProduct);

router.route("/mostRecentProduct").get(producutController.mostRecentProduct);
router
  .route("/mostLikedProduct")
  .get(authController.protect, likeController.MostLikedProduct);
router
  .route("/comment/:id")
  .post(authController.protect, commentController.comment);
router
  .route("/:id")
  .get(producutController.findProductById)
  .patch(producutController.updateProduct)
  .delete(producutController.deleteProduct);

router.route("/like/:id").post(authController.protect, likeController.like);
router
  .route("/dislike/:id")
  .post(authController.protect, likeController.dislike);

router
  .route("/getProductByProductType/:id")
  .get(producutController.getProductByProductType);
module.exports = router;
