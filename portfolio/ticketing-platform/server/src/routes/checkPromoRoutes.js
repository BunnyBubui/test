const express = require("express");
const router = express.Router();
const promoController = require("../controllers/promoController");

// แมปเส้นทางไปยัง Controller
router.get("/check/promos", promoController.checkPromos);

module.exports = router;