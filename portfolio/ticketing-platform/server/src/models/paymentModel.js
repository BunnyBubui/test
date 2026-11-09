const db = require("../middlewares/db_connection");

//ดึงออเดอร์จากระบบเพื่อเช็คยอดเงินที่ต้องกำหนด
const getOrderForPayment = (orderId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT order_id, total_price, received, create_at FROM orders_id WHERE order_id = ?`;
        db.query(sql, [orderId], (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        });
    });
};

//อัปเดตสลิปและสถานะ
const updatePaymentSuccess = (orderId, slipPath) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE orders_id 
            SET received = 1, slip_path = ? 
            WHERE order_id = ?
        `;
        db.query(sql, [slipPath, orderId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
module.exports = {
    getOrderForPayment,
    updatePaymentSuccess
};