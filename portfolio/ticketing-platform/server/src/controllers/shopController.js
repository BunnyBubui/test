const shopService = require("../services/shopService");

const getShops = async (req, res) => {
    try {
        const result = await shopService.fetchAllShops();
        res.status(200).json({
            message: "✅ ดึงข้อมูลร้านค้าสำเร็จ",
            count: result.count,
            data: result.data,
        });

    } catch (error) {
        console.error("❌ ดึงข้อมูลร้านค้าผิดพลาด:", error);
        
        // ดึง status จาก error ที่ Service ส่งมา ถ้าไม่มีให้ใช้ 500
        const status = error.status || 500;
        res.status(status).json({ 
            error: error.message || "เกิดข้อผิดพลาดในระบบฐานข้อมูล" 
        });
    }
};

module.exports = {
    getShops
};