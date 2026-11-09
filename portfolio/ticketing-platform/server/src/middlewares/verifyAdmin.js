const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../configs/server.env"), });
const jwt = require("jsonwebtoken");
const db = require("./db_connection");

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret";
const SESSION_EXPIRE_MS = 24 * 60 * 60 * 1000;

const verifySessionToken = (token, callback) => {
    const sql = "SELECT * FROM admin_sessions WHERE token = ? AND is_active = TRUE";
    db.query(sql, [token], (err, result) => {
        if (err) return callback(err, null);
        if (result.length === 0) return callback(null, false);

        const session = result[0];
        const createdAt = new Date(session.created_at);
        const now = new Date();

        if (now - createdAt > SESSION_EXPIRE_MS) {
            const deleteSql = "DELETE FROM admin_sessions WHERE token = ?";
            db.query(deleteSql, [token], () => { });
            return callback(null, false);
        }

        callback(null, true);
    });
};

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "ไม่มี Token" });
    }

    const token = authHeader.split(" ")[1];
    req.token = token;

    // 2. ตรวจสอบความถูกต้องของ JWT อย่างเดียว (ปิดการเช็ค DB ไว้ก่อน)
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("❌ JWT Verify Error:", err.message);
            return res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
        }

        // ถ้ากุญแจถูก ให้ผ่านเข้า Dashboard ได้เลย!
        req.admin = decoded;
        next();
    });
};

module.exports = verifyAdmin;
