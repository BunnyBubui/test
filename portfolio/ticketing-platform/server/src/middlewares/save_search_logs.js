const db = require("./db_connection");

module.exports = function saveSearchLog(adminId, keyword) {
    if (!adminId) {
        console.warn("⚠️ saveSearchLog: adminId หาย");
        return;
    }

    const sql = `
        INSERT INTO admin_search_logs (admin_id, keyword)
        VALUES (?, ?)
    `;

    db.query(sql, [adminId, keyword], (err) => {
        if (err) console.error("❌ บันทึกประวัติการค้นหาไม่สำเร็จ:", err);
        else console.log(`✅ บันทึกการค้นหา: ${keyword}`);
    });
};
