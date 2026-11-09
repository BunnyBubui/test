const productModel = require("../models/productModel");

const checkStock = async (items) => {
    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw { status: 400, message: "ข้อมูลตะกร้าสินค้าไม่ถูกต้อง" };
    }

    // 2. ดึงข้อมูลสินค้าจากฐานข้อมูล
    const productIds = items.map(item => item.product_id);
    const dbProducts = await productModel.getProductsByIds(productIds);

    let outOfStockItems = [];

    // 3. วนลูปเช็คสต็อก
    for (let item of items) {
        const dbProduct = dbProducts.find(r => r.product_id === item.product_id);

        if (!dbProduct) {
            outOfStockItems.push({ product_id: item.product_id, message: "ไม่พบสินค้านี้ในระบบ" });
            continue;
        }

        // ถ้าไม่ใช่ Preorder และจำนวนที่สั่ง มากกว่า สต็อกที่มี
        if (dbProduct.preorder !== 1 && item.quantity > dbProduct.quantity) {
            outOfStockItems.push({
                product_id: item.product_id,
                requested: item.quantity,
                available: dbProduct.quantity,
                message: dbProduct.quantity === 0 ? "สินค้าหมดแล้ว" : `เหลือแค่ ${dbProduct.quantity} ชุด`
            });
        }
    }

    // 4. สรุปผลลัพธ์
    if (outOfStockItems.length > 0) {
        throw {
            status: 400,
            available: false,
            message: "มีสินค้าบางรายการสต็อกไม่เพียงพอ",
            issues: outOfStockItems
        };
    }

    // ผ่านทั้งหมด
    return {
        available: true,
        message: "สินค้าทั้งหมดมีสต็อกเพียงพอ"
    };
};

module.exports = {
    checkStock
};