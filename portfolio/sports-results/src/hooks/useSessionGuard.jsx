import { useEffect } from "react";
import { selectServer } from "../utils/Server";
import { showAlert } from "../scripts/Alert";
import { useNavigate, useLocation } from "react-router-dom"; 
import { getStoredUser } from "../scripts/UserData";

export default function useSessionGuard() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const user = getStoredUser();
    const token = user?.token;

    const checkSession = async () => {
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:3000/api/user-session`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.clear();
                await showAlert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
                navigate("/");
                return;
            }

            if (res.status >= 500) {
                 console.warn("Server responded with error 500+");
            }

        } catch (err) {
            console.error("Session check failed (Network error):", err);
            
            const shouldReload = await showAlert(
                "❌ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้\nกรุณาตรวจสอบอินเทอร์เน็ตของท่าน", 
                { 
                    confirm: true, 
                    confirmText: "รีเฟรชหน้าจอ", 
                    cancelText: "ปิด" 
                }
            );

            if (shouldReload) {
                window.location.reload();
            }
        }
    };

    useEffect(() => {
        checkSession();

        const onFocus = () => checkSession();
        window.addEventListener("focus", onFocus);

        return () => window.removeEventListener("focus", onFocus);
    }, []);

    useEffect(() => {
        checkSession();
    }, [location.pathname]);
}