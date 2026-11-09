import { useState, useRef } from "react";

export const useBanner = (elements = []) => {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const endX = useRef(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev < elements.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < elements.length) setCurrent(index);
  };

  const handleTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (endX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    const diff = startX.current - endX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide(); 
      else prevSlide();
    }
  };

  return {
    current,
    nextSlide,
    prevSlide,
    goToSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
