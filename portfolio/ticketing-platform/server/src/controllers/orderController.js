const orderService = require("../services/orderService");
const saveLog = require("../middlewares/admin_logs");

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. โยนให้ Service จัดการลบออเดอร์
        const result = await orderService.removeOrder(id);

        // 2. เมื่อลบสำเร็จแล้ว ค่อยบันทึก Log
        try {
            const adminId = req.admin?.id || req.admin?.admin_id || 0;
            saveLog(
                adminId,
                "DELETE_ORDER",
                `ลบออเดอร์หมายเลข #${id}`,
                req
            );
        } catch (logErr) {
            console.error("⚠️ บันทึก Log ไม่สำเร็จ:", logErr);
        }

        // 3. ตอบกลับ Frontend
        res.status(200).json({
            message: "🗑️ ลบออเดอร์สำเร็จ",
            order_id: result.order_id,
        });

    } catch (error) {
        // จัดการ Error ที่โยนมาจาก Service (มีระบุ status ชัดเจน)
        console.error("❌ Delete Order Error:", error.details || error.message);
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "เกิดข้อผิดพลาดในการตรวจสอบออเดอร์" });
    }
};

const cancelOrderByUser = async (req, res) => {
    const { orderId } = req.params;

    try {
        // เรียกใช้ Service
        const result = await orderService.cancelOrder(orderId);
        
        // ถ้าสำเร็จ ให้ตอบกลับ 200
        res.status(200).json(result);

    } catch (error) {
        // ถ้ามี Error โยนมาจาก Service จะมาเข้าที่บล็อกนี้
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const value = req.params.phone;
        
        if (!value) {
            return res.status(400).json({ error: "⚠️ กรุณาระบุข้อมูลที่ต้องการค้นหา" });
        }

        const result = await orderService.fetchUserOrders(value);
        
        res.status(200).json({
            message: "✅ ดึงข้อมูลคำสั่งซื้อสำเร็จ",
            count: result.count,
            data: result.data,
        });
    } catch (error) {
        console.error("❌ getUserOrders Error:", error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
};

const getOrderTicketByID = async (req, res) => {
    try {
        const value = req.params.id;
        
        if (!value) {
            return res.status(400).json({ error: "⚠️ กรุณาระบุข้อมูลที่ต้องการค้นหา" });
        }

        const result = await orderService.fetchOrderTicket(value);
        
        res.status(200).json({
            message: "✅ ดึงข้อมูลคำสั่งซื้อสำเร็จ",
            count: result.length, 
            data: result, 
        });
    } catch (error) {
        // 🌟 3. แก้ไขข้อความ Log ให้ตรงกับชื่อฟังก์ชัน จะได้ไม่งงตอน Debug
        console.error("❌ getOrderTicketByID Error:", error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
};

const getAdminOrders = async (req, res) => {
    try {
        const { page, search, shop_id } = req.query;
        const result = await orderService.fetchAdminOrders(page, search, shop_id);
        
        res.status(200).json({
            message: "✅ ดึงข้อมูลออเดอร์สำเร็จ",
            ...result
        });
    } catch (error) {
        console.error("❌ getAdminOrders Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์" });
    }
};

const getSummary = async (req, res) => {
    try {
        const shopId = req.query.shop_id || null;
        const result = await orderService.fetchOrderSummary(shopId);
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ getSummary Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงสรุปยอด" });
    }
};

const calculateOrderShipping = async (req, res) => {
    try {
        const { items } = req.body;
        
        // เรียกใช้ Service
        const result = await orderService.calculateShipping(items);
        
        // ตอบกลับ
        res.status(200).json(result);
        
    } catch (error) {
        console.error("❌ Calculate Shipping Error:", error);
        const status = error.status || 500;
        res.status(status).json({ 
            message: error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" 
        });
    }
};

// controllers/orderController.js

const createNewOrder = async (req, res) => {
    try {
        const { shop_id, first_name, last_name, city, phone, total_price, items } = req.body;
        
        // กำหนดเป็น null อย่างชัดเจนสำหรับ Step 1
        const slip_path = null; 

        // ตรวจสอบข้อมูลอื่นๆ ยกเว้นสลิป
        if (!first_name || !last_name || !phone || !total_price || !city) {
            return res.status(400).json({ error: "❌ โปรดกรอกข้อมูลผู้สั่งจองให้ครบถ้วน" });
        }

        const cityRole = city || "";
        
        const orderData = { shop_id, first_name, last_name, cityRole, phone, total_price, items, slip_path };
        const result = await orderService.processNewOrder(orderData);

        res.status(201).json({
            message: "✅ บันทึกข้อมูลสำเร็จ!",
            order_id: result.order_id,
        });
    } catch (error) {
        console.error("❌ Create Order Error:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบฐานข้อมูล" });
    }
};

const updateOrder = async (req, res) => {
    const { id } = req.params;

    try {
        await orderService.modifyOrder(id, req.body);

        saveLog(
            req.admin.id,
            "UPDATE_ORDER",
            `แก้ไขข้อมูลออเดอร์หมายเลข ${id} พร้อมสินค้าใหม่`,
            req
        );

        // 3. ตอบกลับ
        res.status(200).json({ message: "✅ อัปเดตออเดอร์สำเร็จ" });

    } catch (error) {
        console.error("❌ Update Order Error:", error);
        const status = error.status || 500;
        res.status(status).json({ 
            message: error.message || "❌ อัปเดตข้อมูลออเดอร์ไม่สำเร็จ" 
        });
    }
};

// เพิ่มฟังก์ชันอัปเดตสถานะ
const updateStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body; 

    try {
        // โยนให้ Service เช็คเงื่อนไขและอัปเดต
        const result = await orderService.changeOrderStatus(order_id, status);

        // 🌟 ป้องกัน Backend พังด้วย Try-Catch เผื่อระบบ Log มีปัญหา
        try {
            const adminId = req.admin?.id || req.admin?.admin_id || 0; 
            const logText = `อัปเดตออเดอร์ #${order_id} → สถานะ: ${result.statusText}`;
            saveLog(adminId, "UPDATE_ORDER_STATUS", logText, req);
        } catch (logErr) {
            console.error("⚠️ บันทึก Log ไม่สำเร็จ แต่สถานะออเดอร์อัปเดตแล้ว:", logErr);
        }

        // ตอบกลับหน้าบ้าน
        res.status(200).json({
            message: `อัปเดตสถานะออเดอร์เป็น "${result.statusText}" สำเร็จ`,
            success: true,
            current_status: result.statusCode
        });

    } catch (error) {
        console.error("❌ อัปเดตสถานะล้มเหลว:", error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({ 
            message: error.message || "ไม่สามารถอัปเดตสถานะในระบบได้" 
        });
    }
};

module.exports = {
    deleteOrder,
    getUserOrders,
    getAdminOrders,
    getSummary,
    calculateOrderShipping,
    createNewOrder,
    updateOrder,
    updateStatus,
    getOrderTicketByID,
    cancelOrderByUser
};