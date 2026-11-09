import { useState } from 'react';

const useDownloadQR = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);

    const downloadQR = async (qrImage, orderId) => {
        if (!qrImage) return;
        
        setIsDownloading(true);
        setError(null);

        try {

            //แปลงไฟล์รูปภาพ
            const response = await fetch(qrImage);
            const blob = await response.blob();
            const fileName = `QR_Order_${orderId}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            //เช็คอุปกรณ์ ios
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

            //ถ้าเป็น ios ให้บันทึกอีกแบบ
            if (isIOS && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'QR Code ชำระเงิน BuddyCamp',
                });
            } else {
                //ถ้าไม่ใช่ให้ดาวน์โหลดปกติ
                const link = document.createElement('a');
                const blobUrl = window.URL.createObjectURL(blob);
                link.href = blobUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาดในการดาวน์โหลดหรือแชร์:", err);
            setError(err);
        } finally {
            setIsDownloading(false);
        }
    };

    return { downloadQR, isDownloading, error };
};

export default useDownloadQR;