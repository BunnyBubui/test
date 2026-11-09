// src/components/ui/NotFound.jsx
import { useNavigate } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import "../../styles/ui/NotFound.css";

const NotFound = ({ 
  title = "ไม่พบหน้าเว็บที่คุณต้องการ", 
  message = "หน้าที่คุณกำลังค้นหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่จริง",
  icon = <FileQuestion size={72} strokeWidth={1.5} />
}) => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content animate-fade-up">
        {/* ไอคอน */}
        <div className="notfound-icon">
          {icon}
        </div>

        {/* ข้อความ */}
        <h1 className="notfound-title">{title}</h1>
        <p className="notfound-message">{message}</p>

        {/* ปุ่มกด */}
        <div className="notfound-actions">
          <button 
            className="notfound-btn btn-outline" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            ย้อนกลับ
          </button>
          
          <button 
            className="notfound-btn btn-primary" 
            onClick={() => navigate("/")}
          >
            <Home size={18} />
            หน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;