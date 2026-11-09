import { useState } from 'react';
import html2canvas from 'html2canvas';

const useDownloadReceipt = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadReceipt = async (elementId, orderId, hideSelector = ".sr-warning-section") => {
        const cardElement = document.getElementById(elementId);
        if (!cardElement) return { success: false, error: "ไม่พบ HTML Element" };

        setIsDownloading(true);

        try {
            // 1. ซ่อนกล่องปุ่มกดก่อนแคปเจอร์ภาพ
            const actionSection = cardElement.querySelector(hideSelector);
            if (actionSection) actionSection.style.display = "none";

            cardElement.classList.add("print-mode");

            // หน่วงเวลาให้เบราว์เซอร์จัดหน้าให้เสร็จ
            await new Promise((resolve) => setTimeout(resolve, 150));

            // 2. ใช้ html2canvas ถ่ายภาพ
            const canvas = await html2canvas(cardElement, {
                scale: window.devicePixelRatio > 1 ? window.devicePixelRatio * 2 : 3,
                useCORS: true,
                backgroundColor: "#0f172a", // ธีม Dark Mode
                logging: false,
                allowTaint: true
            });

            // 3. ถ่ายเสร็จแล้ว คืนสภาพเดิมให้หน้าเว็บทันที
            cardElement.classList.remove("print-mode");
            if (actionSection) actionSection.style.display = "block";

            // 4. แปลงภาพจาก Canvas เป็น Blob (ไฟล์)
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const fileName = `Receipt_${orderId}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            // 🌟 5. ฟังก์ชันบังคับดาวน์โหลดไฟล์ (Fallback)
            const forceDownload = () => {
                const link = document.createElement("a");
                const blobUrl = window.URL.createObjectURL(blob);
                link.href = blobUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
            };

            // เช็คว่าเป็น iOS หรือไม่
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

            // 🌟 6. จัดการระบบแชร์ (เฉพาะ iOS) และดาวน์โหลด
            if (isIOS && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    // ลองเปิดหน้าต่าง Share ของ iOS
                    await navigator.share({
                        files: [file],
                        title: 'ใบเสร็จรับเงิน BuddyCamp',
                    });
                    return { success: true };
                } catch (shareError) {
                    // ถ้า User ปัดหน้าต่างทิ้ง (ยกเลิก) ให้ข้ามไปเลย ไม่ต้องแจ้งเตือน Error
                    if (shareError.name === 'AbortError' || shareError.message.toLowerCase().includes('abort')) {
                        return { success: true }; 
                    }
                    
                    // แต่ถ้า Share พังเพราะแอปไม่รองรับ (เช่น Chrome ใน iOS) ให้ใช้การดาวน์โหลดปกติแทน
                    console.warn("Share API failed, falling back to download...");
                    forceDownload();
                    return { success: true };
                }
            } else {
                // PC / Android / เบราว์เซอร์ที่ไม่รองรับ Share
                forceDownload();
                return { success: true };
            }

        } catch (error) {
            console.error("Error capturing/sharing image:", error);
            
            // กรณีแคปภาพไม่สำเร็จจริงๆ ต้องคืนสภาพปุ่มให้ผู้ใช้ด้วย
            cardElement.classList.remove("print-mode");
            const actionSection = cardElement.querySelector(hideSelector);
            if (actionSection) actionSection.style.display = "block";

            return { success: false, error };
        } finally {
            setIsDownloading(false);
        }
    };

    return { downloadReceipt, isDownloading };
};

export default useDownloadReceipt;