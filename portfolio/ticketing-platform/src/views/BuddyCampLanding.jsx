import React, { useEffect, useState, useRef } from "react";
import "../styles/views/BuddyCampLanding.css";
import { MapPin, Ticket, AlertCircle, Clock } from "lucide-react";
import GoTo from "../components/button/GoTo";

const BuddyCampLanding = () => {
    const [activeTextIndex, setActiveTextIndex] = useState(0);
    const [doorProgress, setDoorProgress] = useState(0);
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [activeGoTo, setActiveGoTo] = useState(false);
    
    // 🌟 1. เพิ่ม State เพื่อดักว่า "ถึงหน้า Shop หรือยัง"
    const [reachedShop, setReachedShop] = useState(false); 

    const [artistScrollProgress, setArtistScrollProgress] = useState(0);

    const heroRef = useRef(null);
    const mapRef = useRef(null);
    const doorRef = useRef(null);
    const artistWrapperRef = useRef(null);
    
    // 🌟 2. เพิ่ม Ref เพื่อเอาไปแปะไว้ที่โซนร้านค้า
    const shopRef = useRef(null); 

    const heroTexts = [
        "จวนกันบัดดี้ 2",
        "“ทั้งแร๊ป ทั้งป๊อบร๊อกและม่วนจอย”",
        "ชวนเพื่อนพ้องยกก๊วน มาคอนเสิร์ตริมเล สไตล์ชิคชิค",
        "สัมผัสบรรยากาศตะวันลับขอบฟ้า คลื่นสาดซัดกระทบฝั่ง",
        "มีความสุขอย่างอิสระกับวิวสวนสน",
        "คุ้มค่าประทับใจ สร้างรอยยิ้ม เสียงหัวเราะ สนุกครบรสไปด้วยกัน !"
    ];

    const artistData = [
        { band: "Indigo", name: "บลู และสมาชิก", time: "17.30 น.", photo: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png" },
        { band: "The Studio Project", name: "ศิลปินแนวอินดี้ร็อก", time: "19.00 น.", photo: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png" },
        { band: "น้ำแข็ง ทิพวรรณ", name: "น้ำแข็ง ทิพวรรณ", time: "20.30 น.", photo: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png" },
        { band: "P-HOT", name: "ปอนด์ P-HOT", time: "22.00 น.", photo: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png" },
        { band: "F.HERO", name: "กอล์ฟ ฟักกลิ้งฮีโร่", time: "23.30 น.", photo: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;

            // 1. Hero Text Control
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - windowHeight)));
                setActiveTextIndex(Math.floor(progress * heroTexts.length));
            }

            // 2. Map Visibility
            if (mapRef.current) {
                const rect = mapRef.current.getBoundingClientRect();
                if (rect.top < windowHeight * 0.8) mapRef.current.classList.add('visible');
            }

            // 3. Door Control
            if (doorRef.current) {
                const rect = doorRef.current.getBoundingClientRect();
                const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - windowHeight)));
                setDoorProgress(progress);
            }

            // 4. Artist Horizontal Scroll Logic
            if (artistWrapperRef.current) {
                const rect = artistWrapperRef.current.getBoundingClientRect();
                const maxScroll = rect.height - windowHeight;
                const currentScroll = -rect.top;
                const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));
                setArtistScrollProgress(progress);
            }

            // 🌟 3. ตรวจจับการมองเห็นโซนร้านค้า
            if (shopRef.current) {
                const rect = shopRef.current.getBoundingClientRect();
                // ถ้ายอดกล่องร้านค้าโผล่ขึ้นมาบนจอเกิน 90% (หรือผู้ใช้กดวาร์ปจนจอเลื่อนมาถึงตรงนี้)
                if (rect.top <= windowHeight * 0.9) {
                    setReachedShop(true);
                } else {
                    setReachedShop(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [heroTexts.length]);

    const flashOpacity = doorProgress > 0.8 && doorProgress < 0.95 ? (doorProgress - 0.8) * 6 : 0;
    
    // 🌟 4. อัปเดตเงื่อนไขการโชว์/ซ่อนปุ่ม
    useEffect(() => {
        // เงื่อนไข: พ้นประโยคแรก + ศิลปินยังไม่สุด + "และต้องยังไม่ถึงโซนร้านค้า (!reachedShop)"
        if (activeTextIndex > 0 && artistScrollProgress < 0.95 && !reachedShop) {
            setActiveGoTo(true);
        } else {
            setActiveGoTo(false); // ซ่อนปุ่มทันที
        }
    }, [activeTextIndex, artistScrollProgress, reachedShop]);

    return (
        <div className="bc-landing-container">
            <div className={`bc-floating-goto ${activeGoTo ? "show" : "hide"}`}>
                <GoTo onGoToShop={() => setIsShopOpen(true)} />
            </div>

            <div className="bc-hero-wrapper" ref={heroRef}>
                <div className="bc-hero-sticky">
                    <div className="bc-hero-bg"></div>
                    <div className="bc-hero-content">
                        {heroTexts.map((text, index) => (
                            <p key={index} className={`bc-scroll-text ${index === activeTextIndex ? "active" : index < activeTextIndex ? "past" : ""}`}>
                                {index === 0 ? <span className="text-gold">{text}</span> : text}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── 2. MAP & DATE ─── */}
            <div className="bc-map-section">
                <div className="bc-map-card" ref={mapRef}>
                    <h2 style={{ fontSize: '2rem', color: '#fbbf24', marginBottom: '10px' }}>18 กรกฎาคม 2569</h2>
                    <p style={{ fontSize: '1.2rem' }}>
                        <MapPin size={20} style={{ display: 'inline', marginRight: '5px' }} />
                        ริมชายหาดบ่อนนท์ อำเภอท่าศาลา จังหวัดนครศรีธรรมราช
                    </p>
                    <iframe
                        className="bc-map-iframe"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15783.562141519702!2d99.9329!3d8.6753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3053bb123456789%3A0xabcdef123456789!2z4Lir4Liy4LiU4Lia4LmI4Lit4LiZ4LiZ4LiX4LmM!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Map หาดบ่อนนท์"
                    ></iframe>
                </div>
            </div>

            {/* ─── 3. SLIDING DOOR ─── */}
            <div className="bc-door-wrapper" ref={doorRef}>
                <div className="bc-door-sticky">
                    <div className="bc-artists-group-bg" style={{ opacity: doorProgress / 5 }}></div>
                    <div className="bc-flash-overlay" style={{ opacity: flashOpacity, color: "red" }}></div>
                    <div className="bc-door-panel" style={{ transform: `translateX(-${doorProgress * 100}%)` }}>
                        <h1 className="bc-door-text">ประตูเปิด : 16.00 น.</h1>
                    </div>
                    <div
                        className="bc-door-text-last"
                        style={{
                            transform: `scale(${doorProgress * 2})`,
                            backgroundImage: `url("/pictures/Banner01.webp")`
                        }}
                    >
                        เตรียมพบกับ
                    </div>
                </div>
            </div>

            {/* ─── 4. ARTIST HORIZONTAL PINNED SCROLL ─── */}
            <div
                className="bc-artist-scroll-wrapper"
                ref={artistWrapperRef}
                style={{ height: `${artistData.length * 100}vh` }}
            >
                <div className="bc-artist-scroll-sticky">
                    <h2 className="bc-lineup-title">LINE UP ARTISTS</h2>

                    <div
                        className="bc-artist-horizontal-track"
                        style={{
                            width: `${artistData.length * 100}vw`,
                            transform: `translateX(calc(-${artistScrollProgress * (artistData.length - 1)} * 100vw))`
                        }}
                    >
                        {artistData.map((artist, index) => (
                            <div key={index} className="bc-artist-panel">
                                <div className="bc-artist-photo-large">
                                    <div className="bc-artist-aura"></div>
                                    <img src={artist.photo} alt={artist.band} />
                                </div>
                                <div className="bc-artist-info-right">
                                    <h3 className="bc-band-name-large">{artist.band}</h3>
                                    <p className="bc-member-name-large">{artist.name}</p>
                                    <div className="bc-performance-time-large">
                                        <Clock size={24} style={{ marginRight: '10px' }} />
                                        Show Time: {artist.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── 5. SHOP TRANSITION ─── */}
            {/* 🌟 5. ผูก ref={shopRef} เข้ากับโซนนี้ ถ้าระบบเห็นกล่องนี้ปุ่มจะดับทันที */}
            <div className="bc-shop-trigger" ref={shopRef}>
                <>
                    <h2 style={{ marginBottom: '2rem' }}>สุดคุ้ม! เศรษฐกิจไม่ดีแต่มีโปรดีดีให้ชาวบัดดี้</h2>
                </>
                <h2 style={{ color: '#fbbf24' }}>ยินดีต้อนรับสู่ร้านค้า</h2>
            </div>

            {/* ─── 6. SHOP DETAILS (TICKET PRICES) ─── */}
            <div className={`bc-shop-container ${isShopOpen ? 'open' : ''}`}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2>แพ็กเกจบัตรสุดคุ้ม “ทั้งแร๊ป ทั้งป๊อบร๊อก และม่วนจอย”</h2>
                </div>

                <div className="bc-ticket-grid">
                    <div className="bc-ticket-box promo">
                        <p className="bc-ticket-date">9 - 23 พฤษภาคม 2569</p>
                        <h3>Early Bird</h3>
                        <p className="bc-ticket-price">399 ฿</p>
                        <p style={{ textDecoration: 'line-through', color: '#94a3b8' }}>ปกติ 599 ฿</p>
                    </div>
                    <div className="bc-ticket-box promo">
                        <p className="bc-ticket-date">9 - 23 พฤษภาคม 2569</p>
                        <h3>โปรก๊วนบัดดี้ (6 คน)</h3>
                        <p className="bc-ticket-price">2,000 ฿</p>
                        <p style={{ textDecoration: 'line-through', color: '#94a3b8' }}>ปกติ 3,594 ฿</p>
                    </div>
                    <div className="bc-ticket-box promo">
                        <p className="bc-ticket-date">24 พ.ค. - 20 มิ.ย. 2569</p>
                        <h3>โปรบัดดี้ (ซื้อคู่)</h3>
                        <p className="bc-ticket-price">1,000 ฿</p>
                        <p style={{ textDecoration: 'line-through', color: '#94a3b8' }}>ปกติ 1,198 ฿</p>
                    </div>
                    <div className="bc-ticket-box promo">
                        <p className="bc-ticket-date">24 พ.ค. - 20 มิ.ย. 2569</p>
                        <h3>โปรฉายเดี่ยว</h3>
                        <p className="bc-ticket-price">559 ฿</p>
                        <p style={{ textDecoration: 'line-through', color: '#94a3b8' }}>ปกติ 599 ฿</p>
                    </div>
                    <div className="bc-ticket-box">
                        <p className="bc-ticket-date">21 มิ.ย. - 17 ก.ค. 2569</p>
                        <h3>บัตรราคาปกติ</h3>
                        <p className="bc-ticket-price">599 ฿</p>
                    </div>
                    <div className="bc-ticket-box" style={{ borderStyle: 'dashed' }}>
                        <p className="bc-ticket-date">18 กรกฎาคม 2569</p>
                        <h3>โปรหมดก็ยังคุ้ม! (หน้างาน)</h3>
                        <p className="bc-ticket-price">690 ฿</p>
                    </div>
                </div>

                {/* ─── RULES ─── */}
                <div className="bc-rules-box">
                    <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                        <AlertCircle style={{ marginRight: '10px' }} /> กติกาและข้อกำหนด
                    </h3>
                    <ul style={{ lineHeight: '1.8', color: '#cbd5e1', paddingLeft: '1.5rem' }}>
                        <li><strong>เด็กส่วนสูงไม่เกิน 110 cm เข้าฟรี!</strong> (ยืนยันด้วยสิทธิ์ผู้ปกครองที่ซื้อบัตร 1 คน / 1 สิทธิ์)</li>
                        <br />
                        <li style={{ color: '#34d399', listStyle: 'none', marginLeft: '-1.5rem', fontWeight: 'bold' }}>
                            บอกบัดดี้เลย…ว่าสิ่งนี้นำเข้าได้ !
                        </li>
                        <li>👍 เก้าอี้แคมป์</li>
                        <li>👍 แก้วเยติ (แก้วเปล่าเท่านั้น)</li>
                        <li>👍 โต๊ะแคมป์ (ความยาวไม่เกิน 90 cm)</li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default BuddyCampLanding;