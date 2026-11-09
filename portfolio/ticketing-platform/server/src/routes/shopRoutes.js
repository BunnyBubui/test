const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

// แมปเส้นทาง /get-shop ไปยัง Controller
router.get("/shop", shopController.getShops);

module.exports = router;