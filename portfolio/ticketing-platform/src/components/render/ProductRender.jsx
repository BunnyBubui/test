// src/components/render/ProductRender.jsx
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useProducts } from "../../hooks/useProducts";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { showNotification } from "../ui/Alert";
import { selectServer } from "../../utils/Server";
import SectionHeader from "../header/SectionHeader";
import "../../styles/render/ProductRender.css";

import ProductCard from "../section/ProductCard";
import ImageZoomOverlay from "../modal/ImageZoomOverlay";
import CheckoutModal from "../modal/CheckoutModal";
import ResumePaymentBanner from "../ui/ResumePaymentBanner";

const Products = ({ shopId = null, title = "รายการสินค้า", data, isModalOpen }) => {
  const { products } = useProducts();
  const [promos, setPromos] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState(null);

  const [hasPendingOrder, setHasPendingOrder] = useState(false);

  const checkPendingOrder = () => {
    const orderId = localStorage.getItem("pendingOrderId");
    const step = localStorage.getItem("checkoutStep");

    // ใช้ == 2 เพื่อรองรับทั้งตัวเลข 2 และ String "2"
    if (orderId && step == 2) {
      setHasPendingOrder(true);
    } else {
      setHasPendingOrder(false);
    }
  };

  useScrollAnimation();
  useEffect(() => {
    checkPendingOrder();
  }, []);

  useEffect(() => {
    checkPendingOrder();

    const fetchPromos = async () => {
      try {
        const promoRes = await fetch(`${selectServer()}/api/check/promos`);
        const promoData = await promoRes.json();
        if (promoRes.ok && promoData.data) {
          setPromos(promoData.data);
        }
      } catch (err) {
        console.error("Error fetching promos:", err);
      }
    };

    fetchPromos();
  }, []);

  const shopsList = data?.data || data || [];
  const isAnyPromoActive = promos.some((p) => p.active);

  // 🌟 1. แก้ Filter ให้โชว์ "ทุกชิ้น" ไม่มีการซ่อนสินค้าแล้ว
  const displayProducts = products.filter((item) => {
    if (shopId && item.shopId !== shopId) return false;
    return true; // ปล่อยผ่านให้โชว์ทุกชิ้น!
  });

  const handleBuyNow = (product) => {
    const itemToBuy = {
      id: product.id,
      shopId: product.shopId || 1,
      name: product.name,
      type: product.type,
      selections: [],
      quantity: 1,
      price: product.price,
      total: product.price * 1,
      preorder: product.preorder,
    };

    const currentStep = localStorage.getItem("checkoutStep");
    const sessionData = localStorage.getItem("buddy_checkout_session");

    if (currentStep === "3" || (sessionData && JSON.parse(sessionData).step === 3)) {
      localStorage.removeItem("buddy_checkout_session");
      localStorage.removeItem("checkoutStep");
      localStorage.removeItem("pendingOrderId");
    }

    setDirectBuyItem(itemToBuy); // ตั้งค่าสินค้าใหม่
    localStorage.setItem("cart", JSON.stringify([itemToBuy])); // บันทึกลงตะกร้า
    setCheckoutOpen(true);
    if (typeof isModalOpen === 'function') isModalOpen(true);

    setHasPendingOrder(false);
    document.body.style.overflow = "hidden";
  };

  const closeCheckout = () => {
    const overlay = document.querySelector(".app-modal-overlay");
    if (overlay) overlay.classList.add("hide");
    setTimeout(() => {
      setCheckoutOpen(false);
      if (typeof isModalOpen === 'function') isModalOpen(false);

      setDirectBuyItem(null);
      document.body.style.overflow = "";
      setTimeout(() => {
        checkPendingOrder();
      }, 100);
    }, 300);
  };

  const handleResumePayment = () => {
    setTimeout(() => {
      setCheckoutOpen(true);
      if (typeof isModalOpen === 'function') isModalOpen(true);
      setHasPendingOrder(false);
      document.body.style.overflow = "hidden";
    }, 300);
  };

  const schemaItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": displayProducts.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `http://localhost:3000/#product-${item.id}`,
      "name": item.name,
      "image": item.picture,
    }))
  };

  return (
    <div className="products-container">
      {displayProducts.length > 0 && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schemaItemList)}</script>
        </Helmet>
      )}

      <SectionHeader title={title} hideShopCount={true} />

      {isAnyPromoActive &&
        <div className="promo-content">
          <div className="promo-banner">
            🌟 ช่วงโปรโมชั่นพิเศษ
          </div>
        </div>}

      <div className="body-items">
        {displayProducts.map((item, index) => {
          const shopObj = shopsList.find((s) => s.shop_id === item.shopId);
          const currentSaleStatus = shopObj?.sale_status || 'waiting';

          const promoObj = promos.find((p) => p.shop_id === item.shopId);
          const currentPromoActive = promoObj?.active || false;

          // 🌟 2. เช็คเงื่อนไขและเตรียมข้อความแจ้งเตือนเมื่อซื้อไม่ได้
          let isPurchasable = true;
          let disabledReason = "";

          if (item.sold_out) {
            isPurchasable = false;
            disabledReason = "ตั๋วหมดแล้ว (SOLD OUT) ❌";
          } else if (currentSaleStatus === 'waiting') {
            isPurchasable = false;
            disabledReason = "บัตรนี้ยังไม่เปิดให้สั่งซื้อ";
          } else if (currentSaleStatus === 'closed') {
            isPurchasable = false;
            disabledReason = "บัตรนี้ปิดการขายไปแล้ว ❌";
          } else if (item.type === "P" && !currentPromoActive) {
            isPurchasable = false;
            disabledReason = "หมดเขตหรือยังไม่ถึงเวลาซื้อโปรโมชั่นนี้";
          } else if (item.type === "N" && currentPromoActive) {
            isPurchasable = false;
            disabledReason = "บัตรราคาปกติจะเปิดขายหลังจากช่วงโปรโมชั่นจบลง";
          }

          return (
            <ProductCard
              key={item.id}
              item={item}
              promoActive={currentPromoActive}
              saleStatus={currentSaleStatus}
              isPurchasable={isPurchasable}
              disabledReason={disabledReason} // 🌟 3. ส่งข้อความไปให้การ์ด
              onBuyNow={handleBuyNow}
              delay={index + 1 <= 5 ? index + 1 : 5}
              isModalOpen={isCheckoutOpen}
            />
          );
        })}
      </div>

      <ImageZoomOverlay image={zoomedImage} onClose={() => setZoomedImage(null)} />

      {!isCheckoutOpen && hasPendingOrder && (
        <ResumePaymentBanner onResume={handleResumePayment} />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={closeCheckout}
          cart={directBuyItem ? [directBuyItem] : []}
          totalPrice={directBuyItem ? directBuyItem.total : 0}

          onCheckoutSuccess={() => {
            showNotification("ทำรายการสั่งซื้อสำเร็จ!", "success");
            checkPendingOrder();
          }}
        />
      )}
    </div>
  );
};

export default Products;