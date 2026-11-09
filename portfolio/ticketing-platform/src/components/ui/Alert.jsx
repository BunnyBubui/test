import { createRoot } from "react-dom/client";
import { LoaderCircle } from "lucide-react";
import "../../styles/ui/Alert.css";

const LoadingModal = ({ message }) => {
  return (
    <div className="alert-loading-overlay">
      <div className="alert-loading-box">
        <span><LoaderCircle size={60}/></span>
        {message}
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

export default AlertModal;

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
        // 🌟 กันพัง: เช็คก่อนลบ
        if (root) root.unmount();
        if (document.body.contains(alertDiv)) {
           document.body.removeChild(alertDiv);
        }
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

export const showLoading = (message = "⏳ กำลังประมวลผล...") => {
  if (loadingRoot || loadingDiv) {
     hideLoading();
  }

  loadingDiv = document.createElement("div");
  document.body.appendChild(loadingDiv);
  loadingRoot = createRoot(loadingDiv);

  loadingRoot.render(<LoadingModal message={message} />);
};

export const hideLoading = () => {
  if (!loadingRoot || !loadingDiv) return;

  const overlay = document.querySelector(".alert-loading-overlay");
  if (overlay) overlay.classList.add("hide");

  const rootToUnmount = loadingRoot;
  const divToRemove = loadingDiv;
  
  loadingRoot = null;
  loadingDiv = null;

  setTimeout(() => {
    if (rootToUnmount) {
        rootToUnmount.unmount();
    }
    
    if (divToRemove && document.body.contains(divToRemove)) {
        document.body.removeChild(divToRemove);
    }
    
    document.body.style.overflow = "auto";
    document.body.style.pointerEvents = "auto";

  }, 300);
};

export const showNotification = (message, type = "success") => {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-notif toast-${type}`;

    let icon = "✅"; 
    if (type === "error") icon = "❌";
    if (type === "warning") icon = "⚠️";
    if (type === "info") icon = "ℹ️";

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 3000);
};