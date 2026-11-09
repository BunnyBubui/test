const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// แมปเส้นทาง /get-product ไปยัง Controller
router.get("/product", productController.getProducts);

module.exports = router;