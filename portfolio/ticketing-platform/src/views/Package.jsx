import { useState, useEffect } from "react";
import "../styles/views/Package.css";
import Nav from "../components/header/Nav";
import BackArrow from "../components/ui/BackArrow";
import Body from "../components/construct/Body";
import { showAlert, showLoading, hideLoading } from "../components/ui/Alert";
import { Truck, Search, ScanLine, ChevronRight, Package, IdCard } from "lucide-react";
import { selectServer } from "../utils/Server";
import html2canvas from "html2canvas";
import useScrollAnimation from "../hooks/useScrollAnimation";

import OrderCard from "../components/section/OrderCard";
import { ShowContact } from "../components/ui/Contact";

const PackagePage = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [savedId, setSavedId] = useState(null);
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const [orderCount, setOrderCount] = useState(0);

    useScrollAnimation();

    useEffect(() => {
        // 🌟 1. ปลดล็อกหน้าจอทุกอย่าง เผื่อค้างมาจากหน้าอื่น
        hideLoading();
        document.body.style.overflow = "auto";
        document.body.style.pointerEvents = "auto";

        // 🌟 2. โหลดเบอร์โทรจาก localStorage
        const savedStudentId = localStorage.getItem("studentId");
        if (savedStudentId) setSavedId(savedStudentId);

        // 🌟 3. เช็ค URL จากการสแกน QR Code
        const urlParams = new URLSearchParams(window.location.search);
        const searchFromUrl = urlParams.get("search");

        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
            // หน่วงเวลาให้ React วาดหน้าจอให้เสร็จก่อน ค่อยเรียกค้นหา
            setTimeout(() => {
                handleSearch(searchFromUrl);
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAutoFill = async () => {
        const confirm = await showAlert(`📘 ต้องการค้นหาด้วยเบอร์โทร ${savedId} ไหม`, { confirm: true });
        if (!confirm) return;
        setSearchTerm(savedId);
        handleSearch(savedId);
    };

    const handleSearch = async (overrideId) => {
        // 🌟 ดักจับ Event ป้องกัน Error ตอนสั่ง .trim()
        if (overrideId && typeof overrideId.preventDefault === 'function') {
            overrideId.preventDefault();
        }

        // ดึงข้อความมาใช้ค้นหา
        const id = (typeof overrideId === 'string' ? overrideId : searchTerm)?.trim();

        if (!id) {
            await showAlert("⚠️ กรุณากรอกเบอร์โทรศัพท์เพื่อค้นหา");
            return;
        }

        showLoading("กำลังค้นหารายการสั่งซื้อ...");

        try {
            const res = await fetch(`${selectServer()}/api/get-order/${id}`);
            const data = await res.json();

            if (res.ok && data.data && data.data.length > 0) {
                setOrders(data.data);
                setOrderCount(data.data.length);
                hideLoading(); // ✅ ปิดโหลดติ้งเมื่อทำเสร็จ
            } else {
                setOrders([]);
                setOrderCount(0);
                
                hideLoading();
                await showAlert(data.message || "ไม่พบข้อมูลคำสั่งซื้อ");
            }
        } catch (err) {
            console.error(err);
            // 🚨 สำคัญมาก: ปิดโหลดติ้งก่อนเรียก Alert
            hideLoading();
            await showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        }
    };

    return (
        <Body>
            <Nav updateCart={cartCount} isShopOpen={true} />
            <BackArrow />

            <div className="pa-root">
                {/* ─── Page Hero ─── */}
                <div className="pa-hero animate-fade-right">
                    <div className="pa-hero-badge delay-1 animate-fade-right">
                        <IdCard size={18} />
                        <span>เช็คบัตรบัดดี้แคมป์</span>
                    </div>
                    <h1 className="pa-hero-title delay-1 animate-fade-right">ตรวจสอบสถานะบัตร</h1>
                    <p className="pa-hero-sub delay-1 animate-fade-right">ค้นหาด้วยเบอร์โทรที่ใช้สั่งซื้อไว้</p>
                    <ShowContact />
                </div>

                {/* ─── Search ─── */}
                <div className="pa-search-wrap animate-fade-right">
                    <div className="pa-search-inner">
                        <ScanLine size={18} className="pa-search-icon" />
                        <input
                            type="tel"
                            placeholder="กรอกเบอร์โทรศัพท์"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <button className="pa-search-btn" onClick={() => handleSearch()}>
                            <Search size={16} />
                            <span>ค้นหา</span>
                        </button>
                    </div>
                </div>

                {/* ─── AutoFill ─── */}
                {savedId && !searchTerm && (
                    <div className="pa-recall" onClick={handleAutoFill}>
                        <div className="pa-recall-left">
                            <div className="pa-recall-dot" />
                            <div>
                                <p className="pa-recall-hint">ใช้เบอร์ที่บันทึกไว้</p>
                                <p className="pa-recall-num">{savedId}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="pa-recall-arrow" />
                    </div>
                )}

                {/* ─── States & Results ─── */}
                {loading ? (
                    <div className="pa-state delay-1 animate-fade-right">
                        <div className="pa-loader" />
                        <p>กำลังดึงข้อมูล…</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="pa-state pa-empty delay-1 animate-fade-right">
                        <div className="pa-empty-icon"><Package size={32} /></div>
                        <p className="pa-empty-title">ยังไม่มีรายการ</p>
                        <p className="pa-empty-sub">กรอกเบอร์โทรเพื่อเริ่มต้นการค้นหา</p>
                    </div>
                ) : (
                    <div className="pa-list">
                        <p>ค้นหาเจอ {orderCount} รายการ</p>
                        {orders.map((order, index) => (
                            <OrderCard
                                key={index}
                                order={order}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Body>
    );
};

export default PackagePage;