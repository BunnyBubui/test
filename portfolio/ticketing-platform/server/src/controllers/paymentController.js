const paymentService = require("../services/paymentService");

//โค้ดดึง qr code และรับค่า orderId เข้ามาเช็คในระบบ
const getQRCode = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await paymentService.generatePaymentQR(orderId);
        
        res.status(200).json({
            message: "✅ สร้าง QR Code สำเร็จ",
            data: result
        });
    } catch (error) {
        console.error("❌ Generate QR Error:", error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message || "เกิดข้อผิดพลาดในการสร้างคิวอาร์โค้ด" });
    }
};

//ยืนยันว่าส่งสลิปเข้ามาในระบบแล้ว
const submitSlip = async (req, res) => {
    try {
        const orderId = req.body.orderId || req.body.order_id;
        
        if (!req.file) {
            return res.status(400).json({ error: "❌ ไม่พบไฟล์สลิป (Multer ไม่ได้รับไฟล์)" });
        }

        if (!orderId) {
            return res.status(400).json({ error: "❌ ไม่พบหมายเลขออเดอร์ (orderId is missing)" });
        }

        const today = new Date().toISOString().slice(0, 10);
        //ให้บันทึกเส้นทาง slip ลงบน database เพื่อใช้ค้นหาสลิปนั้นๆ
        const slipPath = `/uploads/${today}/${req.file.filename}`;
        await paymentService.verifyAndConfirmSlip(orderId, slipPath);

        console.log(`✅ บันทึกสลิปเรียบร้อย: ${req.file.filename}`);

        res.status(200).json({
            message: "✅ ยืนยันการชำระเงินสำเร็จ ระบบกำลังตรวจสอบสลิป",
            slip_path: slipPath 
        });

    } catch (error) {
        console.error("❌ submitSlip Error:", error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message || "เกิดข้อผิดพลาดในการส่งสลิป" });
    }
};

module.exports = {
    getQRCode,
    submitSlip
};