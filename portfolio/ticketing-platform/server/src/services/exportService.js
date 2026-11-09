const orderModel = require("../models/orderModel");
const { generateOrdersExcel } = require("../utils/excelExport"); 

async function exportOrders({ targetFolder = null } = {}) {
    try {
        const data = await orderModel.getOrdersForExport();
        if (!data || data.length === 0) {
            throw new Error("ไม่มีข้อมูลให้ export");
        }

        const output = await generateOrdersExcel(data, targetFolder);
        return output;

    } catch (error) {
        throw error; 
    }
}

module.exports = {exportOrders};