const db = require("./db_connection");

module.exports = function saveLog(adminIdOrReq, action, detail = "", reqMaybe) {
    let req, adminId;

    if (typeof adminIdOrReq === "object" && adminIdOrReq !== null && !Number.isInteger(adminIdOrReq)) {
        req = adminIdOrReq;
        adminId = req?.admin?.id || null;
    } else {
        adminId = adminIdOrReq || null;
        req = reqMaybe;
    }

    if (!adminId) {
        console.warn("⚠️ saveLog ถูกเรียกโดยไม่มี adminId");
        return;
    }

    const ip =
        req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req?.connection?.remoteAddress ||
        "unknown";

    const agent = req?.headers?.["user-agent"] || "unknown";

    const sql = `
    INSERT INTO admin_logs (admin_id, action, detail, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(sql, [adminId, action, detail, ip, agent], (err) => {
        if (err) console.error("❌ บันทึก Log ไม่สำเร็จ:", err);
        else console.log(`📌 Log บันทึกแล้ว: ${action}`);
    });
};
