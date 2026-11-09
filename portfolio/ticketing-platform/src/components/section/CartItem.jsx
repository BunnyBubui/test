import React from "react";
import { Trash2, Plus, Minus, ZoomIn } from "lucide-react";
import "../../styles/section/CartItem.css";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const CartItem = ({ item, index, onRemove, onChangeQuantity, onZoomImage }) => {
    const itemImage = item.selections?.[0]?.partPictures?.[0] || "pictures/Logo.png";
    useScrollAnimation();

    return (
        <div className="app-cart-card animate-fade-right">
            <div className="cart-card-inner">
                <div className="cart-item-image delay-1 animate-fade-right" onClick={() => onZoomImage(itemImage)}>
                    <img src={itemImage} alt={item.name} />
                    <div className="cart-zoom-hint"><ZoomIn size={14} /> ซูม</div>
                </div>
                <div className="cart-item-details">
                    <div className="card-header">
                        <h3 className="item-name delay-1 animate-fade-right">{item.name}</h3>
                        <button className="btn-trash delay-1 animate-fade-left" onClick={() => onRemove(index)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div className="item-variants delay-1 animate-fade-right">
                        {item.selections?.map((s, i) => (
                            <div className="variant-badge" key={i}>
                                {s.selectedShirt || "-"} / {s.selectedSize || "-"}
                            </div>
                        ))}
                    </div>
                    <div className="card-footer">
                        <div className="item-price-wrap">
                            <span className="item-price delay-1 animate-fade-right">฿{item.price.toLocaleString()}</span>
                        </div>
                        <div className="app-qty-control delay-1 animate-fade-left">
                            <button onClick={() => onChangeQuantity(index, item.quantity - 1)}>
                                <Minus size={14} />
                            </button>
                            <span className="qty-number">{item.quantity}</span>
                            <button onClick={() => onChangeQuantity(index, item.quantity + 1)}>
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;