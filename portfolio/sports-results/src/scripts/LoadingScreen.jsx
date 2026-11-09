import "./css/LoadingScreen.css";
import { useEffect, useState } from "react";

const defaultTips = [
  "Checking permissions...",
  "Loading profile...",
  "Connecting to server...",
  "Preparing dashboard..."
];

const LoadingScreen = ({
  logoSrc = "/pictures/favicon.png",
  message = "The system is preparing your data",
  progress,
  tips = defaultTips
}) => {
  const [tipIdx, setTipIdx] = useState(0);
  const determinate =
    typeof progress === "number" && progress >= 0 && progress <= 100;

  useEffect(() => {
    const id = setInterval(
      () => setTipIdx((i) => (i + 1) % tips.length),
      2400
    );
    return () => clearInterval(id);
  }, [tips.length]);

  return (
    <div
      className="loading-screen new"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <div className="loading-card glass">
        <div className="logo-stack">
          <img src={logoSrc} alt="WU Freshy Award Logo" className="logo-image" />
          <div className="halo" aria-hidden />
        </div>

        <div className="spinner">
          <svg viewBox="0 0 44 44" className="spinner-svg" aria-hidden="true">
            <circle className="track" cx="22" cy="22" r="19" />
            <circle className="arc" cx="22" cy="22" r="19" />
          </svg>
        </div>

        <p className="loading-text">Loading...</p>
        <p className="loading-tip">{tips[tipIdx]}</p>

        <div
          className={`loading-progress ${
            determinate ? "is-determinate" : "is-indeterminate"
          }`}
          aria-label="Progress bar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={determinate ? progress : undefined}
          role="progressbar"
        >
          <div
            className="progress-fill"
            style={determinate ? { width: `${progress}%` } : undefined}
          />
        </div>
      </div>

      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingScreen;
