import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/HamburgerMenu.css";
import * as Icons from "lucide-react";
import { menuConfig } from "../utils/Menu";

const HamburgerMenu = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (item) => {
        if (item.external) {
            window.open(item.url, "_blank");
        } else {
            navigate(item.path);
        }
        onClose();
    };

    return (
        <div className={`mobile-menu-container ${isOpen ? "open" : ""}`}>
            <div className="menu-header">
                <span className="menu-title">เมนูหลัก</span>
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <ul className="menu-list">
                {menuConfig.map((group, gi) => (
                    <div key={gi}>
                        {group.title && (
                            <div className="menu-group-title">
                                {group.title}
                            </div>
                        )}

                        {group.items.map((item) => {
                            const Icon = Icons[item.icon];
                            const isActive =
                                !item.external &&
                                location.pathname === item.path;

                            return (
                                <li
                                    key={item.id}
                                    className={isActive ? "active" : ""}
                                    onClick={() => handleClick(item)}
                                    style={{ transitionDelay: isOpen ? '0.1s' : '0s' }}
                                    title={!isOpen ? item.label : ""}
                                >
                                    <div
                                        className={`menu-icon-wrapper ${item.color}`}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <span>{item.label}</span>
                                </li>
                            );
                        })}
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default HamburgerMenu;
