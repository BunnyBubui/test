const express = require("express");
const router = express.Router();
const db = require("./db_connection");
const bcrypt = require("bcryptjs");
const verifyAdmin = require("./verifyAdmin"); 
const saveLog = require("../middlewares/admin_logs");
const MIN_PASSWORD_LENGTH = 6;

router.put("/change-password", verifyAdmin, async (req, res) => {
  try {
    const adminId = req.admin?.id || req.admin?.sub || null;
    const { username, currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!username || !currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "กรุณาส่ง username รหัสปัจจุบัน รหัสใหม่ และยืนยันรหัสใหม่ให้ครบ" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "รหัสใหม่กับการยืนยันรหัสใหม่ไม่ตรงกัน" });
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร` });
    }

    const sql = "SELECT * FROM admin_users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "ไม่พบผู้ใช้" });
      }

      const user = results[0];
      const storedHash = user.password;

      const match = await bcrypt.compare(currentPassword, storedHash);
      if (!match) {
        return res.status(401).json({ message: "รหัสปัจจุบันไม่ถูกต้อง" });
      }

      const newHash = await bcrypt.hash(newPassword, 10);

      const updateSql = "UPDATE admin_users SET password = ? WHERE username = ?";
      db.query(updateSql, [newHash, username], (err2, result) => {
        if (err2) {
          console.error("DB update error:", err2);
          saveLog(adminId, "CHANGE_PASSWORD", "ไม่สามารถอัปเดตรหัสผ่านได้");
          return res.status(500).json({ message: "ไม่สามารถอัปเดตรหัสผ่านได้" });
        }

        const deactivateSql = "UPDATE admin_sessions SET is_active = FALSE WHERE admin_id = ?";
        db.query(deactivateSql, [user.id || user.admin_id || user.id], (er) => {
          if (er) console.error("Failed to deactivate sessions:", er);

          saveLog(req, "CHANGE_PASSWORD", "เปลี่ยนรหัสผ่านสำเร็จ");
          return res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ โปรดเข้าสู่ระบบใหม่" });
        });
      });
    });
  } catch (e) {
    console.error("Change password error:", e);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
});

module.exports = router;
