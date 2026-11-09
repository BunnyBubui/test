import { useEffect } from "react";

const useScrollAnimation = (
  selector = ".animate-fade-top, .animate-fade-left, .animate-fade-right, .animate-fade-bottom", 
  threshold = 0.15
) => {
  useEffect(() => {
    // 🌟 Safety Net: Make sure threshold is a finite number. If not, fallback to 0.15.
    const safeThreshold = Number.isFinite(threshold) ? threshold : 0.15;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      // 🌟 Pass the safeThreshold here
      { threshold: safeThreshold }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    // Cleanup function looks perfect!
    return () => observer.disconnect();
  }, [selector, threshold]); 
};

export default useScrollAnimation;