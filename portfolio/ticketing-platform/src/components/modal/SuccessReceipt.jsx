import React, { useEffect, useState } from "react";
import { Check, Ticket, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { showAlert, showLoading, hideLoading } from "../ui/Alert";
import useDownloadReceipt from "../../hooks/useDownloadReceipt";
import { selectServer, selectServerPath } from "../../utils/Server";
import useCheckoutPersist from "../../hooks/useCheckoutPersist";

import "../../styles/modal/SuccessReceipt.css";

const SuccessReceipt = ({ formData, orderId, shippingSummary, totalPrice }) => {
    const [ticket, setTicket] = useState();
    
    // 🌟 ดึงข้อมูลจาก Hook useCheckoutPersist
    const { checkoutData } = useCheckoutPersist();

    const [customer, setCustomer] = useState({
        firstName: formData?.firstName || checkoutData.formData.firstName || "ไม่ระบุ",
        lastName: formData?.lastName || checkoutData.formData.lastName || "",
        phone: formData?.phone || checkoutData.formData.phone || "-",
        // 🌟 ถ้ารีเฟรชแล้ว Props หายเกลี้ยง ให้ดึงยอดจาก Hook ที่เราฝังไว้มาโชว์แทน!
        amount: shippingSummary?.grandTotal || totalPrice || checkoutData.totalAmount || 0
    });

    const qrUrl = `${selectServerPath()}/package?search=${ticket || orderId}`;
    const { downloadReceipt, isDownloading } = useDownloadReceipt();

    const handleDownloadImage = async () => {
        showLoading("กำลังเตรียมรูปภาพใบเสร็จ...");
        const result = await downloadReceipt(`receipt-card-${orderId}`, orderId, ".sr-warning-section");
        hideLoading();

        if (!result.success) {
            await showAlert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ หรือยกเลิกการแชร์");
        }
    };

    // 🌟 ดึงข้อมูลรหัสตั๋วแบบคลีนๆ แค่เส้นเดียว
    useEffect(() => {
        const fetchTicketData = async () => {
            if (!orderId) return;
            try {
                const res = await fetch(`${selectServer()}/api/get-ticket/${orderId}`);
                const data = await res.json();

                if (res.ok && data.data && data.data.length > 0) {
                    setTicket(data.data[0].ticket_code);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            }
        };

        fetchTicketData();
    }, [orderId]);

    return (
        <div className="wizard-container">
            <div className="receipt-container sr-relative" id={`receipt-card-${orderId}`}>

                <div className="sr-qr-top-right">
                    <QRCodeSVG value={qrUrl} size={70} bgColor={"#ffffff"} fgColor={"#0f172a"} level={"M"} />
                </div>

                <div className="success-checkmark">
                    <Check size={32} strokeWidth={3} />
                </div>

                <div className="receipt-header">
                    <h2>ส่งรายการสำเร็จ</h2>
                    <p className="sr-date-text">
                        วันที่ {new Date().toLocaleDateString('th-TH')} เวลา {new Date().toLocaleTimeString('th-TH')}
                    </p>
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-details">
                    <div className="receipt-row">
                        <span>หมายเลขบัตร / ออเดอร์</span>
                        <strong>#{orderId}</strong>
                    </div>
                    <div className="receipt-row">
                        <span>ชื่อลูกค้า</span>
                        <span className="receipt-name">{customer.firstName} {customer.lastName}</span>
                    </div>
                    <div className="receipt-row">
                        <span>เบอร์โทร</span>
                        <strong>{customer.phone}</strong>
                    </div>
                    <div className="receipt-row">
                        <span>สถานะ</span>
                        <strong className="sr-status-success">รอตรวจสอบการชำระ</strong>
                    </div>
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-row total">
                    <span>ยอดชำระสุทธิ</span>
                    {/* 🌟 ยอดเงินจะไม่มีทางแหว่งเป็น 0 อีกต่อไป! */}
                    <span>฿{customer.amount ? customer.amount.toLocaleString() : "0"}</span>
                </div>

                <div className="sr-warning-section">
                    <p className="sr-warning-text">
                        โปรดบันทึกภาพหน้าจอนี้ไว้เป็นหลักฐานการสั่งจอง
                        <br />
                        <span style={{ fontSize: '0.85rem', color: '#fbbf24', display: 'block', marginTop: '8px' }}>
                            (หากข้อมูลหน้าใบเสร็จไม่แสดงผล กรุณากดปุ่ม "ตรวจสอบบัตร" ด้านล่างเพื่อดูรายการของท่าน)
                        </span>
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <button
                            type="button"
                            className="btn-confirm-order sr-btn-download"
                            onClick={handleDownloadImage}
                            disabled={isDownloading}
                        >
                            <Download size={18} /> {isDownloading ? "กำลังบันทึก..." : "บันทึกรูปภาพใบเสร็จ"}
                        </button>

                        <button
                            type="button"
                            className="btn-confirm-order sr-btn-home"
                            onClick={() => {
                                // ล้างประวัติเพื่อให้ไปสั่งซื้อใหม่ได้คลีนๆ
                                localStorage.removeItem("buddy_checkout_session");
                                localStorage.removeItem("checkoutStep");
                                localStorage.removeItem("pendingOrderId");
                                window.location.href = "/package";
                            }}
                            disabled={isDownloading}
                        >
                            <Ticket size={18} /> ตรวจสอบบัตร
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SuccessReceipt;