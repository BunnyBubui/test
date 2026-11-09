import { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown, Check, Search } from "lucide-react"; // เพิ่ม Icon Search
import "./css/SortButton.css";

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
    searchable = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null); 

    const currentLabel = options.find(opt => opt.value === value)?.label || placeholder;

    // ✅ กรอง Options ตามคำค้นหา
    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm(""); // Reset คำค้นหาเมื่อปิด
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Auto Focus เมื่อเปิด Dropdown (เฉพาะโหมด searchable)
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm(""); // Reset คำค้นหา
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
                    className={`sort-dropdown-menu ${position === "right" ? "sort-right" : position === "left" ? "sort-left" : ""}`}
                >
                    {(searchable) && (
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
                            />
                        </div>
                    )}

                    <div className="sort-options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`sort-option ${value === option.value ? 'selected' : ''}`}
                                    onClick={() => handleSelect(option.value)}
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