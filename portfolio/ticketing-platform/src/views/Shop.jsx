import { useState, useEffect } from "react";
import "../styles/views/Body.css";
import { Ticket, ChevronRight } from "lucide-react";
import Nav from "../components/header/Nav";
import Banner from "../components/section/Banner-Image";
import { showAlert } from "../components/ui/Alert";
import { selectServer } from "../utils/Server";
import Products from "../components/render/ProductRender";
import Body from "../components/construct/Body";
import DataError from "../components/ui/DataError";
import { useNavigate } from "react-router-dom";

import BuddyCampLanding from "./BuddyCampLanding";
const Shop = () => {
  const [productCount, setProductCount] = useState(0);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setProductCount(cart.length);
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch(`${selectServer()}/api/shop`);
        const data = await res.json();

        if (res.ok && data.data) {
          setShops(data);
        } else {
          await showAlert("⚠️ ไม่พบข้อมูลร้านค้า");
        }
      } catch {
        await showAlert("❌ โหลดข้อมูลร้านค้าไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <Body>
      <Nav updateCart={productCount} isShopOpen={true} />
      <section style={{marginTop: 50}} id="shop-trigger-section">
        <Banner
          images={[
            "/pictures/Banner01.jpg",
            "/pictures/Banner02.jpg",
          ]}
          isModalOpen={modalOpen}
        />
      </section>

      <div className="package-shortcut-container">
        <div className="package-shortcut-card" onClick={() => navigate('/package')}>
          <div className="package-icon-bg">
            <Ticket size={28} />
          </div>
          <div className="package-text-content">
            <h3>ตรวจสอบรายการสั่งซื้อ</h3>
            <p>คลิกเพื่อดูประวัติการสั่งจองและรหัสบัตรของคุณ</p>
          </div>
          <ChevronRight size={24} className="package-arrow" />
        </div>
      </div>

      <div className="content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>กำลังโหลดข้อมูล...</span>
          </div>
        ) : shops.length === 0 ? (
          <p className="empty-state"><DataError /></p>
        ) : (
          <>
            <Products title="รายการทั้งหมด" onCartUpdate={(count) => setProductCount(count)} data={shops} isModalOpen={setModalOpen} />
          </>
        )}
      </div>
    </Body>
  );
};

export default Shop;