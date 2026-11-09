// src/components/ui/LoadingScreen.jsx
import "../../styles/ui/LoadingScreen.css";
import { createPortal } from "react-dom";

const LoadingScreen = ({
  logoSrc = "/pictures/favicon.webp",
  message = "ระบบกำลังเตรียมความพร้อม",
  progress = 0,
  currentTask = "กำลังโหลดข้อมูล...", // 🌟 รับข้อความของจริงมาแสดง
  isFinishing = false 
}) => {
  // ไม่ต้องใช้ setInterval แล้ว เพราะเราใช้ข้อมูลจริง

  const determinate = typeof progress === "number" && progress >= 0 && progress <= 100;

  return createPortal(
    <div className={`loading-warp ${isFinishing ? "fade-out" : "fade-in"}`}>
      <div className="loading-screen new" role="status" aria-live="polite">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />

        <div className="loading-card glass animate-fade-up">
          <div className="logo-stack">
            <img src={logoSrc} alt="Logo" className="logo-image" />
            <div className="halo" aria-hidden />
          </div>

          <div className="spinner">
            <svg viewBox="0 0 44 44" className="spinner-svg" aria-hidden="true">
              <circle className="track" cx="22" cy="22" r="19" />
              <circle className="arc" cx="22" cy="22" r="19" />
            </svg>
          </div>

          {/* 🌟 แสดงข้อความจริง และเปอร์เซ็นต์จริง */}
          <p className="loading-text">{currentTask}</p>
          <p className="loading-tip">{determinate ? `${progress}%` : "กำลังโหลด..."}</p>

          <div
            className={`loading-progress ${determinate ? "is-determinate" : "is-indeterminate"}`}
            role="progressbar"
          >
            <div
              className="progress-fill"
              style={determinate ? { width: `${progress}%` } : undefined}
            />
          </div>
        </div>

        <p className="loading-message animate-fade-up delay">{message}</p>
      </div>
    </div>,
    document.body
  );
};

export default LoadingScreen;