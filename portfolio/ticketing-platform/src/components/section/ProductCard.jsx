import React, { useState } from "react";
import { Zap, Ticket, ChevronUp, X, ArrowBigUpDash, CalendarClock, CircleX } from "lucide-react";

// 🌟 Import คำสั่งแจ้งเตือนมาใช้
import { showAlert } from "../ui/Alert"; 
import "../../styles/section/ProductCard.css";
import { selectServer } from "../../utils/Server";

const PromotionDisplay = ({ promoActive, item, saleStatus }) => {
    return (
        <>
            {promoActive && item.type === "P" && (
                <span className="t-badge promo">
                    <ArrowBigUpDash style={{ paddingRight: 5 }} size={26}/>
                    โปรโมชั่น
                </span>
            )}
            {saleStatus === 'waiting' ? (
                <span className="t-badge waiting">
                    <CalendarClock style={{ paddingRight: 5 }} size={26}/>
                    รอเปิดขาย
                </span>
            ) : saleStatus === 'closed' ? (
                <span className="t-badge closed">
                    <CircleX style={{ paddingRight: 5 }} size={26}/>
                    ปิดการขาย
                </span>
            ) : item.sold_out ? (
                <span className="t-badge soldout">
                    <X style={{ paddingRight: 5 }} size={26}/>
                    หมด
                </span>
            ) : null}
        </>
    )
}

// 🌟 เพิ่มรับค่า disabledReason เข้ามา
const ProductCard = ({ item, promoActive, saleStatus, isPurchasable, disabledReason, onBuyNow, delay = 1, isModalOpen }) => {
    const saleOpen = saleStatus.includes("open")? true : false;
    const [isExpanded, setIsExpanded] = useState(saleOpen);

    const displayPrice = item.price.toLocaleString();
    const oldPrice = ["S", "P"].includes(item.type) && promoActive
        ? (item.price_piece * item.promoSetCount).toLocaleString()
        : null;

    return (
        <div
            className={`ticket-card ${saleStatus !== "open"? "hiden" : ""} ${isModalOpen ? "hide" : ""} ${isExpanded ? 'expanded' : ''}`}
            id={`product-${item.id}`}
            style={{ '--ticket-bg': `url(${selectServer()}/${item.picture || "pictures/favicon.webp"})` }}
            onClick={() => !isModalOpen && setIsExpanded(!isExpanded)} 
        >
            <div className="ticket-bg"></div>

            <div className="floating-price">
                <h3>{item.name}</h3>
                <div className="status-card">
                    <PromotionDisplay promoActive={promoActive} item={item} saleStatus={saleStatus} />
                    <p>
                        {item.sold_out ? 'SOLD OUT' : `฿${displayPrice}`}
                    </p>
                </div>
            </div>

            {!isExpanded && (
                <div className="tap-hint">
                    <ChevronUp size={24} className="animate-bounce" />
                    <span>แตะเพื่อดูรายละเอียด</span>
                </div>
            )}

            <div className="detailed-view">
                {isExpanded && (
                    <button
                        className="close-details-btn"
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                    >
                        <X size={18} />
                    </button>
                )}

                <div className="ticket-main-info">
                    <div className="ticket-badges">
                        <PromotionDisplay promoActive={promoActive} item={item} saleStatus={saleStatus} />
                    </div>

                    <h3>{item.name}</h3>
                    <p className="desc">{item.description}</p>

                    {!item.sold_out && item.preorder === 0 && ["S", "P"].includes(item.type) && (
                        <p style={{ fontSize: '0.85rem', color: '#6ee7b7', marginTop: '0.5rem' }}>
                            <Ticket size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            เหลือ {item.quantity} สิทธิ์
                        </p>
                    )}
                </div>

                <div className="ticket-rip-line"></div>

                <div className="ticket-stub">
                    <div className="ticket-price-box">
                        <div className="price-label">ราคา</div>
                        {item.sold_out ? (
                            <p className="price-amount" style={{ color: '#94a3b8' }}>SOLD OUT</p>
                        ) : (
                            <>
                                {oldPrice && <div className="old-price">ปกติ {oldPrice} ฿</div>}
                                <p className="price-amount">{displayPrice} ฿</p>
                            </>
                        )}
                    </div>

                    <button
                        className={`btn-buy-ticket ${isPurchasable ? 'active' : 'disabled'}`}
                        onClick={(e) => {
                            e.stopPropagation(); 
                            if (isPurchasable) {
                                onBuyNow(item);
                            } else {
                                showAlert(disabledReason || 'ไม่สามารถทำรายการได้ในขณะนี้');
                            }
                        }}
                    >
                        <Zap size={18} fill={isPurchasable ? "currentColor" : "none"} />
                        {isPurchasable ? 'ซื้อบัตรเลย' : 'ไม่สามารถทำรายการได้'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;