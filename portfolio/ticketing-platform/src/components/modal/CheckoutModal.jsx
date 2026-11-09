import React, { useState, useEffect, useRef } from "react";
import { selectServer } from "../../utils/Server";
import { showAlert, showLoading, hideLoading } from "../ui/Alert";
import "../../styles/modal/CheckoutModal.css";
import "../../styles/modal/CheckoutWizard.css";
import useScrollAnimation from "../../hooks/useScrollAnimation.jsx";
import { useGetData } from "../../hooks/useGetData.jsx";

// นำเข้า Hook
import useCheckoutPersist from "../../hooks/useCheckoutPersist";

import OrderFormStep from "./OrderFormStep";
import PaymentStep from "./PaymentStep";
import SuccessReceipt from "./SuccessReceipt";

const CheckoutModal = ({ isOpen, onClose, cart, shippingSummary, totalPrice, onCheckoutSuccess }) => {
    // 🌟 เรียกใช้ Custom Hook
    const {
        checkoutData,
        updateFormData,
        updateStepAndOrder,
        clearStorageOnly,
        resetAll
    } = useCheckoutPersist();

    const { step, orderId: createdOrderId, formData } = checkoutData;

    const [errors, setErrors] = useState({});
    const [sheetOffset, setSheetOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const scrollContentRef = useRef(null);

    const { data: provincesData } = useGetData("thai");
    const provincesList = provincesData?.data || provincesData || [];

    useScrollAnimation();

    useEffect(() => {
        if (isOpen) {
            setSheetOffset(0);
            setIsDragging(false);
            document.body.classList.add("force-lock-scroll");
        } else {
            setTimeout(() => {
                setSheetOffset(0);
                setIsDragging(false);
            }, 300);
            document.body.classList.remove("force-lock-scroll");
        }
        return () => document.body.classList.remove("force-lock-scroll");
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTouchStart = (e) => {
        if (scrollContentRef.current && scrollContentRef.current.scrollTop > 0) return;
        setIsDragging(true);
        dragStartY.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const distance = currentY - dragStartY.current;
        if (distance > 0) setSheetOffset(distance);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        let finalValue = files ? files[0] : value;
        updateFormData({ [name]: finalValue });
        setErrors({ ...errors, [name]: "" });
    };

    const handleCloseModal = () => {
        if (step === 3) {
            resetAll();
        }
        onClose();
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (sheetOffset > 120) handleCloseModal();
        else setSheetOffset(0);
    };

    const validateStep1 = () => {
        let newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อ";
        if (!formData.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";
        if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
        else if (!/^0\d{9}$/.test(formData.phone)) newErrors.phone = "เบอร์โทรต้องมี 10 หลัก";
        if (!formData.province.trim()) newErrors.province = "กรุณาเลือกจังหวัด";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateOrder = async () => {
        if (!validateStep1()) return;

        if (!cart || cart.length === 0) {
            await showAlert("เซสชั่นหมดอายุ กรุณาเลือกแพ็กเกจใหม่อีกครั้ง");
            resetAll();
            onClose();
            return;
        }

        try {
            showLoading("กำลังสร้างรายการ...");
            const formDataToSend = new FormData();
            formDataToSend.append("first_name", formData.firstName);
            formDataToSend.append("last_name", formData.lastName);
            formDataToSend.append("city", formData.province);
            formDataToSend.append("phone", formData.phone);

            const finalPrice = shippingSummary ? shippingSummary.grandTotal : totalPrice;
            formDataToSend.append("total_price", finalPrice);
            formDataToSend.append("shop_id", cart[0]?.shopId || 1);
            formDataToSend.append("items", JSON.stringify(cart));

            const res = await fetch(`${selectServer()}/api/orders`, { method: "POST", body: formDataToSend });
            const data = await res.json();
            hideLoading();

            if (res.ok) {
                localStorage.setItem("pendingOrderId", data.order_id);
                localStorage.setItem("checkoutStep", "2");
                
                // 🌟 ส่งค่า finalPrice เข้าไปเก็บใน Hook ด้วย!
                updateStepAndOrder(2, data.order_id, finalPrice);
            } else {
                await showAlert(`❌ สร้างออเดอร์ไม่สำเร็จ: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            hideLoading();
            await showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
    };

    const handleSubmitSlip = async () => {
        if (!formData.slip) {
            await showAlert("กรุณาแนบรูปภาพสลิปเพื่อยืนยัน");
            return;
        }
        if (!createdOrderId) {
            await showAlert("❌ ไม่พบหมายเลขบัตร กรุณาทำรายการใหม่");
            return;
        }

        try {
            showLoading("กำลังส่งสลิปชำระเงิน...");
            const formSlip = new FormData();
            formSlip.append("orderId", createdOrderId);
            formSlip.append("slip", formData.slip);

            const res = await fetch(`${selectServer()}/api/verify-slip`, {
                method: "POST",
                body: formSlip
            });

            const data = await res.json();
            hideLoading();

            if (res.ok) {
                await showAlert("✅ ระบบได้รับสลิปของคุณแล้ว");
                clearStorageOnly();
                updateStepAndOrder(3); 
                if (onCheckoutSuccess) onCheckoutSuccess();
            } else {
                await showAlert(`❌ ส่งสลิปไม่สำเร็จ: ${data.error || data.message || "เกิดข้อผิดพลาด"}`);
            }
        } catch (error) {
            console.error("❌ Submit Slip Error:", error);
            hideLoading();
            await showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };

    const cancelOrderAPI = async (orderIdToCancel) => {
        if (!orderIdToCancel) return true;
        try {
            showLoading("กำลังยกเลิกรายการในระบบ...");
            const res = await fetch(`${selectServer()}/api/orders-user/${orderIdToCancel}`, {
                method: "DELETE"
            });
            hideLoading();

            if (res.ok) return true;

            const data = await res.json();
            await showAlert(`ไม่สามารถยกเลิกได้: ${data.message}`);
            return false;
        } catch (error) {
            console.error("Cancel Order Error:", error);
            hideLoading();
            await showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
            return false;
        }
    };

    const handleRestartTransaction = async () => {
        const isDeleted = await cancelOrderAPI(createdOrderId);
        if (!isDeleted) return;

        resetAll();
        await showAlert("✅ ล้างรายการเสร็จสิ้น");

        if (!cart || cart.length === 0) onClose();
    };

    const handleFullReset = async () => {
        const confirmDialog = await showAlert("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกรายการนี้? (ระบบจะล้างข้อมูลในตะกร้าทั้งหมด)", { confirm: true });
        if (!confirmDialog) return;

        const isDeleted = await cancelOrderAPI(createdOrderId);
        if (!isDeleted) return;

        resetAll();
        await showAlert("✅ ล้างรายการเสร็จสิ้น");
        onClose();
        window.location.reload();
    };

    return (
        <div className={`app-modal-overlay ${!isOpen ? "hide" : ""}`} onClick={handleCloseModal}>
            <div className="app-modal-sheet" onClick={(e) => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ transform: sheetOffset > 0 ? `translateY(${sheetOffset}px)` : undefined, transition: isDragging ? "none" : "transform 0.3s" }}>
                <div className="sheet-drag-handle"></div>

                <div className="step-indicator">
                    <div className={`step-dot ${step >= 1 ? 'active' : ''} ${step === 1 ? 'focus' : ''}`}>1</div>
                    <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step-dot ${step >= 2 ? 'active' : ''} ${step === 2 ? 'focus' : ''}`}>2</div>
                    <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`step-dot ${step >= 3 ? 'active' : ''} ${step === 3 ? 'focus' : ''}`}>3</div>
                </div>

                <div className="sheet-scroll-content" ref={scrollContentRef}>
                    {step === 1 && (
                        <OrderFormStep
                            formData={formData}
                            handleChange={handleChange}
                            errors={errors}
                            onSubmit={handleCreateOrder}
                            shippingSummary={shippingSummary}
                            provincesList={provincesList}
                        />
                    )}

                    {step === 2 && (
                        <PaymentStep
                            orderId={createdOrderId}
                            formData={formData}
                            cart={cart}
                            handleChange={handleChange}
                            errors={errors}
                            onSubmitSlip={handleSubmitSlip}
                            onRestart={handleRestartTransaction}
                            onClear={handleFullReset}
                        />
                    )}

                    {step === 3 && (
                        <SuccessReceipt
                            formData={formData}
                            orderId={createdOrderId}
                            shippingSummary={shippingSummary}
                            totalPrice={totalPrice}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;