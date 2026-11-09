const db = require("../middlewares/db_connection");

const getActivePromotions = () => {
    return new Promise((resolve, reject) => {
        // ใช้ SQL กรองเฉพาะโปรโมชั่นที่อยู่ในช่วงเวลาปัจจุบัน
        const sql = `
            SELECT id, shop_id, title, description, start_date, end_date
            FROM promotions
            WHERE NOW() BETWEEN start_date AND end_date
        `;

        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = {
    getActivePromotions
};