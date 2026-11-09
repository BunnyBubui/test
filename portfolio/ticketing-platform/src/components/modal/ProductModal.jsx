// ProductModal.jsx
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { showAlert } from "../ui/Alert"; // ปรับ path ให้ตรงกับโปรเจกต์ของคุณ
import "../../styles/modal/ProductModal.css";

const ProductModal = ({ product, onClose, onConfirm, setZoomedImage }) => {
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedShirts, setSelectedShirts] = useState({});
  const [activeImageIndices, setActiveImageIndices] = useState({});
  const [setCount, setSetCount] = useState(1);

  if (!product) return null;

  const handleSizeSelect = (partId, sizeCode) => {
    setSelectedSizes((prev) => ({ ...prev, [partId]: sizeCode }));
  };

  const handleShirtSelect = (partId, shirt, index) => {
    setSelectedShirts((prev) => ({ ...prev, [partId]: shirt }));
    setActiveImageIndices((prev) => ({ ...prev, [partId]: index }));

    const carousel = document.getElementById(`carousel-${partId}`);
    if (carousel) {
      carousel.scrollTo({ left: carousel.clientWidth * index, behavior: "smooth" });
    }
  };

  const handleImageScroll = (e, partId, part) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const newIndex = Math.round(scrollLeft / width);

    if (activeImageIndices[partId] !== newIndex) {
      setActiveImageIndices((prev) => ({ ...prev, [partId]: newIndex }));
      if (part.shirts && part.shirts[newIndex]) {
        setSelectedShirts((prev) => ({ ...prev, [partId]: part.shirts[newIndex] }));
      }
    }
  };

  const getSizeDetail = (part, sizeCode) => {
    const found = part.sizes.find((s) => s.size === sizeCode);
    if (!found) return "";
    let text = "";
    if (found.chest > 0) text += `หน้าอก ${found.chest} `;
    if (found.length > 0) text += ` ยาว ${found.length} `;
    if (found.arm > 0) text += ` แขน ${found.arm}`;
    return text;
  };

  const handleConfirm = async () => {
    const allSelected = product.parts.every(
      (p) => selectedSizes[p.id] && selectedShirts[p.id]
    );

    if (!allSelected) {
      await showAlert("กรุณาเลือกสีเสื้อและไซส์ให้ครบก่อนเพิ่มลงตะกร้า");
      return;
    }

    const detailedSelections = product.parts.map((p) => ({
      partId: p.id,
      partName: p.name,
      partPictures: p.pictures,
      selectedShirt: selectedShirts[p.id],
      selectedSize: selectedSizes[p.id],
    }));

    onConfirm({
      selections: detailedSelections,
      quantity: setCount,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{product.name}</h3>

        {product.parts.map((part) => {
          const imagesToShow = part.pictures?.length > 0 ? part.pictures : [product.picture];
          const currentIndex = activeImageIndices[part.id] || 0;

          return (
            <div key={part.id} className="promo-item">
              <p className="part-title">{part.name}</p>

              <div className="slider-wrapper">
                <div
                  className="preview-carousel"
                  id={`carousel-${part.id}`}
                  onScroll={(e) => handleImageScroll(e, part.id, part)}
                >
                  {imagesToShow.map((pic, idx) => (
                    <div key={idx} className="carousel-slide" onClick={() => setZoomedImage(pic || product.picture)}>
                      <img src={pic || product.picture} alt={`preview-${idx}`} />
                      <div className="zoom-hint"><ZoomIn size={16} /> ซูมดูรูป</div>
                    </div>
                  ))}
                </div>

                {imagesToShow.length > 1 && (
                  <div className="carousel-dots">
                    {imagesToShow.map((_, idx) => (
                      <span key={idx} className={`dot ${currentIndex === idx ? "active" : ""}`} />
                    ))}
                  </div>
                )}
              </div>

              <div className="shirt-list">
                {part.shirts.map((color, idx) => (
                  <button
                    key={color}
                    className={`shirt-btn ${selectedShirts[part.id] === color ? "active" : ""}`}
                    onClick={() => handleShirtSelect(part.id, color, idx)}
                  >
                    {color}
                  </button>
                ))}
              </div>

              <div className="size-list">
                {part.sizes.map((s) => (
                  <button
                    key={s.size}
                    className={`size-btn ${selectedSizes[part.id] === s.size ? "active" : ""}`}
                    onClick={() => handleSizeSelect(part.id, s.size)}
                  >
                    {s.size}
                  </button>
                ))}
              </div>

              <div className="size-show">
                {selectedSizes[part.id] ? (
                  <p className="size-info">{getSizeDetail(part, selectedSizes[part.id])}</p>
                ) : (
                  <p className="size-placeholder">เลือกไซส์เพื่อดูขนาด</p>
                )}
              </div>
            </div>
          );
        })}

        <div className="set-count">
          <p>จำนวนชุด</p>
          <input
            type="number"
            min="1"
            value={setCount}
            onChange={(e) => setSetCount(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>ยกเลิก</button>
          <button className="confirm" onClick={handleConfirm}>เพิ่มลงตะกร้า</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;