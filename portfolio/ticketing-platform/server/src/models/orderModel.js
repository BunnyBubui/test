const db = require("../middlewares/db_connection");

const getOrderStatus = (orderId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT received FROM orders_id WHERE order_id = ?";
        db.query(sql, [orderId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// ตรวจสอบว่ามีออเดอร์หรือไม่
const getOrderById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM orders_id WHERE order_id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// ลบที่อยู่จัดส่ง (เก็บไว้เป็น Dummy Function เผื่อ Service เดิมเรียกใช้ จะได้ไม่ Error)
const deleteOrderAddress = (id) => {
    return new Promise((resolve, reject) => {
        resolve({ message: "Address deletion skipped (table not found)" });
    });
};

// ลบออเดอร์หลัก
const deleteOrderMain = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM orders_id WHERE order_id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const getOrdersForExport = () => {
    return new Promise((resolve, reject) => {
        const sql = `
                SELECT 
                    o.order_id,
                    o.user_id,
                    o.first_name,
                    o.last_name,
                    o.city,
                    o.phone,
                    o.total_price,
                    o.received,
                    o.create_at,
                    s.title AS shop_title,
                    p.name AS product_name,
                    oi.ticket_code
                FROM orders_id o
                LEFT JOIN orders_item oi ON o.order_id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.product_id
                LEFT JOIN shops s ON o.shop_id = s.shop_id
                ORDER BY o.create_at ASC
            `;

        db.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const getOrdersByUserValue = (value) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT
              o.order_id, o.user_id, o.shop_id, o.first_name, o.last_name, 
              o.phone, o.total_price, o.slip_path, o.received, o.create_at,
              s.title AS shop_title, s.start_date, s.end_date,
              p.name, p.price, p.pictures_path
            FROM orders_id o
            LEFT JOIN shops s ON o.shop_id = s.shop_id
            LEFT JOIN orders_item i ON o.order_id = i.order_id
            LEFT JOIN products p ON i.product_id = p.product_id
            WHERE o.phone = ? 
            ORDER BY o.create_at DESC
        `;

        // ส่ง [value] แค่ตัวเดียวให้ตรงกับ ? ตัวเดียวใน SQL
        db.query(sql, [value], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// 1.1 ดึงสินค้าในออเดอร์ (ใช้คู่กับข้อ 1)
const getOrderItemsByIds = (orderIds) => {
    return new Promise((resolve, reject) => {
        if (!orderIds || orderIds.length === 0) return resolve([]);
        const sql = `SELECT * FROM orders_item WHERE order_id IN (?)`;
        db.query(sql, [orderIds], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Helper สร้างเงื่อนไข WHERE สำหรับหน้า Admin
const buildAdminWhereClause = (search, shopId) => {
    // อัปเดตให้ค้นหาจาก card_number ได้ด้วย
    let whereClause = `(o.user_id LIKE ? OR o.first_name LIKE ? OR o.last_name LIKE ? OR o.phone LIKE ? OR o.order_id LIKE ?)`;
    const searchParam = `%${search}%`;
    let params = [searchParam, searchParam, searchParam, searchParam, searchParam];

    if (shopId) {
        whereClause += " AND o.shop_id = ? ";
        params.push(shopId);
    }
    return { whereClause, params };
};

// 2. นับจำนวนออเดอร์ทั้งหมด (สำหรับ Pagination)
const countAdminOrders = (search, shopId) => {
    return new Promise((resolve, reject) => {
        const { whereClause, params } = buildAdminWhereClause(search, shopId);
        const sql = `
            SELECT COUNT(DISTINCT o.order_id) AS total
            FROM orders_id o
            LEFT JOIN shops s ON o.shop_id = s.shop_id
            WHERE ${whereClause}
        `;
        db.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
        });
    });
};

// 3. ดึงข้อมูลออเดอร์ทั้งหมดพร้อม Pagination
const getAdminOrders = (search, shopId, limit, offset) => {
    return new Promise((resolve, reject) => {
        const { whereClause, params } = buildAdminWhereClause(search, shopId);
        const sql = `
            SELECT 
                o.order_id, o.shop_id, o.user_id, o.card_number, o.first_name, o.last_name, 
                o.phone, o.total_price, o.slip_path, o.received, o.create_at,
                s.title AS shop_title,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', i.id,
                        'product_id', i.product_id,
                        'name', p.name,
                        'ticket_code', i.ticket_code
                    )
                ) AS items
            FROM orders_id o
            LEFT JOIN orders_item i ON o.order_id = i.order_id
            LEFT JOIN products p ON i.product_id = p.product_id
            LEFT JOIN shops s ON o.shop_id = s.shop_id
            WHERE ${whereClause}
            GROUP BY o.order_id, s.title
            ORDER BY o.create_at DESC
            LIMIT ? OFFSET ?
        `;
        db.query(sql, [...params, limit, offset], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// 4. สรุปยอด
const getOrderSummary = (shopId) => {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT
              COUNT(*) AS total_orders,
              SUM(CASE WHEN received = 0 THEN 1 ELSE 0 END) AS status_0_pending,
              SUM(CASE WHEN received = 1 THEN 1 ELSE 0 END) AS status_1_waiting,
              SUM(CASE WHEN received = 2 THEN 1 ELSE 0 END) AS status_2_completed,
              SUM(CASE WHEN received = 2 THEN total_price ELSE 0 END) AS status_3_success,
              SUM(CASE WHEN received != 2 THEN total_price ELSE 0 END) AS status_4_not_success,
              SUM(total_price) AS summary_total
            FROM orders_id
            WHERE 1 = 1
        `;
        let params = [];
        if (shopId) {
            sql += " AND shop_id = ? ";
            params.push(shopId);
        }
        db.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        });
    });
};

