const exportService = require("../services/exportService");
const saveLog = require("../middlewares/admin_logs");

const exportOrders = async (req, res) => {
    try {
        // 1. สั่งให้ Service สร้างไฟล์ Excel
        const workbook = await exportService.exportOrders();

        // 2. บันทึก Log เมื่อสร้างไฟล์สำเร็จ
        saveLog(
            req.admin.id,
            "EXPORT_ORDERS",
            "แอดมินทำการส่งออกไฟล์รายการออเดอร์ (manual export)",
            req
        );

        // 3. ตั้งค่า Header สำหรับดาวน์โหลดไฟล์ Excel
        res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        // 4. เขียนไฟล์ส่งกลับไปที่ Browser
        await workbook.xlsx.write(res);
        res.end();
        
    } catch (err) {
        // บันทึก Log กรณีเกิด Error
        saveLog(
            req.admin?.id || null,
            "EXPORT_ORDERS_FAILED",
            `Export ล้มเหลว: ${err.message || err}`,
            req
        );

        console.error("❌ Export Error:", err);
        res.status(500).json({ message: "Export error", error: err.message || err });
    }
};

module.exports = {
    exportOrders
};