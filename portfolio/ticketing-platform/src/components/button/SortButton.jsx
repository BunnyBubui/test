import { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown, Check, Search } from "lucide-react"; 
import "../../styles/button/SortButton.css";

export const DEFAULT_POST_SORT_OPTIONS = [
    { value: "latest", label: "ใหม่ล่าสุด" },
    { value: "popular", label: "ยอดนิยม" },
    { value: "most_liked", label: "ถูกใจสูงสุด" },
    { value: "oldest", label: "เก่าที่สุด" }
];

const SortButton = ({
    value,
    onChange,
    options = DEFAULT_POST_SORT_OPTIONS,
    icon: Icon = Filter,
    placeholder = "เรียงลำดับ",
    className = "",
    position = "right",
    display = "inline-block",
    searchable = false, 
    contentPosition = "down"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); 
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null); 

    const currentLabel = options.find(opt => opt.value === value)?.label || placeholder;

    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm(""); 
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm(""); 
    };

    return (
        <div className={`sort-btn-wrapper ${className}`} style={{ display: `${display}` }} ref={dropdownRef}>
            <button
                className={`sort-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <Icon size={16} style={{ marginRight: 5 }} />
                    <span className="sort-btn-text">{currentLabel}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center" }}>
                    <ChevronDown size={14} className={`sort-chevron ${isOpen ? 'rotate' : ''}`} />
                </span>
            </button>

            {isOpen && (
                <div
                    className={`sort-dropdown-menu ${position === "right" ? "sort-right" : position === "left" ? "sort-left" : ""} ${contentPosition === "top"? "contentTop" : contentPosition === "down" ? "contentDown" : ""}`}
                >
                    {(searchable || options.length > 5) && (
                        <div className="sort-search-box">
                            <Search size={14} className="sort-search-icon" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="sort-search-input"
                                placeholder="ค้นหา..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()} 
                                // 🌟 1. ดักการกดลูกศรลงจากช่อง Search เพื่อกระโดดไปที่ Option ตัวแรก
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault();
                                        // หา Option ตัวแรกแล้วสั่ง Focus
                                        const firstOption = dropdownRef.current.querySelector('.sort-option');
                                        firstOption?.focus();
                                    } else if (e.key === "Enter" && filteredOptions.length > 0) {
                                        // ถ้ารีบพิมพ์แล้วกด Enter ให้เลือกอันแรกสุดเลย
                                        e.preventDefault();
                                        handleSelect(filteredOptions[0].value);
                                    }
                                }}
                            />
                        </div>
                    )}

                    <div className="sort-options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    // 🌟 2. ใส่ tabIndex สำคัญมาก! เพื่อให้ Element นี้สามารถ Focus ด้วยคีย์บอร์ดได้
                                    tabIndex={0} 
                                    className={`sort-option ${value === option.value ? 'selected' : ''}`}
                                    onClick={() => handleSelect(option.value)}
                                    // 🌟 3. ลอจิกการเลื่อนขึ้นลงและการกด Enter
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowDown") {
                                            e.preventDefault();
                                            e.target.nextElementSibling?.focus(); // เลื่อน Focus ไปตัวถัดไป
                                        } else if (e.key === "ArrowUp") {
                                            e.preventDefault();
                                            const prev = e.target.previousElementSibling;
                                            if (prev) {
                                                prev.focus(); // เลื่อน Focus ไปตัวก่อนหน้า
                                            } else {
                                                // ถ้าอยู่บนสุดแล้วกดขึ้น ให้เด้งกลับไปโฟกัสที่ช่อง Search
                                                searchInputRef.current?.focus(); 
                                            }
                                        } else if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSelect(option.value); // กด Enter เพื่อเลือก
                                        }
                                    }}
                                >
                                    {option.label}
                                    {value === option.value && <Check size={14} className="check-icon" />}
                                </div>
                            ))
                        ) : (
                            <div className="sort-no-result">ไม่พบข้อมูล</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SortButton;