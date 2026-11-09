import { useState, useEffect, useCallback } from "react";

export const useCheckoutPersist = () => {
    const STORAGE_KEY = "buddy_checkout_session";
    const SYNC_EVENT = "buddy_checkout_sync";

    const getStoredData = useCallback(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const cart = localStorage.getItem("cart");

            if (saved) {
                const parsed = JSON.parse(saved);
                
                if (parsed.step === 2 && (!cart || cart === "[]")) {
                    localStorage.removeItem(STORAGE_KEY);
                    localStorage.removeItem("pendingOrderId");
                    localStorage.removeItem("checkoutStep");
                    return {
                        step: 1, orderId: null, totalAmount: 0,
                        formData: { firstName: "", lastName: "", phone: "", province: "", slip: null }
                    };
                }

                return {
                    step: parsed.step || 1,
                    orderId: parsed.orderId || null,
                    totalAmount: parsed.totalAmount || 0,
                    formData: {
                        firstName: parsed.formData?.firstName || "",
                        lastName: parsed.formData?.lastName || "",
                        phone: parsed.formData?.phone || "",
                        province: parsed.formData?.province || "",
                        slip: null
                    }
                };
            }
        } catch (e) { console.error(e); }
        return {
            step: 1, orderId: null, totalAmount: 0,
            formData: { firstName: "", lastName: "", phone: "", province: "", slip: null }
        };
    }, []);

    const [checkoutData, setCheckoutData] = useState(getStoredData());

    useEffect(() => {
        const handleSync = () => {
            setCheckoutData(prev => {
                const freshData = getStoredData();
                return {
                    ...freshData,
                    formData: {
                        ...freshData.formData,
                        slip: prev.formData.slip // 🌟 ปกป้องไฟล์รูประหว่าง Sync ไม่ให้หาย
                    }
                };
            });
        };
        window.addEventListener(SYNC_EVENT, handleSync);
        window.addEventListener("storage", handleSync);
        return () => {
            window.removeEventListener(SYNC_EVENT, handleSync);
            window.removeEventListener("storage", handleSync);
        };
    }, [getStoredData]);

    const notifyUpdate = () => window.dispatchEvent(new Event(SYNC_EVENT));

    const updateFormData = (newData) => {
        const updated = { ...checkoutData, formData: { ...checkoutData.formData, ...newData } };
        setCheckoutData(updated);

        const dataToSave = {
            step: updated.step,
            orderId: updated.orderId,
            totalAmount: updated.totalAmount, // 🌟 เซฟยอดเงิน
            formData: { ...updated.formData, slip: null }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    };

    const updateStepAndOrder = (step, orderId, amount = null) => {
        const updated = {
            ...checkoutData,
            step,
            orderId: orderId || checkoutData.orderId,
            totalAmount: amount !== null ? amount : checkoutData.totalAmount // 🌟 อัปเดตยอดเงิน
        };
        setCheckoutData(updated);

        const dataToSave = {
            step: updated.step,
            orderId: updated.orderId,
            totalAmount: updated.totalAmount, // 🌟 เซฟยอดเงิน
            formData: { ...updated.formData, slip: null }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        notifyUpdate();
    };

    const clearStorageOnly = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("cart");
        if (checkoutData.orderId) {
            localStorage.removeItem(`expireTime_order_${checkoutData.orderId}`);
        }
        localStorage.removeItem("pendingOrderId");
        localStorage.removeItem("checkoutStep");
        localStorage.removeItem("autoSaveCheckoutData");
        notifyUpdate();
    };

    const resetAll = () => {
        clearStorageOnly();
        setCheckoutData({
            step: 1, orderId: null, totalAmount: 0,
            formData: { firstName: "", lastName: "", phone: "", province: "", slip: null }
        });
        notifyUpdate();
    };

    return { checkoutData, updateFormData, updateStepAndOrder, clearStorageOnly, resetAll };
};

export default useCheckoutPersist;