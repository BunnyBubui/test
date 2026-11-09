import "./css/Banner.css";
import { useBanner } from "../hooks/useBanner";

const Banner = ({ images = [] }) => {
  const {
    current,
    goToSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useBanner(images);

  if (!images.length) return null;

  return (
    <div
      className="banner-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="banner-slider"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {images.map((src, i) => (
          <img key={i} src={src} alt={`banner-${i}`} className="banner-img" />
        ))}
      </div>

      <div className="banner-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${current === i ? "active" : ""}`}
            onClick={() => goToSlide(i)}
          >
            —
          </span>
        ))}
      </div>
    </div>
  );
};

export default Banner;
