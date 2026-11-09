const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// แมปเส้นทางไปยัง Controller
router.post("/check/stock", cartController.checkCartStock);

module.exports = router;