import React, { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Receipt, AlertCircle, Download, RefreshCw, ChevronUp, X } from "lucide-react";
import { selectServer } from "../../utils/Server";
import { showNotification, showAlert } from "../ui/Alert";
import { ShowContact } from "../ui/Contact";
import useDownloadQR from "../../hooks/useDownloadQR";

const PaymentStep = ({ orderId, formData, cart = [], handleChange, errors, onSubmitSlip, expireMinutes = 15, onRestart, onClear }) => {
    const [timeLeft, setTimeLeft] = useState(expireMinutes * 60);
    const [qrImage, setQrImage] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isErr, setIsErr] = useState(false);

    const [isCompact, setIsCompact] = useState(true);
    const containerRef = useRef(null);

    const { downloadQR, isDownloading } = useDownloadQR();
    const fetchQR = useCallback(async () => {
        try {
            setIsErr(false);
            setIsRefreshing(true);
            const res = await fetch(`${selectServer()}/api/generate-qr/${orderId}`);
            const data = await res.json();
            if (res.ok) {
                setQrImage(data.data.qr_image);
                setPaymentAmount(data.data.total_price);

                const expireMins = data.data.expire_in_minutes;
                const storageKey = `expireTime_order_${orderId}`;
                let targetTime = localStorage.getItem(storageKey);

                if (!targetTime) {
                    targetTime = Date.now() + (expireMins * 60 * 1000);
                    localStorage.setItem(storageKey, targetTime);
                }

                const initialTimeLeft = Math.floor((parseInt(targetTime) - Date.now()) / 1000);
                if (initialTimeLeft <= 0) {
                    setIsExpired(true);
                    setTimeLeft(0);
                } else {
                    setTimeLeft(initialTimeLeft);
                }
            } else if (res.status === 400) {
                setIsExpired(true);
                setTimeLeft(0);
            }
        } catch (err) {
            console.error("Failed to load QR", err);
            setIsErr(true);
        } finally {
            setIsRefreshing(false);
        }
    }, [orderId]);

    useEffect(() => {
        if (orderId) fetchQR();
    }, [orderId, fetchQR]);

    useEffect(() => {
        
        if (timeLeft === null || timeLeft <= 0) {
            if (timeLeft === 0 && !isExpired) {
                setIsExpired(true);
                showAlert("⏳ หมดเวลาชำระเงิน กรุณาทำรายการสั่งซื้อใหม่อีกครั้ง");
            }
            return;
        }

        const timerId = setInterval(() => {
            const targetTime = localStorage.getItem(`expireTime_order_${orderId}`);
            if (targetTime) {
                const newTimeLeft = Math.floor((parseInt(targetTime) - Date.now()) / 1000);
                if (newTimeLeft <= 0) {
                    setTimeLeft(0);
                    setIsExpired(true);
                    clearInterval(timerId);
                    showAlert("⏳ หมดเวลาชำระเงิน หรือทำรายการไม่สำเร็จ");
                } else {
                    setTimeLeft(newTimeLeft);
                }
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, orderId, isExpired]);

    const formatTime = (seconds) => {
        if (seconds === null) return "กำลังคำนวณ...";
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleCancel = () => {
        onClear(orderId);
    };

    return (
        <div className="wizard-container order-form" ref={containerRef}>
            {isExpired && (
                <div className="expired-overlay">
                    <AlertCircle size={48} color="#e53935" />
                    <h3 className="text-danger-bold mt-1">หมดเวลาชำระเงิน</h3>
                    <p className="text-white-bold">กรุณาทำรายการสั่งซื้อใหม่อีกครั้ง</p>
                    <ShowContact />
                    <button onClick={onRestart} className="btn-restart-transaction">
                        <i><RefreshCw size={20} /></i> ทำรายการใหม่
                    </button>
                </div>
            )}

            <div className={`payment-timer-box ${isCompact ? 'compact' : ''}`} onClick={() => setIsCompact(!isCompact)}>
                <div className="payment-group">
                    <div className="timer-header-row">
                        <div className="timer-texts">
                            <p className='text-danger-bold'>กรุณาชำระเงินภายใน</p>
                            {!isCompact && <p className="order-id-text">ออเดอร์: <strong>#{orderId}</strong></p>}
                        </div>
                        <h2 className="main-timer">{formatTime(timeLeft)}</h2>
                    </div>

                    {!isCompact && (
                        <div className="bill-details">
                            <div className="bill-divider-dashed"></div>
                            <p className="bill-title">รายการสั่งซื้อของคุณ</p>

                            <div className="bill-items-list">
                                {cart?.map((item, idx) => (
                                    <div key={idx} className="bill-item-row">
                                        <span className="bill-item-name">{item.name}</span>
                                        <span className="bill-item-price">฿{item.total?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bill-divider-dashed"></div>

                            <div className="payment-amount-display">
                                <span>ยอดที่ต้องชำระ</span>
                                <h2 className="price-tag">฿{paymentAmount?.toLocaleString()}</h2>
                            </div>
                        </div>
                    )}
                </div>

                <div className="payment-footer">
                    <i className={`${!isCompact ? "active" : ""}`}><ChevronUp size={18} /></i>
                    <p>{isCompact ? "ดูรายละเอียดบิล" : "ปิดรายละเอียด"}</p>
                </div>
            </div>

            <div className="payment-options">
                {qrImage ? (
                    <div className="qr-code-display-full">


                        <div className="qr-header-row">
                            <p className="qr-scan-title">สแกน QR Code (พร้อมเพย์)</p>
                            <button onClick={fetchQR} disabled={isRefreshing} className="btn-refresh-qr">
                                <RefreshCw size={14} className={isRefreshing ? "spin-animation" : ""} />
                                รีเฟรช
                            </button>
                        </div>

                        <div className="qr-image-wrapper">
                            <img
                                src={qrImage}
                                alt="PromptPay QR"
                                className={`qr-image-main ${isRefreshing ? "is-refreshing" : ""}`}
                            />
                        </div>

                        <div className="bank-app-links-column">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    downloadQR(qrImage, orderId); 
                                }}
                                className="btn-download-qr"
                                disabled={isDownloading} 
                            >
                                <Download size={20} className="icon-mr-05" />
                                {isDownloading ? "กำลังบันทึก..." : "บันทึก QR Code"}
                            </button>
                        </div>
                        <div className="payment-instructions">
                            <p className="instructions-title">ขั้นตอนการชำระเงิน:</p>
                            <ol className="instructions-list">
                                <li>กดปุ่ม <strong>บันทึกรูป QR Code</strong> ด้านบน</li>
                                <li>เปิดแอปพลิเคชันธนาคารของคุณ</li>
                                <li>เลือกเมนู <strong>สแกน (Scan)</strong></li>
                                <li>เลือกรูปภาพ QR Code ที่บันทึกไว้</li>
                                <li><span className="text-danger-bold">ตรวจสอบยอดเงินให้ตรงกับ ฿{paymentAmount.toLocaleString()}</span></li>
                            </ol>
                        </div>
                    </div>
                ) : (
                    <p className="loading-state">
                        กำลังโหลด QR Code...
                        {isErr && (
                            <p>
                                ระบบเกิดข้อผิดพลาด โปรดลองรีเฟรชใหม่อีกครั้ง
                            </p>
                        )}
                    </p>
                )}
            </div>

            <hr className="divider" />
            <h4 className="form-section-title"><Receipt size={18} /> แจ้งชำระเงิน (อัปโหลดสลิป)</h4>

           <div className="input-group">
                <input type="file" name="slip" accept="image/*" onChange={handleChange} id="app-upload-slip" hidden disabled={isExpired} />
                <label htmlFor="app-upload-slip" className={`app-upload-box ${formData.slip ? 'has-file' : ''}`}>
                    {/* 🌟 ใช้แบบดั้งเดิมของคุณเลย ไม่ต้องมีเงื่อนไขซับซ้อน */}
                    {formData.slip ? (
                        <img src={URL.createObjectURL(formData.slip)} alt="slip" className="app-preview-img" />
                    ) : (
                        <div className="upload-placeholder">
                            <Upload size={24} color={isExpired ? "#ccc" : "#2379e2"} />
                            <span>คลิกเพื่อแนบรูปภาพสลิปโอนเงิน <br /><p style={{ color: "#ff4c4c" }}>(หากมีการปลอมแปลงสลิปทางทีมงานจะขอตัดสิทธิ์ทันทีโดยไม่ต้องแจ้งล่วงหน้า)</p></span>
                        </div>
                    )}
                </label>
                {errors.slip && <p className="error-msg">{errors.slip}</p>}
            </div>

            <div className="sheet-footer-actions">
                <button
                    type="button"
                    className="btn-confirm-order"
                    onClick={onSubmitSlip}
                    disabled={isExpired}
                >
                    <Receipt size={18} /> ยืนยันการชำระเงิน
                </button>

                <button
                    type="button"
                    className="btn-cancel-order"
                    onClick={() => handleCancel()}
                    disabled={isExpired}
                >
                    <X size={18} /> ยกเลิกออเดอร์
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;