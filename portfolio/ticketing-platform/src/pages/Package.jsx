import { HelmetProvider, Helmet } from "react-helmet-async";
import Footerbox from "../components/construct/Footer";
import Package from "../views/Package";
import ScrollToTop from "../components/ui/Scoll-Up";

function Index() {
  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>ตรวจสอบสถานะบัตร Buddy Music</title>

        <meta
          name="description"
          content="ตรวจสอบสถานะการจองตั๋วเข้างาน Buddy Music (บัดดี้มิวสิค) ค้นหาด้วยเบอร์โทรศัพท์ ดู QR Code และ Barcode สำหรับสแกนเข้างานได้อย่างรวดเร็ว"
        />
        <meta
          name="keywords"
          content="ตรวจสอบออเดอร์, เช็คตั๋ว, สถานะบัตร, Buddy Music, บัดดี้มิวสิค, ท่าศาลาบ้านเรา, thasalabaanrao, นครศรีธรรมราช"
        />
        <meta name="author" content="Thasala Baan Rao Team" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="ตรวจสอบสถานะบัตร Buddy Music | ท่าศาลาบ้านเรา" />
        <meta
          property="og:description"
          content="ตรวจสอบสถานะการจองตั๋วเข้างาน Buddy Music ค้นหาด้วยเบอร์โทรศัพท์ พร้อมเปิด QR Code สำหรับเช็คอินเข้างาน"
        />
        <meta
          property="og:image"
          content="http://localhost:3000/pictures/Banner01.jpg"
        />
        <meta property="og:url" content="http://localhost:3000/package" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ตรวจสอบสถานะบัตร Buddy Music | ท่าศาลาบ้านเรา" />
        <meta
          name="twitter:description"
          content="ตรวจสอบสถานะการจองตั๋วเข้างาน Buddy Music ค้นหาด้วยเบอร์โทรศัพท์ พร้อมเปิด QR Code สำหรับเช็คอินเข้างาน"
        />
        <meta
          name="twitter:image"
          content="http://localhost:3000/pictures/Banner01.jpg"
        />
      </Helmet>

      <Package />
      <Footerbox />
    </>
  );
}

export default Index;