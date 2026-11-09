import { useState, useEffect } from "react";
import "../styles/views/AdminLogin.css";
import { showAlert } from "../components/ui/Alert";
import { useNavigate } from "react-router-dom";
import { selectServer } from "../utils/Server";
import { User, Lock, ShieldCheck, LogIn, LoaderCircle } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const res = await fetch(`${selectServer()}/api/admin/session`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          await showAlert("ยินดีต้อนรับกลับมา");
          navigate("/admin-dashboard");
        } else {
          console.warn("⚠️ Session หมดอายุ:", data.message);
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUsername");
        }
      } catch (err) {
        console.error("❌ ตรวจสอบ session ล้มเหลว:", err);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      await showAlert("⚠️ กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบ");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${selectServer()}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        localStorage.setItem("adminUsername", username);

        await showAlert(`ยินดีต้อนรับ ${username}`);
        navigate("/admin-dashboard");
      } else {
        await showAlert(`❌ ${data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}`);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      await showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-container">
      {/* เอฟเฟกต์แสงพื้นหลัง */}
      <div className="al-glow al-glow-blue"></div>
      <div className="al-glow al-glow-gold"></div>

      <div className="al-box">
        <div className="al-header">
          <div className="al-icon-wrap">
            <ShieldCheck size={36} className="al-shield-icon" />
          </div>
          <h2>Admin Panel</h2>
          <p>เข้าสู่ระบบเพื่อจัดการระบบหลังบ้าน</p>
        </div>

        <form onSubmit={handleLogin} className="al-form">
          <div className="al-input-group">
            <User size={20} className="al-input-icon" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ชื่อผู้ใช้งาน (เช่น 67100000)"
              disabled={loading}
            />
          </div>

          <div className="al-input-group">
            <Lock size={20} className="al-input-icon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน"
              disabled={loading}
            />
          </div>

          <button type="submit" className="al-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={20} className="al-spin" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>
                <LogIn size={20} />
                เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>

        <footer className="al-copyright">
          <p>© {new Date().getFullYear()} Thasala Admin Panel. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLogin;