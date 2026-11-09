import { useState } from "react";
import "../styles/views/AdminLogin.css";
import { showAlert } from "../components/ui/Alert";
import { selectServer } from "../utils/Server";

const AdminChangePassword = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!username.trim() || !currentPassword.trim()) {
      await showAlert("⚠️ กรุณากรอกชื่อผู้ใช้และรหัสผ่านปัจจุบัน");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${selectServer()}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: currentPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("tempAdminToken", data.token);
        await showAlert("✅ ยืนยันตัวตนสำเร็จ กรุณากรอกรหัสใหม่");
        setStep(2);
      } else {
        await showAlert(`❌ ${data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}`);
      }
    } catch (error) {
      console.error("Verify error:", error);
      await showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      await showAlert("⚠️ กรุณากรอกรหัสใหม่ให้ครบ");
      return;
    }

    if (newPassword !== confirmPassword) {
      await showAlert("❌ รหัสใหม่ไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("tempAdminToken");

      const res = await fetch(`${selectServer()}/api/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await showAlert("✅ เปลี่ยนรหัสผ่านสำเร็จ! โปรดเข้าสู่ระบบใหม่");
        localStorage.removeItem("tempAdminToken");
        window.location.href = "/admin-login";
      } else {
        await showAlert(`❌ ${data.message || "เปลี่ยนรหัสไม่สำเร็จ"}`);
      }
    } catch (error) {
      console.error("Change password error:", error);
      await showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        {step === 1 ? (
          <>
            <h2>🔐 ยืนยันตัวตนก่อนเปลี่ยนรหัส</h2>
            <form onSubmit={handleVerify}>
              <label>ชื่อผู้ใช้</label>
              <input
                type="text"
                placeholder="67100000"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label>รหัสผ่านปัจจุบัน</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "⏳ กำลังตรวจสอบ..." : "ตรวจสอบ"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>🔑 เปลี่ยนรหัสผ่านใหม่</h2>
            <form onSubmit={handleChangePassword}>
              <label>รหัสผ่านใหม่</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label>ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "⏳ กำลังเปลี่ยนรหัส..." : "ยืนยันการเปลี่ยนรหัส"}
              </button>
            </form>
          </>
        )}

        <footer className="login-footer">
          <p>
            <a href="/admin-login">⬅ กลับไปหน้าล็อกอิน</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminChangePassword;
