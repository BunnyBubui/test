const ExcelJS = require("exceljs");
const path = require("path");

// 🌟 แมปปิ้งสถานะให้เป็นภาษาไทย
const STATUS_MAP = {
    0: "รอการชำระ",
    1: "รอตรวจสอบการชำระ",
    2: "ชำระเสร็จสิ้น",
};

// ฟังก์ชันสำหรับแปลงวันที่
const formatDate = (d) => {
    const date = new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

// ==========================================
// 🌟 Utility Function สำหรับสร้าง Excel จาก Data
// ==========================================
const generateOrdersExcel = async (data, targetFolder = null) => {
    if (!data || data.length === 0) {
        throw new Error("ไม่มีข้อมูลให้ export");
    }

    const workbook = new ExcelJS.Workbook();
    
    // ค้นหาแพ็กเกจบัตรทั้งหมดที่มีคนซื้อ เพื่อไปสร้างคอลัมน์หน้า Summary แบบไดนามิก
    const allProductsSet = new Set();
    data.forEach(row => {
        if (row.product_name) allProductsSet.add(row.product_name);
    });
    const allProducts = Array.from(allProductsSet);
    
    // ==========================================
    // SHEET 1: Orders (ข้อมูลการจองทั้งหมด แจกแจงรายบัตร)
    // ==========================================
    const sheet = workbook.addWorksheet("Orders");

    const mainColumns = [
        { header: "รหัสออเดอร์", key: "order_id", width: 15 },
        { header: "วันที่สั่งซื้อ", key: "create_at", width: 22 },
        { header: "สถานะ", key: "status", width: 20 },
        { header: "เบอร์โทรอ้างอิง", key: "user_id", width: 15 },
        { header: "ชื่อ-นามสกุล", key: "fullname", width: 25 },
        { header: "จังหวัด", key: "city", width: 20 },
        { header: "ชื่องาน", key: "shop_title", width: 30 },
        { header: "แพ็กเกจบัตร", key: "product_name", width: 25 },
        { header: "รหัสบัตร (Ticket)", key: "ticket_code", width: 20 },
        { header: "ยอดออเดอร์ (บาท)", key: "total_price", width: 18 },
    ];

    sheet.columns = mainColumns;

    // ตกแต่ง Header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

    const summaryMap = new Map();
    let totalRevenue = 0;
    const orderAdded = new Set();

    data.forEach((row) => {
        const isFirst = !orderAdded.has(row.order_id);

        sheet.addRow({
            order_id: row.order_id,
            create_at: new Date(row.create_at).toLocaleString("th-TH"),
            status: STATUS_MAP[row.received] || "ไม่ทราบสถานะ",
            user_id: row.user_id,
            fullname: `${row.first_name} ${row.last_name}`,
            city: row.city || "-",
            shop_title: row.shop_title || "-",
            product_name: row.product_name || "-",
            ticket_code: row.ticket_code || "-",
            total_price: isFirst ? row.total_price : 0, 
        });

        if (isFirst) {
            totalRevenue += Number(row.total_price || 0);
            orderAdded.add(row.order_id);
        }

        const key = row.order_id;
        if (!summaryMap.has(key)) {
            summaryMap.set(key, {
                order_id: row.order_id,
                user_id: row.user_id,
                fullname: `${row.first_name} ${row.last_name}`,
                products: {}
            });
        }

        if (row.product_name) {
            const s = summaryMap.get(key);
            s.products[row.product_name] = (s.products[row.product_name] || 0) + 1;
        }
    });

    sheet.addRow({
        shop_title: "ยอดขายรวมทั้งหมด",
        total_price: totalRevenue,
    }).font = { bold: true, color: { argb: 'FFFF0000' } };


    // ==========================================
    // SHEET 2: Summary (สรุปจำนวนบัตรที่ขายได้)
    // ==========================================
    const summarySheet = workbook.addWorksheet("Summary");

    summarySheet.columns = [
        { header: "รหัสออเดอร์", key: "order_id", width: 15 },
        { header: "ชื่อ-นามสกุล", key: "fullname", width: 25 },
        { header: "เบอร์โทรอ้างอิง", key: "user_id", width: 15 },
        ...allProducts.map(p => ({ header: p, key: p, width: 22 })),
        { header: "รวมจำนวนบัตร", key: "total_tickets", width: 18 }
    ];
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

    const totalProductCount = {};
    allProducts.forEach(p => totalProductCount[p] = 0);
    let grandTotalTickets = 0;

    for (const [, sData] of summaryMap) {
        let orderTotalTickets = 0;
        const rowObj = {
            order_id: sData.order_id,
            fullname: sData.fullname,
            user_id: sData.user_id,
        };
        
        allProducts.forEach(p => {
            const qty = sData.products[p] || 0;
            rowObj[p] = qty;
            totalProductCount[p] += qty;
            orderTotalTickets += qty;
            grandTotalTickets += qty;
        });
        
        rowObj.total_tickets = orderTotalTickets;
        summarySheet.addRow(rowObj);
    }

    summarySheet.addRow([]); 
    
    const totalRow = {
        fullname: "ยอดขายบัตรทั้งหมด",
        total_tickets: grandTotalTickets
    };
    allProducts.forEach(p => totalRow[p] = totalProductCount[p]);
    summarySheet.addRow(totalRow).font = { bold: true, color: { argb: 'FFFF0000' } };


    // ==========================================
    // SHEET 3+: รายวัน (แบ่ง Sheet ตามวันที่)
    // ==========================================
    const dailyMap = new Map();

    data.forEach(row => {
        const day = formatDate(row.create_at);
        if (!dailyMap.has(day)) dailyMap.set(day, []);
        dailyMap.get(day).push(row);
    });

    dailyMap.forEach((rows, day) => {
        const daySheet = workbook.addWorksheet(`${day}`);
        daySheet.columns = mainColumns; 
        daySheet.getRow(1).font = { bold: true };
        daySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

        const addedSet = new Set();
        let dailyRevenue = 0;

        rows.forEach((row) => {
            const isFirst = !addedSet.has(row.order_id);

            daySheet.addRow({
                order_id: row.order_id,
                create_at: new Date(row.create_at).toLocaleString("th-TH"),
                status: STATUS_MAP[row.received] || "ไม่ทราบสถานะ",
                user_id: row.user_id,
                fullname: `${row.first_name} ${row.last_name}`,
                city: row.city || "-",
                shop_title: row.shop_title || "-",
                product_name: row.product_name || "-",
                ticket_code: row.ticket_code || "-",
                total_price: isFirst ? row.total_price : 0,
            });

            if (isFirst) {
                addedSet.add(row.order_id);
                dailyRevenue += Number(row.total_price || 0);
            }
        });

        daySheet.addRow({
            shop_title: "รวมยอดขายรายวัน",
            total_price: dailyRevenue,
        }).font = { bold: true, color: { argb: 'FF0000FF' } };
    });

    // ==========================================
    // คืนค่าไฟล์
    // ==========================================
    if (targetFolder) {
        const filename = `orders_export_${Date.now()}.xlsx`;
        const filePath = path.join(targetFolder, filename);
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    }

    return workbook;
};

module.exports = {
    generateOrdersExcel
};