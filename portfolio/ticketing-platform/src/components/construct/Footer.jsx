import { useState } from "react";
import { Copy, Check, Facebook, MessageCircle, Phone } from "lucide-react";
import "../../styles/construct/Footer.css";
import { copyToClipboard } from "../ui/Clipboard";
import { faLine, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footerbox({ marginBottom }) {
  const [year] = useState(new Date().getFullYear());
  const [copied, setCopied] = useState(false);
  const phoneNumber = "0934459287";

  // ฟังก์ชันสำหรับคัดลอกเบอร์โทร
  const handleCopyPhone = async () => {
    const isSuccess = await copyToClipboard(phoneNumber);

    if (isSuccess) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // แจ้งเตือนถ้าระบบมือถือของลูกค้าไม่อนุญาตจริงๆ
      alert("ขออภัยระบบไม่สามารถคัดลอกเบอร์อัตโนมัตได้");
    }
  };

  return (
    <>
      <footer className="footer-wrap" style={{ marginBottom: marginBottom }}>
        <div className="footer-dots" />
        <div className="footer-orb footer-orb-1" />
        <div className="footer-orb footer-orb-2" />

        <div className="footer-inner">
          {/* Org name link */}
          <a
            href="https://www.facebook.com/profile.php?id=100078155573991"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <h3 className="footer-title">ท่าศาลาบ้านเรา</h3>
            <span className="footer-link-underline" />
          </a>

          {/* Decorative divider */}
          <div className="footer-divider">
            <div className="footer-divider-line" />
            <div className="footer-divider-gem" />
            <div className="footer-divider-line" />
          </div>

          {/* Address */}
          <p className="footer-address">
            240/18 ม.1 <br />ตำบล ท่าศาลา อำเภอ ท่าศาลา <br />จังหวัดนครศรีธรรมราช 80160
          </p>

          {/* Contact & Socials Group */}
          <div className="footer-contact-group">
            {/* Contact chip (Click to Copy) */}
            <div
              className={`footer-contact ${copied ? "copied" : ""}`}
              onClick={handleCopyPhone}
              title="คลิกเพื่อคัดลอกเบอร์โทร"
            >
              <Phone size={18} />
              <span>{phoneNumber}</span>
              {copied ? <Check size={16} color="green" /> : <Copy size={16} />}
            </div>

            {/* Social Links */}
            <div className="footer-socials">
              {/* ใส่ Link Facebook ของคุณตรง href */}
              <a
                href="https://www.facebook.com/profile.php?id=100078155573991"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook"
                title="ติดตามเราบน Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>

              <a
                href="https://lin.ee/tcWxcLF"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn line"
                title="ติดตามเราบน Line"
              >
                <FontAwesomeIcon icon={faLine} />
              </a>
            </div>
          </div>

          {/* Author */}
          <p className="footer-author">
            <span>Author:</span> 
            <a href="https://www.facebook.com/banyapon.chaithong" target="__blank"> Banyapon Chaithong</a> |&nbsp;
            Copyright &copy; {year} &nbsp; ท่าศาลาบ้านเรา
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footerbox;