import { useState } from "react";
import "../../styles/render/OrderCard.css";
import {
    Calendar,
    IdCard,
    User,
    Phone,
    ShoppingBag,
    Image as ImageIcon,
    Pencil,
    Trash2,
    MapPin,
    Package
} from "lucide-react";
import { selectServer } from "../../utils/Server";

const OrderItemList = ({ items }) => {
    const [expanded, setExpanded] = useState(false);

    const rawItems = Array.isArray(items) ? items : typeof items === "string" ? JSON.parse(items) : [];

    const sizeDataList = rawItems.filter(item => item && item.size).flatMap(item => {
        try {
            if (typeof item.size === "string") {
                const parsed = JSON.parse(item.size);
                return Array.isArray(parsed) ? parsed.map(s => ({ ...s, itemName: item.name, quantity: item.quantity })) : [];
            }
            return Array.isArray(item.size) ? item.size.map(s => ({ ...s, itemName: item.name, quantity: item.quantity })) : [];
        } catch (e) {
            return [];
        }
    });

    const visibleItems = expanded ? sizeDataList : sizeDataList.slice(0, 3);

    return (
        <div>
            <h4 className="oc-section-title">
                <Package size={18} /> รายการสินค้า
            </h4>
            
            {visibleItems.length > 0 ? (
                visibleItems.map((s, index) => {
                    const productDetails = products.find(p => p.name === s.itemName);
                    let itemImage = "/pictures/Logo.png"; 

                    if (productDetails && productDetails.parts) {
                        const selectedPart = productDetails.parts.find(p => p.partName === s.selectedShirt);
                        if (selectedPart && selectedPart.partPictures) {
                            itemImage = selectedPart.partPictures[0];
                        }
                    } else if (productDetails && productDetails.pictures) {
                        itemImage = productDetails.pictures[0];
                    }

                    return (
                        <div key={index} className="oc-item-row-with-img">
                            <div className="oc-item-info">
                                <div className="oc-item-name">
                                    {s.itemName} 
                                </div>
                                <span className="oc-size-text">
                                    ลาย: {s.selectedShirt} | ไซส์: {s.selectedSize}
                                </span>
                                <div className="oc-item-qty">จำนวน: x{s.quantity || 1}</div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>ไม่มีข้อมูลสินค้า</p>
            )}

            {sizeDataList.length > 3 && (
                <button className="oc-expand-btn" onClick={() => setExpanded(!expanded)}>
                    {expanded ? "▲ ย่อรายการ" : `▼ ดูทั้งหมด (${sizeDataList.length})`}
                </button>
            )}
        </div>
    );
};

export default function OrderCard({
    order,
    handleEditOrder,
    handleCheckOrder,
    setPreviewSlip,
    handleDeleteOrder
}) {
    const getStatusColor = (status) => {
        switch (status) {
            case 0: return "status-0";
            case 1: return "status-1";
            case 2: return "status-2";
            case 3: return "status-3";
            default: return "status-0";
        }
    };

    return (
        <div className="oc-container">
            {/* 🌟 Header: รหัสออเดอร์, วันที่, สถานะ */}
            <div className="oc-header">
                <div className="oc-id-date">
                    <h4>ออเดอร์ #{order.order_id}</h4>
                    <span className="oc-date">
                        <Calendar size={14} /> 
                        {new Date(order.create_at).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                </div>
                <select
                    className={`oc-status-select ${getStatusColor(order.received)}`}
                    value={order.received}
                    onChange={(e) => handleCheckOrder(order.order_id, parseInt(e.target.value))}
                >
                    <option value={0}>รอยืนยันการสั่งซื้อ</option>
                    <option value={1}>รอจัดส่ง</option>
                    <option value={2}>กำลังจัดส่ง</option>
                    <option value={3}>จัดส่งแล้ว (สำเร็จ)</option>
                </select>
            </div>

            {/* 🌟 Body: ข้อมูลลูกค้า & ข้อมูลสินค้า */}
            <div className="oc-body">
                
                {/* ฝั่งซ้าย: ข้อมูลลูกค้า */}
                <div className="oc-customer-info">
                    <h4 className="oc-section-title">
                        <User size={18} /> ข้อมูลลูกค้าและจัดส่ง
                    </h4>
                    
                    <div className="oc-customer-detail">
                        <IdCard size={16} />
                        <span><strong>รหัส/เบอร์อ้างอิง:</strong> {order.user_id}</span>
                    </div>
                    
                    <div className="oc-customer-detail">
                        <User size={16} />
                        <span><strong>ชื่อผู้รับ:</strong> {order.first_name} {order.last_name}</span>
                    </div>

                    <div className="oc-customer-detail">
                        <Phone size={16} />
                        <span><strong>เบอร์โทร:</strong> {order.phone}</span>
                    </div>

                    {order.address && (
                        <div className="oc-customer-detail">
                            <MapPin size={16} />
                            <span><strong>ที่อยู่:</strong> {order.address} อ.{order.city} จ.{order.state} {order.postcode}</span>
                        </div>
                    )}

                    <div className="oc-customer-detail">
                        <ShoppingBag size={16} />
                        <span><strong>แคมเปญ:</strong> {order.shop_title || "ไม่ระบุ"}</span>
                    </div>
                </div>

                {/* ฝั่งขวา: รายการสินค้า และยอดเงิน */}
                <div className="oc-item-row">
                    <OrderItemList items={order.items} />

                    <div className="oc-summary-box">
                        <div className="oc-total-price">
                            ยอดสุทธิ: ฿{order.total_price.toLocaleString()}
                        </div>
                        
                        {order.slip_path && (
                            <div 
                                className="oc-slip-btn"
                                onClick={() => setPreviewSlip(order.slip_path.startsWith("http") ? order.slip_path : `${selectServer()}${order.slip_path}`)}
                            >
                                <ImageIcon size={16} /> ดูสลิป
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* 🌟 Footer: ปุ่มจัดการ */}
            <div className="oc-footer">
                <button className="oc-btn oc-btn-delete" onClick={() => handleDeleteOrder(order.order_id)}>
                    <Trash2 size={16} /> ลบ
                </button>
                <button className="oc-btn oc-btn-edit" onClick={() => handleEditOrder(order)}>
                    <Pencil size={16} /> แก้ไขข้อมูล
                </button>
            </div>
        </div>
    );
}