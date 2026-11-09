import React from "react";
import { ShoppingBag, ChevronDown, ChevronRight } from "lucide-react";
import "../../styles/ui/GoTo.css";

const GoTo = ({ onGoToShop }) => {
    const handleAction = () => {
        const shopSection = document.getElementById("shop-trigger-section");
        if (shopSection) {
            shopSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        if (onGoToShop) {
            setTimeout(() => {
                onGoToShop();
            }, 600);
        }
    };

    return (
        <section className="goto-container" >
            <div className="goto-arrow-out">
                <ChevronRight size={60}/>
            </div>

            <div onClick={handleAction}>
                <div className="goto-button">
                    <div className="goto-icon-wrap">
                        <ShoppingBag size={24} className="goto-icon" />
                    </div>
                    <div className="goto-text-content">
                        <span className="goto-label">บัตรมีจำนวนจำกัด</span>
                        <span className="goto-title">จองบัตรได้ที่นี่</span>
                    </div>
                    <ChevronDown size={20} className="goto-arrow" />
                </div>
                <div className="goto-glow"></div>
            </div>
        </section>
    );
};

export default GoTo;