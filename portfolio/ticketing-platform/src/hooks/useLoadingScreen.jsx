import { useState, useEffect } from "react";
import LoadingScreen from "../components/ui/LoadingScreen";
import NotFound from "../components/ui/NotFound";

export const useLoadingScreen = (
    loadingStates = [],
    timeoutMs = 10000,
    errorMessageTitle = "ไม่พบหน้าเว็บที่คุณต้องการ",
    errorMessage = "หน้าที่คุณกำลังค้นหาอาจถูกลบ เปลี่ยนชื่อ ไม่มีอยู่จริง หรือใช้เวลาโหลดนานเกินไป"
) => {
    const [isTimeout, setIsTimeout] = useState(false);
    const isStillLoading = loadingStates.some(Boolean);

    useEffect(() => {
        let timer;

        if (isStillLoading) {
            setIsTimeout(false);
            timer = setTimeout(() => {
                setIsTimeout(true);
            }, timeoutMs);
        } else {
            setIsTimeout(false);
        }

        return () => clearTimeout(timer);
    }, [isStillLoading, timeoutMs]);

    if (isTimeout) {
        return <NotFound title={errorMessageTitle} message={errorMessage} />;
    }

    if (isStillLoading) {
        return <LoadingScreen />;
    }

    return null;
};