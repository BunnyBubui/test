import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { selectServer } from "../utils/Server";
import { showAlert } from "../scripts/Alert";
import { useNavigate } from "react-router-dom";

/**
 * Custom Hook สำหรับจัดการ WebSocket Connection และ Real-time Events
 * @param {string} token - JWT Token ของผู้ใช้ปัจจุบัน
 * @param {number} userId - ID ผู้ใช้ (user_id) สำหรับการเข้าร่วม Room
 * @param {function} onConnect - Callback เมื่อเชื่อมต่อ Socket สำเร็จ
 */
const useWebSocket = (token, userId, onConnect) => {
    const socketRef = useRef(null);
    const navigate = useNavigate();

    const onConnectRef = useRef(onConnect);
    onConnectRef.current = onConnect;

    const forceLogout = async (message) => {
        console.warn("Session terminated by server.");
        await showAlert(message || "⏳ เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        
        localStorage.clear();
        
        navigate("/");
    };

    useEffect(() => {
        if (!token || !userId) return; 

        const serverUrl = selectServer();
        const socket = io(serverUrl, {
            auth: { token: token },
            query: { token: token },
            reconnection: true,           
            reconnectionAttempts: 5,      
            reconnectionDelay: 1000,     
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log(`[Socket] Connected: ${socket.id}`);
            if (onConnectRef.current) onConnectRef.current(socket); 
        });

        socket.on('disconnect', (reason) => {
            console.log(`[Socket] Disconnected: ${reason}`);
        });

        socket.on('connect_error', async (err) => {
            console.error(`[Socket] Connection Error: ${err.message}`);
        });

        socket.io.on("reconnect_failed", async () => {
             await showAlert("❌ เซิร์ฟเวอร์ไม่ตอบสนอง กรุณารีเฟรชหน้าจอ");
        });

        socket.on('force_logout_notification', (data) => {
            console.log(`[Socket] Force Logout: ${data.message}`);
            forceLogout(data.message);
        });

        const legacyLogoutEvent = `user:${userId}:logout`;
        socket.on(legacyLogoutEvent, (data) => {
            console.log(`[Socket] Legacy Logout: ${data.message}`);
            forceLogout(data.message);
        });

        socket.on('admin_alert', (data) => {
            console.log(`[Socket] Admin Alert: ${data.message}`);
            showAlert(data.message);
        });

        return () => {
            socket.off('force_logout_notification');
            socket.off(legacyLogoutEvent);
            socket.off('admin_alert');
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            
            socket.disconnect();
            socketRef.current = null;
            console.log('Socket cleanup complete.');
        };

    }, [token, userId, navigate]);

    return {
        socket: socketRef.current,
        send: (eventName, data) => {
            if (socketRef.current && socketRef.current.connected) {
                socketRef.current.emit(eventName, data);
            }
        }
    };
};

export default useWebSocket;