const promoModel = require("../models/promoModel");

const getActivePromosList = async () => {
    // 1. ดึงข้อมูลจากฐานข้อมูล
    const result = await promoModel.getActivePromotions();

    // 2. ถ้าไม่มีข้อมูล ส่งรูปแบบผลลัพธ์เปล่าๆ กลับไป
    if (!result || result.length === 0) {
        return {
            count: 0,
            data: [],
            message: "ไม่มีโปรโมชั่นที่เปิดใช้งานอยู่"
        };
    }

    // 3. จัดกลุ่มข้อมูล (ป้องกันการส่งโปรโมชั่นซ้ำใน 1 ร้านค้า)
    const grouped = {};
    for (const promo of result) {
        if (!grouped[promo.shop_id]) {
            grouped[promo.shop_id] = {
                shop_id: Number(promo.shop_id),
                active: true, // Query มาด้วยเงื่อนไขเวลาแล้ว ดังนั้นคือ active แน่นอน
                promo: promo
            };
        }
    }

    // 4. แปลง Object ให้กลับมาเป็น Array
    const responseData = Object.values(grouped);

    // 5. ส่งผลลัพธ์กลับไปให้ Controller
    return {
        count: responseData.length,
        data: responseData
    };
};

module.exports = {
    getActivePromosList
};