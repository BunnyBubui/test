import React, { useState } from "react";
import { Download, Search, Copy, Check, Receipt, Upload, AlertCircle } from "lucide-react";
import OrderStepper from "../status/OrderStepper";
import { selectServer, selectServerPath } from "../../utils/Server";
import { QRCodeSVG } from "qrcode.react";

// 🌟 1. นำเข้า Alert เพื่อใช้แสดงข้อความและ Loading ตอนอัปโหลด
import { showAlert, showLoading, hideLoading } from "../ui/Alert"; 

import "../../styles/section/OrderCard.css";

const OrderCard = ({ order, index, onDownloadImage }) => {
    const [copied, setCopied] = useState(false);
    const [slipFile, setSlipFile] = useState(null);
    const [slipError, setSlipError] = useState("");

    const firstTicketCode = order.items && order.items.length > 0 ? order.items[0].ticket_code : order.order_id;
    const qrUrl = `${selectServerPath()}/package?search=${firstTicketCode}`;

    const bankDetails = {
        bankName: "พร้อมเพย์",
        accountNo: "0934459287", 
        accountName: "พัชรพล แดงสีดา" 
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(bankDetails.accountNo);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = bankDetails.accountNo;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSlipChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setSlipError("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
                return;
            }
            setSlipFile(file);
            setSlipError("");
        }
    };

    // 🌟 2. เพิ่มฟังก์ชันส่งสลิปไปที่ Backend (เหมือน PaymentStep)
    const handleSubmitSlip = async () => {
        if (!slipFile) {
            await showAlert("กรุณาแนบรูปภาพสลิปเพื่อยืนยัน");
            return;
        }

        try {
            showLoading("กำลังส่งสลิปชำระเงิน...");

            // สร้างก้อนข้อมูลสำหรับส่งไฟล์ภาพ
            const formSlip = new FormData();
            formSlip.append("orderId", order.order_id);
            formSlip.append("slip", slipFile);

            // ยิง API ไปที่เซิร์ฟเวอร์
            const res = await fetch(`${selectServer()}/api/verify-slip`, {
                method: "POST",
                body: formSlip
            });

            const data = await res.json();
            hideLoading();

            if (res.ok) {
                await showAlert("✅ ระบบได้รับสลิปของคุณแล้ว");
                // เมื่อส่งสำเร็จ ให้รีเฟรชหน้า 1 ครั้ง เพื่อให้การ์ดเปลี่ยนสถานะเป็น "รอตรวจสอบ"
                window.location.reload(); 
            } else {
                await showAlert(`❌ ส่งสลิปไม่สำเร็จ: ${data.error || data.message || "เกิดข้อผิดพลาด"}`);
            }
        } catch (error) {
            console.error("❌ Submit Slip Error:", error);
            hideLoading();
            await showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };

    return (
        <article
            className="pa-card"
            id={`order-card-${order.order_id}`}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* ── HEADER ── */}
            <div className="pa-card-header">
                <span className="pa-date">
                    วันที่ {new Date(order.create_at).toLocaleDateString('th-TH')} เวลา {new Date(order.create_at).toLocaleTimeString('th-TH')}
                </span>
                <div className="pa-card-group">
                    <div className="pa-qr-container">
                        <QRCodeSVG
                            value={qrUrl}
                            size={50}
                            bgColor={"#ffffff"}
                            fgColor={"#0f172a"}
                            level={"M"}
                        />
                    </div>
                </div>
            </div>

            <div className="pa-receipt-divider"></div>

            {/* ── STATUS STEPPER ── */}
            <div className="pa-stepper-wrapper">
                <OrderStepper currentStatus={order.received} />
            </div>

            <div className="pa-receipt-divider"></div>

            {/* ── RECEIPT DETAILS ── */}
            <div className="pa-receipt-details">
                <div className="pa-receipt-row">
                    <span>หมายเลขบัตร</span>
                    <strong>#{order.order_id}</strong>
                </div>
                <div className="pa-receipt-row">
                    <span>ชื่อลูกค้า</span>
                    <strong className="pa-receipt-name">{order.first_name} {order.last_name}</strong>
                </div>
                <div className="pa-receipt-row">
                    <span>เบอร์โทรศัพท์</span>
                    <strong>{order.phone}</strong>
                </div>
                <div className="pa-receipt-row">
                    <span>ชื่องาน</span>
                    <strong style={{ maxWidth: '180px', textAlign: 'right' }}>{order.shop_title || order.product_name || "Buddy Music On The Beach"}</strong>
                </div>
            </div>

            <div className="pa-receipt-divider"></div>

            {/* ── TICKET ITEMS ── */}
            <div className="pa-receipt-row" style={{ alignItems: 'center' }}>
                <div className="pa-ticket-item-group">
                    <img
                        src={order.pictures_path ? (order.pictures_path.startsWith("http") ? order.pictures_path : `/${order.pictures_path}`) : "/pictures/Logo.png"}
                        alt={order.name}
                        className="pa-ticket-img"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/pictures/Logo.png"; }}
                    />
                    <div className="pa-ticket-info">
                        <strong className="pa-ticket-name">{order.name || order.product_name}</strong>
                        <span className="pa-ticket-count">จำนวน {order.items?.length || 0} ใบ</span>
                    </div>
                </div>
            </div>

            {/* ── TICKET CODES ── */}
            {order.items && order.items.length > 0 && (
                <div className="pa-ticket-codes-wrapper">
                    {order.items.map((item, i) => (
                        <div key={i} className="pa-ticket-code-row">
                            <span className="code-label">รหัสบัตร</span>
                            <strong className="code-value">{item.ticket_code}</strong>
                        </div>
                    ))}
                </div>
            )}

            <div className="pa-receipt-divider"></div>

            {/* ── TOTAL PRICE ── */}
            <div className="pa-receipt-row total">
                <span>ยอดชำระสุทธิ</span>
                <span>฿{order.total_price?.toLocaleString()}</span>
            </div>

            {/* ── PAYMENT SECTION ── */}
            <div className="pa-slip-bottom" style={{ marginTop: '1rem' }}>
                
                {order.received == 0 ? (
                    <div className="pa-payment-warning-box">
                        
                        <div className="pa-warning-label">
                            <AlertCircle size={20} />
                            <span>ยังไม่ได้ชำระเงิน</span>
                        </div>

                        <div className="pa-bank-box">
                            <div className="pa-bank-details-row">
                                <span className="pa-bank-text">{bankDetails.bankName}</span>
                                <span className="pa-bank-text">{bankDetails.accountName}</span>
                            </div>
                            <div className="pa-bank-account-row">
                                <strong className="pa-account-number">{bankDetails.accountNo}</strong>
                                <button 
                                    onClick={handleCopy}
                                    className={`pa-copy-btn ${copied ? 'copied' : ''}`}
                                >
                                    {copied ? <><Check size={16} /> คัดลอกแล้ว</> : <><Copy size={16} /> คัดลอก</>}
                                </button>
                            </div>
                        </div>

                        <h4 className="form-section-title pa-upload-title">
                            <Receipt size={18} /> แจ้งชำระเงิน (อัปโหลดสลิป)
                        </h4>
                        
                        <div className="input-group" style={{ marginBottom: '0' }}>
                            <input 
                                type="file" 
                                name="slip" 
                                accept="image/*" 
                                onChange={handleSlipChange} 
                                id={`app-upload-slip-${order.order_id}`} 
                                hidden 
                            />
                            <label 
                                htmlFor={`app-upload-slip-${order.order_id}`} 
                                className={`app-upload-box pa-upload-label ${slipFile ? 'has-file' : ''}`}
                            >
                                {slipFile ? (
                                    <img 
                                        src={URL.createObjectURL(slipFile)} 
                                        alt="slip preview" 
                                        className="pa-preview-img"
                                    />
                                ) : (
                                    <div className="pa-upload-placeholder-content">
                                        <Upload size={24} color="#3b82f6" />
                                        <span className="pa-upload-text">
                                            คลิกเพื่อแนบรูปภาพสลิปโอนเงิน <br />
                                            <span className="pa-upload-warning">
                                                (หากมีการปลอมแปลงสลิปทางทีมงานจะขอตัดสิทธิ์ทันทีโดยไม่ต้องแจ้งล่วงหน้า)
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </label>
                            {slipError && <p className="error-msg pa-error-msg">{slipError}</p>}
                            
                            {/* 🌟 3. ผูกฟังก์ชัน handleSubmitSlip เข้ากับปุ่มยืนยัน */}
                            {slipFile && (
                                <button className="pa-submit-btn" onClick={handleSubmitSlip}>
                                    ยืนยันการชำระเงิน
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="pa-slip-text">หลักฐานการโอนเงิน</p>
                        {order.slip_path ? (
                            <a
                                href={`${selectServer()}${order.slip_path.startsWith('/') ? '' : '/'}${order.slip_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="pa-slip"
                            >
                                <img
                                    src={`${selectServer()}${order.slip_path.startsWith('/') ? '' : '/'}${order.slip_path}`}
                                    alt="slip"
                                    className="pa-slip-img"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/pictures/Logo.png"; }}
                                />
                                <div className="pa-slip-veil">
                                    <Search size={18} />
                                    <span>ดูรูปเต็ม</span>
                                </div>
                            </a>
                        ) : (
                            <div className="pa-empty-slip">
                                ยังไม่มีการอัปโหลดหลักฐานการโอนเงิน
                            </div>
                        )}
                    </>
                )}
            </div>
        </article>
    );
};

export default OrderCard;