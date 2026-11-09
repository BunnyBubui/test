import "./css/LoadingSpinner.css";

export default function LoadingSpinner({ size = 24, color = "#555", text = "กำลังโหลด..." }) {
    return (
        <div className="loading-wrapper">
            <div
                className="loading-spinner"
                style={{
                    width: size,
                    height: size,
                    borderColor: `${color}33`,
                    borderTopColor: color
                }}
            />
            {text && <span className="loading-text">{text}</span>}
        </div>
    );
}
