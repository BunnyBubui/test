import { createRoot } from "react-dom/client";
import { LoaderCircle } from "lucide-react";
import "./css/Alert.css";

const LoadingModal = ({ message, progress }) => {
  return (
    <div className="alert-loading-overlay">
      <div className="alert-loading-box">
        <span><LoaderCircle size={60}/></span>
        <div style={{ marginTop: '15px', whiteSpace: 'pre-line' }}>{message}</div>
        
        {progress !== undefined && (
            <div style={{ width: '100%', marginTop: '15px' }}>
                <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        width: `${progress}%`, 
                        height: '100%', 
                        background: '#4ade80', 
                        transition: 'width 0.2s ease'
                    }} />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const AlertModal = ({ message, onClose, onConfirm, showCancel }) => {
    return (
      <div className="alert-overlay">
        <div className="alert-box">
          <h3>แจ้งเตือน</h3>
          <p>{message}</p>
          <div className="alert-buttons">
            {showCancel && (
              <button className="alert-btn cancel" onClick={onClose}>
                ยกเลิก
              </button>
            )}
            <button className="alert-btn confirm" onClick={onConfirm}>
              ตกลง
            </button>
          </div>
        </div>
      </div>
    );
  };
  
export const showAlert = (message, options = {}) => {
const { confirm = false } = options;

return new Promise((resolve) => {
    const alertDiv = document.createElement("div");
    document.body.appendChild(alertDiv);
    const root = createRoot(alertDiv);

    const handleClose = (result = false) => {
    const overlay = document.querySelector(".alert-overlay");
    if (overlay) overlay.classList.add("hide");
    setTimeout(() => {
        if (overlay) overlay.classList.remove("hide");
        root.unmount();
        document.body.removeChild(alertDiv);
        resolve(result);
    }, 300);
    };

    const handleConfirm = () => handleClose(true);
    const handleCancel = () => handleClose(false);

    root.render(
    <AlertModal
        message={message}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        showCancel={confirm}
    />
    );
});
};

let loadingRoot = null;
let loadingDiv = null;

export const showLoading = (message = "⏳ กำลังประมวลผล...", progress) => {
  if (loadingRoot) {
    loadingRoot.render(<LoadingModal message={message} progress={progress} />);
    return;
  }

  loadingDiv = document.createElement("div");
  document.body.appendChild(loadingDiv);
  loadingRoot = createRoot(loadingDiv);

  loadingRoot.render(<LoadingModal message={message} progress={progress} />);
};

export const updateLoading = (message, progress) => {
    if (loadingRoot) {
        loadingRoot.render(<LoadingModal message={message} progress={progress} />);
    }
};

export const hideLoading = () => {
  if (!loadingRoot || !loadingDiv) return;

  const overlay = document.querySelector(".alert-loading-overlay");
  if (overlay) overlay.classList.add("hide");

  setTimeout(() => {
    if (loadingRoot) {
        loadingRoot.unmount();
        loadingRoot = null;
    }
    if (loadingDiv && document.body.contains(loadingDiv)) {
        document.body.removeChild(loadingDiv);
        loadingDiv = null;
    }
  }, 300);
};