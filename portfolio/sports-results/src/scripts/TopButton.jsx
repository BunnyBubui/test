import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import "./css/TopButton.css";
const TopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsVisible(window.scrollY > 300);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <div
                    className={`go-top-btn ${isVisible ? "show" : "hide"}`}
                    onClick={scrollToTop}
                    title="เลื่อนไปบนสุด"
                >
                    <ArrowUp size={24} color="#fff" />
                </div>
            )}
        </>
    );
};

export default TopButton;