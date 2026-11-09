import { useState, useEffect } from "react";
import "./css/UserLogin.css";
import { showAlert } from "../scripts/Alert";
import { useNavigate } from "react-router-dom";
import { getStoredUser, clearUserData } from "../scripts/UserData";
import useAdminCheck from "../hooks/useAdminCheck";

const UserLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const storedUser = getStoredUser();
            const token = storedUser?.token; 
            if (!token) return;

            try {
                const res = await fetch(`http://localhost:3000/api/user-session`, { 
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (res.ok) {
                    const user = data.user; 
                    const nameToGreet = storedUser?.fullName || user?.username || ''; 
                    
                    await showAlert(`ยินดีต้อนรับกลับมา ${nameToGreet}`);
                    navigate("/admin-dashboard");
                } else {
                    console.warn("⚠️ Session หมดอายุ:", data.message);
                    clearUserData(); 
                }
            } catch (err) {
                console.error("❌ ตรวจสอบ session ล้มเหลว:", err);
                clearUserData();
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
            const res = await fetch(`http://localhost:3000/api/user-login`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (res.ok) {
                clearUserData();

                const userObject = {
                    userId: data.userId,
                    username: username.trim(),
                    fullName: data.name, 
                    major: data.major,
                    token: data.token,
                    profile_path: data.profile_path,
                    profile_name: data.profile_name,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem("userData", JSON.stringify(userObject)); 
                const { isAdmin } = useAdminCheck();
                if (!isAdmin) return;

                await showAlert(`ยินดีต้อนรับ ${data.name || username}`);
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
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>เข้าสู่ระบบ</h2>
                <form onSubmit={handleLogin}>
                    <label>ชื่อผู้ใช้</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="67100000"
                    />

                    <label>รหัสผ่าน</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "⏳ กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>
                </form>

                <div className="admin-reset">
                    <p onClick={() => navigate("/reset-password")}>
                        เปลี่ยนรหัสผ่าน
                    </p>
                </div>

                <footer className="login-footer">
                    <p style={{color: "red", marginBottom: 10}}>หากท่านเข้าใช้งานครั้งแรกรหัสผ่านจะถูกตั้งค่า 4 ตัวสุดท้ายของเลขบัตรประชาชน</p>
                    <p>© {new Date().getFullYear()} WUSAB Support</p>
                </footer>
            </div>
        </div>
    );
};

export default UserLogin;