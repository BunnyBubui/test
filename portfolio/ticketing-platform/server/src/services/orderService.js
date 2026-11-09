const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const fs = require("fs").promises; 
const fsSync = require("fs");
const path = require("path");

const removeOrder = async (id) => {
    const order = await orderModel.getOrderById(id);
    if (!order || order.length === 0) {
        throw { status: 404, message: "ไม่พบออเดอร์นี้ในระบบ" };
    }

    try {
        await orderModel.deleteOrderItems(id);
        await orderModel.deleteOrderMain(id);
    } catch (err) {
        throw { status: 500, message: "ไม่สามารถลบออเดอร์ได้", details: err };
    }
    return { order_id: id };
};

const cancelOrder = async (orderId) => {
    const results = await orderModel.getOrderStatus(orderId);

    if (results.length === 0) {
        // โยน Error กลับไปให้ Controller จัดการ
        const error = new Error("ไม่พบออเดอร์");
        error.statusCode = 404;
        throw error;
    }

    // 2. เช็คเงื่อนไขว่าจ่ายเงินหรือยัง
    if (results[0].received > 1) {
        const error = new Error("ไม่สามารถยกเลิกได้ เนื่องจากออเดอร์นี้ชำระเงินหรือตรวจสอบสลิปแล้ว");
        error.statusCode = 400;
        throw error;
    }

    // 3. สั่งลบข้อมูล (ต้องลบตารางลูกก่อนเสมอ ตามหลัก Relational Database)
    await orderModel.deleteOrderItems(orderId);
    await orderModel.deleteOrderMain(orderId);

    return { message: "ยกเลิกออเดอร์สำเร็จ" };
};

const STATUS_MAP = {
    0: "กำลังชำระเงิน",
    1: "รอตรวจสอบการชำระ",
    2: "ชำระเสร็จสิ้น",
};

const fetchOrderTicket = async (id) => {
    if (!id) {
        throw { status: 400, message: "ไม่เจอออเดอร์นี้" };
    }

    const items = await orderModel.getOrderItemsByIds(id);
    return items;
};

const fetchUserOrders = async (value) => {
    if (!value) {
        throw { status: 400, message: "⚠️ กรุณาระบุเบอร์โทรศัพท์เพื่อค้นหาคำสั่งซื้อ" };
    }

    const orders = await orderModel.getOrdersByUserValue(value);
    if (!orders || orders.length === 0) {
        throw { status: 404, message: "ไม่พบข้อมูลคำสั่งซื้อ" };
    }

    const orderIds = orders.map((o) => o.order_id);
    const items = await orderModel.getOrderItemsByIds(orderIds);

    const ordersWithItems = orders.map((order) => {
        const orderItems = items
            .filter((i) => i.order_id === order.order_id)
            .map((i) => ({
                item_id: i.id,
                product_id: i.product_id,
                ticket_code: i.ticket_code
            }));

        return { 
            ...order, 
            status_text: STATUS_MAP[order.received] || "ไม่ทราบสถานะ",
            items: orderItems 
        };
    });

    return { count: ordersWithItems.length, data: ordersWithItems };
};

const fetchAdminOrders = async (pageParam, searchParam, shopId) => {
    const page = parseInt(pageParam) || 1;
    const limit = 100;
    const offset = (page - 1) * limit;
    const search = searchParam && searchParam.trim() !== "" ? searchParam.trim() : "";

    const totalCount = await orderModel.countAdminOrders(search, shopId);
    const totalPages = Math.ceil(totalCount / limit);
    const result = await orderModel.getAdminOrders(search, shopId, limit, offset);

    const formattedResult = result.map(order => ({
        ...order,
        items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
        status_text: STATUS_MAP[order.received] || "ไม่ทราบสถานะ"
    }));

    return { data: formattedResult, page, totalPages, totalCount };
};

const fetchOrderSummary = async (shopId) => {
    return await orderModel.getOrderSummary(shopId);
};

const calculateShipping = async (items) => {
    if (!items || items.length === 0) throw { status: 400, message: "ไม่มีสินค้าในตะกร้า" };

    const itemNames = items.map(item => item.name || item.shirt_name);
    if (itemNames.length === 0) throw { status: 400, message: "ข้อมูลสินค้าไม่ถูกต้อง" };

    const dbResults = await productModel.getProductsByNames(itemNames);
    let subtotal = 0, totalQuantity = 0, invalidItem = null;

    for (const item of items) {
        const itemName = item.name || item.shirt_name;
        const dbProductMatch = dbResults.find(dbItem => dbItem.name === itemName);

        if (!dbProductMatch) {
            invalidItem = itemName;
            break; 
        }

        subtotal += (dbProductMatch.price * item.quantity);
        totalQuantity += item.quantity;
    }

    if (invalidItem) throw { status: 400, message: `สินค้า "${invalidItem}" ไม่มีในระบบหรือถูกลบไปแล้ว` };

    return {
        success: true,
        subtotal: subtotal,
        grandTotal: subtotal,
        totalQuantity: totalQuantity,
        message: `ค่าบัตรทั้งหมด ${subtotal} บาท`
    };
};

const generateCode = () => {
    const allowedChars = 'BUDYCAMP0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return result;
};

const processNewOrder = async (orderData) => {
    const { shop_id, first_name, last_name, cityRole, phone, total_price, items, slip_path } = orderData;

    const city = cityRole;
    const order_id = await orderModel.createOrderMain(shop_id, phone, first_name, last_name, city, phone, total_price, slip_path);

    let parsedItems = [];
    try {
        parsedItems = JSON.parse(items || "[]");
    } catch (e) {
        console.warn("⚠️ ไม่สามารถแปลง items JSON ได้:", e);
    }

    if (parsedItems.length > 0) {
        const generateUniqueTicketCode = async () => {
            let newCode;
            let isExist = true;
            do {
                newCode = generateCode();
                isExist = await orderModel.checkTicketCodeExist(newCode); // ถาม DB
            } while (isExist); // ถ้าซ้ำ (true) ให้วนลูปสุ่มใหม่
            
            return newCode;
        };

        // 🌟 3. สร้าง Array ของสินค้าเพื่อเตรียม Insert
        const values = [];
        for (const item of parsedItems) {
            // ต้องใช้ for...of แทน .map() เพื่อให้สามารถใช้ await ภายในลูปได้
            const uniqueCode = await generateUniqueTicketCode();
            values.push([
                order_id,
                item.id,
                uniqueCode
            ]);
        }

        try {
            await orderModel.insertOrderItemsBatch(values);
            console.log("✅ เพิ่มสินค้าพร้อมรหัสตั๋ว 6 หลักสำเร็จแล้ว!");

            for (const item of parsedItems) {
                const totalQty = item.quantity || 1;
                await orderModel.reduceProductStock(totalQty, item.name);
            }
        } catch (errItems) {
            console.error("⚠️ เพิ่มสินค้าใน orders_item ไม่สำเร็จ:", errItems);
        }
    }

    return { order_id, slip_path };
};

const modifyOrder = async (id, orderData) => {
    const { first_name, last_name, phone } = orderData;

    const oldData = await orderModel.getOrderSlipAndShop(id);
    if (!oldData) throw { status: 404, message: "❌ ไม่พบข้อมูลออเดอร์เดิม" };

    await orderModel.updateOrderMain(id, first_name, last_name, phone);
    return true;
};

const changeOrderStatus = async (orderId, status) => {
    if (status === undefined || status === null) throw { status: 400, message: "กรุณาส่งค่าสถานะ (status) มาด้วย" };

    const statusCode = parseInt(status, 10);
    if (![0, 1, 2, 3].includes(statusCode)) throw { status: 400, message: "ค่าที่ส่งมาไม่ถูกต้อง" };

    const result = await orderModel.updateOrderStatus(orderId, statusCode);
    if (result.affectedRows === 0) throw { status: 404, message: "ไม่พบออเดอร์นี้ในระบบ หรือถูกลบไปแล้ว" };

    return { statusCode, statusText: STATUS_MAP[statusCode] };
};

module.exports = {
    fetchOrderTicket, 
    removeOrder, 
    fetchUserOrders, 
    fetchAdminOrders, 
    fetchOrderSummary, 
    calculateShipping, 
    processNewOrder, 
    modifyOrder, 
    changeOrderStatus,
    cancelOrder
};