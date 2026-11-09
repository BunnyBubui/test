import { Save, X, Edit3, Package } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import "../../styles/button/EditOrderModal.css"; // 🌟 Import CSS ตัวใหม่

export default function EditOrderModal({
    editingOrder,
    editForm,
    setEditForm,
    handleUpdateOrder,
    setEditingOrder,
}) {
    if (!editingOrder) return null;

    const { products } = useProducts();

    const findProduct = (itemName) => {
        return products.find((p) => p.name === itemName) || null;
    };

    const getAvailableShirts = (itemName, partIndex) => {
        const product = findProduct(itemName);
        if (!product) return [];
        const part = product.parts[partIndex];
        if (!part) return [];
        return part.shirts; 
    };

    const getAvailableSizes = (itemName, partIndex) => {
        const product = findProduct(itemName);
        if (!product) return [];
        const part = product.parts[partIndex];
        if (!part) return [];
        return part.sizes.map((s) => s.size);
    };

    return (
        <div className="eom-overlay" onClick={() => setEditingOrder(null)}>
            <div className="eom-box" onClick={(e) => e.stopPropagation()}>
                <h3>
                    <Edit3 size={24} /> แก้ไขข้อมูลออเดอร์ #{editingOrder.order_id}
                </h3>

                <form
                    className="eom-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateOrder(editingOrder.order_id);
                    }}
                >
                    <div className="eom-row-group">
                        <div className="eom-input-group">
                            <label>รหัสอ้างอิง (User ID)</label>
                            <input
                                type="text"
                                value={editForm.user_id}
                                onChange={(e) => setEditForm({ ...editForm, user_id: e.target.value })}
                            />
                        </div>
                        <div className="eom-input-group">
                            <label>เบอร์โทรศัพท์</label>
                            <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="eom-row-group">
                        <div className="eom-input-group">
                            <label>ชื่อผู้รับ</label>
                            <input
                                type="text"
                                value={editForm.first_name}
                                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                            />
                        </div>
                        <div className="eom-input-group">
                            <label>นามสกุล</label>
                            <input
                                type="text"
                                value={editForm.last_name}
                                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* 🌟 ส่วนที่เพิ่มใหม่: ที่อยู่จัดส่ง */}
                    <div className="eom-input-group">
                        <label>ที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน, ตำบล)</label>
                        <input
                            type="text"
                            value={editForm.address || ""}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            placeholder="เช่น 123/4 ม.5 ต.ท่าศาลา"
                        />
                    </div>

                    <div className="eom-row-group">
                        <div className="eom-input-group">
                            <label>จังหวัด</label>
                            <input
                                type="text"
                                value={editForm.state || ""}
                                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                            />
                        </div>
                        <div className="eom-input-group">
                            <label>อำเภอ / เขต</label>
                            <input
                                type="text"
                                value={editForm.city || ""}
                                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            />
                        </div>
                        <div className="eom-input-group" style={{ flex: "0.5" }}>
                            <label>รหัสไปรษณีย์</label>
                            <input
                                type="text"
                                value={editForm.postcode || ""}
                                onChange={(e) => setEditForm({ ...editForm, postcode: e.target.value })}
                                maxLength="5"
                            />
                        </div>
                    </div>

                    <div className="eom-input-group">
                        <label>ราคาสุทธิ (บาท)</label>
                        <input
                            type="number"
                            value={editForm.total_price}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                total_price: parseFloat(e.target.value) || 0,
                            })}
                        />
                    </div>

                    {/* แก้ไขรายการสินค้า */}
                    <h4 className="eom-section-title"><Package size={18} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} /> แก้ไขรายการสินค้า</h4>
                    
                    {editForm.items?.map((item, idx) => (
                        <div key={idx} className="eom-item-card">
                            <h4>{item.name}</h4>

                            {item.size.map((s, sizeIndex) => (
                                <div key={sizeIndex} className="eom-row-group" style={{ marginTop: 8 }}>
                                    <div className="eom-input-group">
                                        <label>ลาย / สี</label>
                                        <select
                                            value={s.selectedShirt}
                                            onChange={(e) => {
                                                const newItems = [...editForm.items];
                                                newItems[idx].size[sizeIndex].selectedShirt = e.target.value;
                                                setEditForm({ ...editForm, items: newItems });
                                            }}
                                        >
                                            {getAvailableShirts(item.name, sizeIndex).map((shirt) => (
                                                <option key={shirt} value={shirt}>{shirt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="eom-input-group" style={{ flex: "0.7" }}>
                                        <label>ไซส์</label>
                                        <select
                                            value={s.selectedSize}
                                            onChange={(e) => {
                                                const newItems = [...editForm.items];
                                                newItems[idx].size[sizeIndex].selectedSize = e.target.value;
                                                setEditForm({ ...editForm, items: newItems });
                                            }}
                                        >
                                            {getAvailableSizes(item.name, sizeIndex).map((size) => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="eom-input-group" style={{ flex: "0.5" }}>
                                        <label>จำนวน</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newItems = [...editForm.items];
                                                newItems[idx].quantity = parseInt(e.target.value) || 1;
                                                setEditForm({ ...editForm, items: newItems });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="eom-buttons">
                        <button type="button" className="eom-btn eom-btn-cancel" onClick={() => setEditingOrder(null)}>
                            <X size={18} /> ยกเลิก
                        </button>
                        <button type="submit" className="eom-btn eom-btn-save">
                            <Save size={18} /> บันทึกการเปลี่ยนแปลง
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}