import { useState } from "react";

export const useFilters = () => {
    const [category, setCategory] = useState("");
    const [shop, setShop] = useState("");

    const categories = [
        { key: "", label: "ทุกประเภท" },
        { key: "N", label: "สินค้าปกติ (N)" },
        { key: "P", label: "โปรโมชั่น (P)" },
        { key: "S", label: "เซ็ตพิเศษ (S)" },
    ];

    return {
        category,
        setCategory,
        categories,

        shop,
        setShop
    };
};
