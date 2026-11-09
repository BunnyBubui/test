import { useEffect, useState, useCallback } from "react";
import { selectServer } from "../utils/Server";
import * as Icons from "lucide-react";
import { showAlert } from "../components/ui/Alert";


const getIcon = (iconName, size = 32) => {
    const IconComponent = Icons[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={size} />;
};

export const useGetData = (path, params = {}, server) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const transformData = useCallback((obj) => {
        // 🌟 1. ดักจับกรณีข้อมูลเป็น String (อาจจะเป็น JSON ที่ถูกแปลงเป็น String มา)
        if (typeof obj === 'string') {
            try {
                // เช็คว่ามันมีโครงสร้างเหมือน JSON ไหม (ขึ้นต้นด้วย { หรือ [ )
                const trimmed = obj.trim();
                if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                    (trimmed.startsWith('[') && trimmed.endsWith(']'))) {

                    // ลองแปลงกลับเป็น Object
                    const parsedObj = JSON.parse(trimmed);
                    // เมื่อแปลงสำเร็จ ให้ส่งกลับเข้าไปทำ Recursive อีกรอบเพื่อหา Icon
                    return transformData(parsedObj);
                }
            } catch (e) {
                // ถ้า Parse ไม่ผ่าน แปลว่าเป็น String ข้อความธรรมดา ก็ปล่อยผ่านไป
            }
            return obj;
        }

        // 🌟 2. ถ้าไม่ใช่ Object (เช่นเป็น Number, Boolean, หรือ String ธรรมดา) ให้คืนค่าเดิมกลับไป
        if (!obj || typeof obj !== 'object') return obj;

        // 🌟 3. ถ้าเป็น Array ให้วนลูปจัดการของข้างในทีละชิ้น
        if (Array.isArray(obj)) {
            return obj.map(item => transformData(item));
        }

        // 🌟 4. ถ้าเป็น Object ให้ตรวจสอบ Key ต่างๆ
        const newObj = { ...obj };
        for (const key in newObj) {
            // ถ้าเจอคีย์ชื่อ 'icon' ให้แปลงเป็น Component
            if (key === 'icon' && typeof newObj[key] === 'string') {
                newObj[key] = getIcon(newObj[key]);
            } else {
                // ถ้าเป็นคีย์อื่น ให้ส่งไปตรวจสอบข้างในต่อ (Recursive)
                newObj[key] = transformData(newObj[key]);
            }
        }
        return newObj;
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const queryString = new URLSearchParams(params).toString();
                const response = await fetch(`${server || selectServer()}/api/${path}${queryString ? `?${queryString}` : ''}`);

                if (!response.ok) {
                    throw new Error(`เกิดข้อผิดพลาดในการดึงข้อมูล (Status: ${response.status})`);
                }
                
                const text = await response.text();
                let json;
                try {
                    json = JSON.parse(text); 
                } catch (e) {
                    json = text;
                }

                setData(transformData(json));
            } catch (err) { 
                console.log(err)
                const errorMessage = err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ";
               
                setError(errorMessage);
                console.error("🚨 API Fetch Error:", err);
                await showAlert(`ดึงข้อมูลล้มเหลว: ${errorMessage}`);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [path, JSON.stringify(params), transformData]);

    return { data, loading, error };
};