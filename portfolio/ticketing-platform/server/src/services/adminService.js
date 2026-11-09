const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");
const path = require("path");
// ต้องถอยออกไป 2 โฟลเดอร์เพราะอยู่ใน services/
require("dotenv").config({ path: path.join(__dirname, "../../configs/server.env") });

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret";
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || "24h";

// เก็บตัวแปรนับจำนวนครั้งที่เข้าสู่ระบบผิดพลาด
const loginAttempts = {};

const login = async (username, password, ip, agent) => {
    const now = Date.now();
    
    // 1. เช็ค Rate Limit (ล็อคบัญชี)
    if (loginAttempts[username] && loginAttempts[username].lockedUntil > now) {
        const waitSec = Math.ceil((loginAttempts[username].lockedUntil - now) / 1000);
        throw { status: 429, message: `บัญชีนี้ถูกล็อคอยู่ กรุณารอ ${waitSec} วินาที` };
    }

    // 2. ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const result = await adminModel.getAdminByUsername(username);
    if (!result || result.length === 0) {
        throw { status: 401, message: "ชื่อผู้ใช้ไม่ถูกต้อง" };
    }

    const admin = result[0];
    
    // 3. ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        if (!loginAttempts[username]) {
            loginAttempts[username] = { count: 1, lockedUntil: 0 };
        } else {
            loginAttempts[username].count += 1;
        }

        if (loginAttempts[username].count >= 3) {
            loginAttempts[username].lockedUntil = Date.now() + 5 * 60 * 1000;
            loginAttempts[username].count = 0;
            throw { status: 429, message: "พยายามผิดพลาด 3 ครั้ง บัญชีถูกล็อค 5 นาที" };
        }
        throw { status: 401, message: `รหัสผ่านไม่ถูกต้อง (${loginAttempts[username].count}/3)` };
    }

    // เคลียร์ความพยายามที่ผิดพลาด
    if (loginAttempts[username]) delete loginAttempts[username];

    const adminId = admin.id || admin.admin_id || null;
    if (!adminId) {
        throw { status: 500, message: "ไม่สามารถยืนยันตัวตนแอดมินได้" };
    }

    // 4. สร้าง JWT Token
    const token = jwt.sign(
        { id: adminId, username: admin.username, role: "admin" },
        SECRET_KEY,
        { expiresIn: TOKEN_EXPIRE }
    );

    // 5. บันทึก Session ลงฐานข้อมูล
    try {
        await adminModel.createSession(adminId, token, ip, agent);
        console.log(`✅ บันทึก session สำเร็จ (admin_id=${adminId})`);
    } catch (err) {
        console.error("⚠️ ไม่สามารถบันทึก session ได้:", err);
    }

    return { token, adminId };
};

const logout = async (token) => {
    const result = await adminModel.deleteSessionByToken(token);
    if (result.affectedRows === 0) {
        throw { status: 404, message: "Logout เรียบร้อยแล้ว" };
    }
    return { message: "👋 ออกจากระบบสำเร็จ และลบ session ออกจากฐานข้อมูลแล้ว" };
};

const getLogs = async () => {
    return await adminModel.getAdminLogs();
};

const getSearchHistory = async (adminId) => {
    return await adminModel.getSearchLogsByAdminId(adminId);
};

module.exports = {
    login,
    logout,
    getLogs,
    getSearchHistory
};