import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import "../../styles/modal/ImageZoomOverlay.css"; // ตรวจสอบ path ให้ตรงกับของคุณ

const ImageZoomOverlay = ({ images, index, onClose, setIndex }) => {
  // สร้าง State ไว้เก็บตำแหน่งที่นิ้วแตะจอ
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // ระยะปัดนิ้วขั้นต่ำ (พิกเซล) ถึงจะถือว่าเป็นการเปลี่ยนรูป
  const minSwipeDistance = 50;

  if (index === null || !images || images.length === 0) return null;

  // ฟังก์ชันเปลี่ยนรูป
  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return createPortal(
    <div className="zoom-overlay" onClick={onClose}>
      <button className="close-zoom-btn" onClick={onClose}>
        <X size={28} />
      </button>

      <button className="zoom-nav-btn prev hidden md:flex" onClick={handlePrev}>
        <ChevronLeft size={40} color="white" />
      </button>

      <div
        className="zoomed-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={index} 
          src={images[index]}
          alt={`Zoomed ${index + 1}`}
          className="zoomed-image"
        />
        <div className="image-counter">
          {index + 1} / {images.length}
        </div>
      </div>

      <button className="zoom-nav-btn next hidden md:flex" onClick={handleNext}>
        <ChevronRight size={40} color="white" />
      </button>
    </div>,
    document.body
  );
};

export default ImageZoomOverlay;