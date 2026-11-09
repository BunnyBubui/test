// ไฟล์: src/utils/Clipboard.js

export const copyToClipboard = async (text) => {
    try {
        // 1. ลองใช้ Modern API ก่อน (ทำงานได้ดีบนคอมพิวเตอร์ และเว็บที่เป็น HTTPS)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // โยน Error เพื่อให้กระโดดไปใช้วิธีสำรองด้านล่าง
            throw new Error("Clipboard API ไม่พร้อมใช้งาน หรือไม่ได้ใช้ HTTPS");
        }
    } catch (error) {
        // 2. ท่าไม้ตาย (Fallback) สำหรับมือถือ หรือเบราว์เซอร์ในแอป (LINE, Facebook)
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // ซ่อนกล่องข้อความให้ออกไปนอกจอ เพื่อไม่ให้หน้าเว็บกระตุก
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            // ใช้คำสั่งคัดลอกแบบคลาสสิก
            document.execCommand('copy');
            textArea.remove();
            return true;
        } catch (err) {
            console.error("ไม่สามารถคัดลอกได้:", err);
            textArea.remove();
            return false;
        }
    }
};