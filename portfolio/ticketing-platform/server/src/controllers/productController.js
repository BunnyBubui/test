const productService = require("../services/productService");

const getProducts = async (req, res) => {
    try {
        const result = await productService.fetchAndFormatProducts();
        res.status(200).json({
            message: "success",
            total: result.total,
            data: result.data,
        });
        
    } catch (error) {
        console.error("❌ ดึงข้อมูลสินค้าผิดพลาด:", error);
        const status = error.status || 500;
        res.status(status).json({ 
            error: error.message || "เกิดข้อผิดพลาดในระบบฐานข้อมูล" 
        });
    }
};

module.exports = {
    getProducts
};