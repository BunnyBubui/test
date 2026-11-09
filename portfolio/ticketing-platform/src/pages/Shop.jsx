import { HelmetProvider, Helmet } from "react-helmet-async";
import Footerbox from "../components/construct/Footer";
import Bodybox from "../views/Shop";
import ScrollToTop from "../components/ui/Scoll-Up";

function Shop() {
  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>จองบัตร Buddy Music | ท่าศาลาบ้านเรา</title>

        <meta
          name="description"
          content="ระบบจองบัตรเข้างาน Buddy Music โดย ท่าศาลาบ้านเรา สั่งซื้อตั๋ว เช็คสถานะบัตร พร้อมระบบสแกน QR Code เช็คอินเข้างานได้ง่ายๆ"
        />
        <meta
          name="keywords"
          content="Buddy Music, จองบัตร, ตั๋วเข้างาน, ซื้อตั๋ว, ท่าศาลาบ้านเรา, thasalabaanrao, นครศรีธรรมราช, แคมป์ปิ้ง, คอนเสิร์ต"
        />
        <meta name="author" content="Thasala Baan Rao Team" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="จองบัตร Buddy Music | ท่าศาลาบ้านเรา" />
        <meta
          property="og:description"
          content="ระบบจองบัตรเข้างาน Buddy Music โดย ท่าศาลาบ้านเรา สั่งซื้อตั๋ว เช็คสถานะบัตร พร้อมระบบสแกน QR Code เช็คอินเข้างานได้ง่ายๆ"
        />
        {/* 🌟 เปลี่ยน url รูปภาพเป็น buddymusic */}
        <meta
          property="og:image"
          content="http://localhost:3000/pictures/Banner01.jpg"
        />
        {/* 🌟 เปลี่ยน url เว็บเป็น buddymusic */}
        <meta property="og:url" content="http://localhost:3000/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="จองบัตร Buddy Music | ท่าศาลาบ้านเรา" />
        <meta
          name="twitter:description"
          content="ระบบจองบัตรเข้างาน Buddy Music โดย ท่าศาลาบ้านเรา สั่งซื้อตั๋ว เช็คสถานะบัตร พร้อมระบบสแกน QR Code เช็คอินเข้างานได้ง่ายๆ"
        />
        <meta
          name="twitter:image"
          content="http://localhost:3000/pictures/Banner01.jpg"
        />
      </Helmet>

      <Bodybox />
      <Footerbox />
    </>
  );
}

export default Shop;