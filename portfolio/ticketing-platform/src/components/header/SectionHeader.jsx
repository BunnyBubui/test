import "../../styles/header/SectionHeader.css";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const SectionHeader = ({ title, description }) => {
    useScrollAnimation();
    return (
        <div className="section-header-center">
            <h2 className="animate-fade-right">{title}</h2>
            {/* 🌟 เช็คว่าถ้ามีการส่ง description มา ถึงจะแสดงแท็ก <p> */}
            {description && <p className="animate-fade-right">{description}</p>}
        </div>
    );
};

export default SectionHeader;