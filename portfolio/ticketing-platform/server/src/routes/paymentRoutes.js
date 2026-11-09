const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const upload = require('../middlewares/upload'); 

router.get("/generate-qr/:orderId", paymentController.getQRCode);
router.post('/verify-slip', upload.single('slip'), paymentController.submitSlip);

module.exports = router;