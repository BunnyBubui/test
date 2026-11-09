import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import '../../styles/header/Nav.css'
import { elements, topbar } from "../../data/NavbarData";

const Nav = ({ updateCart = 0, isCartOpen = true, isShopOpen = true }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // State สำหรับจัดการเมนูย่อยที่ถูกกางออก (Accordion)
    const [expandedMenu, setExpandedMenu] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleSubMenu = (id, e) => {
        e.stopPropagation();
        setExpandedMenu(expandedMenu === id ? null : id);
    };

    // ฟังก์ชันเช็คสถานะ Active
    const checkIsActive = (item) => {
        if (!item) return false;
        const currentPath = location.pathname.toLowerCase();

        if (item.link && item.link !== "/" && item.link !== "#") {
            const mainLink = item.link.toLowerCase();
            if (currentPath === mainLink || currentPath.startsWith(`${mainLink}/`)) {
                return true;
            }
        } else if (item.link === "/") {
            if (currentPath === "/") return true;
        }

        if (item.subItems && item.subItems.length > 0) {
            return item.subItems.some(sub => {
                if (!sub.link || sub.link === "/" || sub.link === "#") return false;
                const subLink = sub.link.toLowerCase();
                return currentPath === subLink || currentPath.startsWith(`${subLink}/`);
            });
        }

        return false;
    };

    const forceHamburgerMenu = isShopOpen;
    return (
        <>
            <div className={`top-bar ${isScrolled ? "scrolled" : ""}`}>
                <div className="topbar-right">
                    {topbar.map((i, index) => (
                        <button className="top-btn" key={i.id || index} onClick={() => navigate(i.link)}>
                            <i>{i.logo}</i>
                            <label>{i.title}</label>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`nav-logo-layer-outline ${isScrolled ? "scrolled" : ""}`}>
                <div className="nav-logo-layer-inner">
                    <div className={`nav-logo-layer ${isScrolled ? "scrolled" : ""}`}>
                        <div className="navbar-brand" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                            {/* 🌟 เปลี่ยนเป็น /pictures/Logo01.webp เพื่อให้เป็น Absolute Path */}
                            <img src="/pictures/Logo01.webp" alt="Logo" />
                        </div>
                    </div>
                </div>
            </div>

            <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
                <div className="navbar-inner">
                    <div className="nav-actions">

                        {/* 🌟 1. กลุ่มเมนู Desktop (จะถูกซ่อนถ้า forceHamburgerMenu เป็น true) */}
                        {!forceHamburgerMenu && (
                            <div className="desktop-text-menus">
                                {elements.map((item) => {
                                    if (item.id === 1 || item.id === 2) return null;

                                    const isActive = checkIsActive(item);

                                    return (
                                        <div
                                            className="nav-text-dropdown-wrap"
                                            key={item.id}
                                            onMouseEnter={() => setExpandedMenu(item.id)}
                                            onMouseLeave={() => setExpandedMenu(null)}
                                        >
                                            <div
                                                className={`nav-text-link ${isActive ? "active" : ""}`}
                                                onClick={() => navigate(item.link !== "#" ? item.link : "#")}
                                            >
                                                {item.title}
                                                {item.subItems && <ChevronDown size={14} className={`chevron-icon ${expandedMenu === item.id ? "rotate" : ""}`} />}
                                            </div>

                                            {item.subItems && (
                                                <div className={`desktop-sub-menu ${expandedMenu === item.id ? "show" : ""}`}>
                                                    {item.subItems.map((sub, idx) => (
                                                        <div key={idx} className={`sub-menu-item ${sub.isImportant && "highlight"}`} onClick={() => navigate(sub.link)}>
                                                            <i>
                                                                {sub.icon && sub.icon}
                                                            </i>
                                                            {sub.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 🌟 2. กลุ่มไอคอนหลัก (ตะกร้า, ร้านค้า) */}
                        {elements.map((item) => {
                            if (item.id !== 1 && item.id !== 2) return null;
                            if (!isCartOpen && item.id === 1) return null;
                            if (!isShopOpen) return null;

                            const isActive = checkIsActive(item);

                            return (
                                <div className="nav-item" key={item.id} onClick={() => navigate(item.link)}>
                                    <div className={`nav-btn ${isActive ? "active" : ""}`}>
                                        {item.icon}
                                    </div>
                                    <div className="nav-tooltip">{item.title}</div>
                                </div>
                            );
                        })}

                        {/* 🌟 3. กลุ่ม Hamburger Menu (แสดงบนมือถือเสมอ หรือบน Desktop ถ้า forceHamburgerMenu เป็น true) */}
                        {elements.some(e => e.id !== 1 && e.id !== 2) && (
                            <div className={`mobile-hamburger-menu ${forceHamburgerMenu ? 'force-show' : ''}`}>
                                <div
                                    className={`nav-btn ${isDropdownOpen ? "active" : ""}`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <Menu size={22} strokeWidth={1.8} />
                                </div>

                                <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                                    {elements.map(item => {
                                        if (item.id === 1 || item.id === 2) return null;

                                        const isExpanded = expandedMenu === item.id;
                                        const isActive = checkIsActive(item);

                                        return (
                                            <div key={item.id} className="mobile-menu-group">
                                                <div
                                                    className={`dropdown-link ${isActive ? "active" : ""}`}
                                                    onClick={(e) => item.subItems ? toggleSubMenu(item.id, e) : navigate(item.link !== "#" ? item.link : "#")}
                                                >
                                                    {item.title}
                                                    {item.subItems && <ChevronDown size={14} className={`mobile-chevron ${isExpanded ? "rotate" : ""}`} />}
                                                </div>

                                                {item.subItems && (
                                                    <div className={`mobile-sub-menu ${isExpanded ? "show" : ""}`}>
                                                        {item.subItems.map((sub, idx) => {
                                                            const isSubActive = location.pathname.toLowerCase() === sub.link.toLowerCase();
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className={`mobile-sub-item ${isSubActive ? "active" : ""}`}
                                                                    onClick={() => {
                                                                        setIsDropdownOpen(false);
                                                                        navigate(sub.link);
                                                                    }}
                                                                >
                                                                    <i>
                                                                        {sub.icon && sub.icon}
                                                                    </i>
                                                                    {sub.title}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <div className="nav-shimmer" />
            </nav>
        </>
    );
};

export default Nav;