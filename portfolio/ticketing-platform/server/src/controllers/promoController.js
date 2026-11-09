const promoService = require("../services/promoService");

const checkPromos = async (req, res) => {
    try {
        const result = await promoService.getActivePromosList();
        res.status(200).json(result);
        
    } catch (error) {
        console.error("❌ ดึงข้อมูลโปรโมชั่นผิดพลาด:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบฐานข้อมูล" });
    }
};

module.exports = {
    checkPromos
};