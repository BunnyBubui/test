import "../../styles/banner/Banner.css";
import { useBanner } from "../../hooks/useBanner";
import { useEffect } from "react";

const Banner = ({ images = [], marginBottom, isFullScreen = false, isModalOpen }) => {
  const {
    current,
    goToSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useBanner(images);

  useEffect(() => {
    if (!images.length) return;

    const slideInterval = setInterval(() => {
      const nextSlide = (current + 1) % images.length;
      goToSlide(nextSlide);
    }, 5000); 

    return () => clearInterval(slideInterval);
  }, [current, images.length, goToSlide]); 

  if (!images.length) return null;

  return (
    <div className="banner-warp" style={{ marginBottom: marginBottom }}>
      <div
        className={`banner-container animate-fade-bottom ${isFullScreen? "full" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
                opacity: isModalOpen ? 0 : 1,
                visibility: isModalOpen ? "hidden" : "visible",
                transition: "opacity 0.3s ease, visibility 0.3s ease"
            }}
      >
        <div
          className="banner-slider"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {images.map((src, i) => (
            <div key={i} className="banner-slide-wrapper">
              {/* 🌟 1. ภาพทำพื้นหลังเบลอ (ให้เต็มกรอบเสมอ) */}
              <img src={src} alt={`bg-blur-${i}`} className="banner-bg-blur" />
              
              {/* 🌟 2. ภาพหลัก (Contain สัดส่วนเดิม ไม่โดนตัด) */}
              <img src={src} alt={`banner-${i}`} className="banner-img" />
            </div>
          ))}
        </div>

        <div className="banner-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`banner-dot ${current === i ? "active" : ""}`}
              onClick={() => goToSlide(i)}
            >
              —
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;