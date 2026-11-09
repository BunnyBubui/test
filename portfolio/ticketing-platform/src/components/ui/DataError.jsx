// src/components/ui/DataError.jsx
import { useNavigate } from "react-router-dom";
import { ServerCrash, RefreshCw, Home } from "lucide-react";
import "../../styles/ui/DataError.css";

const DataError = ({ 
  title = "เกิดข้อผิดพลาดในการเชื่อมต่อ", 
  message = "ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
  onRetry // 🌟 รับฟังก์ชันสำหรับกดโหลดใหม่
}) => {
  const navigate = useNavigate();

  // ฟังก์ชันโหลดหน้าเว็บใหม่ ถ้าไม่ได้ส่ง onRetry มาให้
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="data-error-container">
      <div className="data-error-content animate-fade-up">
        
        {/* ไอคอนแสดงความผิดพลาดแบบมีลูกเล่นสี */}
        <div className="error-icon-circle">
          <div className="error-icon-bg"></div>
          <ServerCrash size={56} strokeWidth={1.5} className="text-rose-500" />
        </div>

        {/* ข้อความ */}
        <h2 className="error-title">{title}</h2>
        <p className="error-message">{message}</p>

        {/* ปุ่มกด */}
        <div className="error-actions">
          <button 
            className="error-btn btn-retry" 
            onClick={handleRetry}
          >
            <RefreshCw size={18} />
            ลองใหม่อีกครั้ง
          </button>
        </div>

      </div>
    </div>
  );
};

export default DataError;