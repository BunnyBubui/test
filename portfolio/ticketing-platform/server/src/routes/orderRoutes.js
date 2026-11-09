const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middlewares/verifyAdmin");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const orderController = require("../controllers/orderController");

// แมปเส้นทาง /calculate-shipping ไปยัง Controller
router.post("/calculate-shipping", orderController.calculateOrderShipping);

// แมปเส้นทาง /orders/:id ไปยัง Controller พร้อมเช็คสิทธิ์ (verifyAdmin) ก่อนเสมอ
router.delete("/orders/:id", verifyAdmin, orderController.deleteOrder);
router.delete("/orders-user/:orderId", orderController.cancelOrderByUser);
router.put("/update-status/:order_id", verifyAdmin, orderController.updateStatus);
router.put("/orders/:id", verifyAdmin, orderController.updateOrder);

// สำหรับ User ทั่วไป
router.get("/get-order/:phone", orderController.getUserOrders);
router.get("/get-ticket/:id", orderController.getOrderTicketByID);

// สำหรับ Admin
router.get("/get-all-orders", verifyAdmin, orderController.getAdminOrders);
router.get("/get-summary", verifyAdmin, orderController.getSummary);

// ให้อ่านไฟล์ในโฟลเดอร์ uploads ได้
router.use("/uploads", express.static(path.join(__dirname, "../../public/uploads")));

// ตั้งค่าที่เก็บไฟล์ของ Multer (โค้ดเดิมของคุณที่เขียนไว้ดีมากแล้ว)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date().toISOString().slice(0, 10);
    const uploadPath = path.join(__dirname, "../uploads", today);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { phone, shop_id } = req.body;
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().split(" ")[0].replace(/:/g, "");
    const ext = path.extname(file.originalname);
    const newName = `${phone || "order"}-${date}-${time}-${shop_id || "0"}${ext}`;
    cb(null, newName);
  },
});

const upload = multer({ storage });

// แมป URL -> Multer -> Controller
router.post("/orders", upload.single("slip"), orderController.createNewOrder);

module.exports = router;