// orderModel.js

const createOrderMain = (shop_id, user_id, first_name, last_name, city, phone, total_price, slip_path) => {
    return new Promise((resolve, reject) => {
        // ใช้ || null เพื่อป้องกันกรณีค่าส่งมาเป็น undefined ให้กลายเป็น NULL ในฐานข้อมูลแทน
        const finalSlipPath = slip_path || null;

        const sql = `
            INSERT INTO orders_id (shop_id, user_id, first_name, last_name, city, phone, total_price, slip_path)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [shop_id || null, user_id, first_name, last_name, city, phone, total_price, finalSlipPath], (err, result) => {
            if (err) {
                console.error("❌ Database Error:", err.sqlMessage);
                reject(err);
            } else {
                resolve(result.insertId);
            }
        });
    });
};

// ฟังก์ชันสำหรับบันทึกสินค้าย่อย (1 ชิ้น) ลงในออเดอร์
const createOrderSub = (order_id, product_id, ticket_code) => {
    return new Promise((resolve, reject) => {
        // 1. เขียนคำสั่ง SQL ระบุคอลัมน์ให้ชัดเจน
        const sql = `
            INSERT INTO orders_item (order_id, product_id, ticket_code)
            VALUES (?, ?, ?)
        `;

        // 2. ส่ง Array ของข้อมูลให้ตรงกับลำดับของเครื่องหมาย ?
        db.query(sql, [order_id, product_id, ticket_code], (err, result) => {
            if (err) {
                reject(err); // ถ้ามี Error ให้โยนออกไป
            } else {
                resolve(result.insertId); // ถ้าสำเร็จ ให้ส่ง ID ของแถวที่เพิ่งสร้างกลับไป
            }
        });
    });
};

const checkTicketCodeExist = (code) => {
    return new Promise((resolve, reject) => {
        // ใช้ SELECT 1 และ LIMIT 1 เพื่อให้ Database ทำงานเร็วที่สุด
        const sql = `SELECT 1 FROM orders_item WHERE ticket_code = ? LIMIT 1`;
        db.query(sql, [code], (err, results) => {
            if (err) reject(err);
            else {
                // ถ้า results.length > 0 แปลว่า "ซ้ำ" (มีคนใช้รหัสนี้แล้ว)
                resolve(results.length > 0);
            }
        });
    });
};

// 2. บันทึกที่อยู่จัดส่ง (เก็บไว้เป็น Dummy)
const createOrderAddress = (order_id, address, city, state, postcode) => {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
};

// 3. บันทึกสินค้าในตะกร้า 
const createOrderItems = (values) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO orders_item (order_id, product_id, ticket_code) VALUES ?`;
        db.query(sql, [values], (err, result) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
};

// 4. ลดสต็อกสินค้า
const reduceProductStock = (quantity, name) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE products 
            SET quantity = quantity - ?
            WHERE name = ? AND preorder = 0
        `;
        db.query(sql, [quantity, name], (err, result) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
};

const getOrderSlipAndShop = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT slip_path, shop_id FROM orders_id WHERE order_id = ?`;
        db.query(sql, [id], (err, rows) => {
            if (err) reject(err);
            else resolve(rows[0] || null);
        });
    });
};

// อัปเดตให้แก้ไข card_number ได้
const updateOrderMain = (id, first_name, last_name, phone) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE orders_id SET first_name = ?, last_name = ?, phone = ? WHERE order_id = ?`;
        db.query(sql, [first_name, last_name, phone, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const deleteOrderItems = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM orders_item WHERE order_id = ?`;
        db.query(sql, [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Batch Insert
const insertOrderItemsBatch = (values) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO orders_item (order_id, product_id, ticket_code) VALUES ?`;
        db.query(sql, [values], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const updateOrderSlipPath = (id, newPath) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE orders_id SET slip_path = ? WHERE order_id = ?`;
        db.query(sql, [newPath, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// เพิ่มฟังก์ชันอัปเดตสถานะออเดอร์
const updateOrderStatus = (orderId, statusCode) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE orders_id SET received = ? WHERE order_id = ?";
        db.query(sql, [statusCode, orderId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = {
    getOrderById,
    deleteOrderAddress,
    deleteOrderMain,
    getOrdersForExport,
    getOrdersByUserValue,
    getOrderItemsByIds,
    countAdminOrders,
    getAdminOrders,
    getOrderSummary,
    createOrderMain,
    createOrderAddress,
    createOrderItems,
    reduceProductStock,
    getOrderSlipAndShop,
    updateOrderMain,
    deleteOrderItems,
    insertOrderItemsBatch,
    updateOrderSlipPath,
    updateOrderStatus,
    createOrderSub,
    checkTicketCodeExist,
    getOrderStatus
};