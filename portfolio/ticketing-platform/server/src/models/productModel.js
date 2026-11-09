const db = require("../middlewares/db_connection");

// 1. ฟังก์ชันดึงข้อมูลสินค้าตาม ID (ถูกต้องอยู่แล้ว แต่เพิ่มคอมเมนต์อธิบาย)
const getProductsByIds = (productIds) => {
    return new Promise((resolve, reject) => {
        // ป้องกันกรณีที่ไม่มี ID ส่งมา
        if (!productIds || productIds.length === 0) {
            return resolve([]);
        }

        const placeholders = productIds.map(() => '?').join(',');
        const sql = `
            SELECT product_id, quantity, preorder 
            FROM products 
            WHERE product_id IN (${placeholders})
        `;

        db.query(sql, productIds, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// 2. ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด
const getAllProductsWithDetails = () => {
    return new Promise((resolve, reject) => {
        // อัปเดต: เปลี่ยน shirt_name เป็น name และลบ JOIN ตารางที่ไม่มีในฐานข้อมูลออก
        const SQL = `
            SELECT 
              product_id, shop_id, name, description, pictures_path,
              type, promo_count, price, price_piece, quantity, preorder
            FROM products
            ORDER BY product_id;
        `;

        db.query(SQL, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// 3. ฟังก์ชันดึงข้อมูลสินค้าด้วยชื่อ
const getProductsByNames = (itemNames) => {
    return new Promise((resolve, reject) => {
        // ดักไว้ก่อน เผื่อไม่มีชื่อสินค้าส่งมา
        if (!itemNames || itemNames.length === 0) {
            return resolve([]);
        }

        // อัปเดต: เปลี่ยน p.shirt_name เป็น name
        const SQL = `
            SELECT 
                product_id, shop_id, name, description, pictures_path,
                type, promo_count, price, price_piece, quantity, preorder
            FROM products
            WHERE name IN (?)
            ORDER BY product_id;
        `;

        db.query(SQL, [itemNames], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

module.exports = {
    getProductsByIds,
    getAllProductsWithDetails,
    getProductsByNames
};