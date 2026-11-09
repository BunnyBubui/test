const cartService = require("../services/cartService");

const checkCartStock = async (req, res) => {
    try {
        const { items } = req.body;
        
        // ส่งไปประมวลผลที่ Service
        const result = await cartService.checkStock(items);
        
        // ถ้าสำเร็จ (มีสต็อกพอ) ส่ง 200 OK กลับไป
        res.status(200).json(result);
        
    } catch (error) {
        const status = error.status || 500;
        
        // กรณีที่ Service โยน Error แบบมีประเด็นสินค้าไม่พอ (issues) ออกมา
        if (error.issues) {
            return res.status(status).json({
                available: error.available,
                message: error.message,
                issues: error.issues
            });
        }
        
        // กรณี Error ทั่วไป เช่น ฐานข้อมูลล่ม
        res.status(status).json({ error: error.message || "เกิดข้อผิดพลาดในระบบฐานข้อมูล" });
    }
};

module.exports = {
    checkCartStock
};