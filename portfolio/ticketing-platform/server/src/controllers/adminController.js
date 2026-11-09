const adminService = require("../services/adminService");
const saveLog = require("../middlewares/admin_logs");
const saveSearchLog = require("../middlewares/save_search_logs");

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
    const agent = req.headers["user-agent"] || "unknown";

    try {
        const { token, adminId } = await adminService.login(username, password, ip, agent);
        
        // บันทึก Log การเข้าสู่ระบบ
        saveLog(adminId, "LOGIN", "เข้าสู่ระบบสำเร็จ", req);
        
        res.status(200).json({ message: "✅ เข้าสู่ระบบสำเร็จ", token });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "เกิดข้อผิดพลาดในระบบ" });
    }
};

const logout = async (req, res) => {
    const token = req.token;
    
    try {
        saveLog(req.admin.id, "LOGOUT", "ออกจากระบบ", req);
        const result = await adminService.logout(token);
        res.json(result);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "เกิดข้อผิดพลาดในการลบ session" });
    }
};

const getSession = (req, res) => {
    // ข้อมูล req.admin ถูกส่งมาจาก middleware (verifyAdmin)
    res.json({
        message: "ยืนยันตัวตนสำเร็จ",
        admin: req.admin,
    });
};

const getLogs = async (req, res) => {
    try {
        const logs = await adminService.getLogs();
        res.json({ logs });
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error });
    }
};

const saveSearchLogHandler = (req, res) => {
    const { keyword } = req.body;
    const adminId = req.admin.id;

    if (!keyword || keyword.trim() === "") {
        return res.status(400).json({ message: "ต้องมีคำค้นหา" });
    }

    saveSearchLog(adminId, keyword, req);
    return res.json({ message: "บันทึกประวัติการค้นหาแล้ว" });
};

const getSearchHistory = async (req, res) => {
    const adminId = req.admin.id;
    try {
        const history = await adminService.getSearchHistory(adminId);
        res.json({ history });
    } catch (error) {
        res.status(500).json({ message: "ดึงข้อมูลไม่สำเร็จ" });
    }
};

module.exports = {
    login,
    logout,
    getSession,
    getLogs,
    saveSearchLogHandler,
    getSearchHistory
};