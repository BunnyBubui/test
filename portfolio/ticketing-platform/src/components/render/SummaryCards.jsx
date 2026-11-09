import { ShoppingBag, CheckCircle, Clock, Coins, Package, Truck, FileText } from "lucide-react";

export default function SummaryCards({ totalCount, summary }) {
  const getTotalPrice = () => {
    // ดึงค่ายอดรวมจาก summary ที่ส่งมา ถ้าไม่มีให้เป็น 0
    const n = Number(summary?.summary_total || 0);
    return n.toLocaleString("th-TH");
  }

  return (
    <div className="admin-card-summary">
      {/* 1. ออเดอร์ทั้งหมด */}
      <div className="admin-summary-card">
        <ShoppingBag size={30} color="#3b82f6" />
        <div>
          <h4>ออเดอร์ทั้งหมด</h4>
          <p>{totalCount}</p>
        </div>
      </div>

      {/* 2. สถานะ: รอยืนยัน (0) */}
      <div className="admin-summary-card">
        <FileText size={30} color="#d97706" />
        <div>
          <h4>รอยืนยัน</h4>
          <p>{summary?.status_0_pending || 0}</p>
        </div>
      </div>

      {/* 3. สถานะ: รอจัดส่ง (1) */}
      <div className="admin-summary-card">
        <Package size={30} color="#2563eb" />
        <div>
          <h4>รอจัดส่ง</h4>
          <p>{summary?.status_1_waiting_ship || 0}</p>
        </div>
      </div>

      {/* 4. สถานะ: กำลังจัดส่ง (2) */}
      <div className="admin-summary-card">
        <Truck size={30} color="#7c3aed" />
        <div>
          <h4>กำลังจัดส่ง</h4>
          <p>{summary?.status_2_shipping || 0}</p>
        </div>
      </div>

      {/* 5. สถานะ: จัดส่งแล้ว (3) */}
      <div className="admin-summary-card">
        <CheckCircle size={30} color="#16a34a" />
        <div>
          <h4>จัดส่งแล้ว</h4>
          <p>{summary?.status_3_completed || 0}</p>
        </div>
      </div>

      {/* 6. ยอดขายรวม */}
      <div className="admin-summary-card">
        <Coins size={30} color="#ea580c" />
        <div>
          <h4>ยอดขายรวม</h4>
          <p>{getTotalPrice()} ฿</p>
        </div>
      </div>
    </div>
  );
}