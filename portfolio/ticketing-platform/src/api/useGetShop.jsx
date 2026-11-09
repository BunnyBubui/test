import { useState, useEffect } from "react";
import { showAlert } from "../components/ui/Alert";
import { selectServer } from "../utils/Server";

export const getShops = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await fetch(`${selectServer()}/api/shop`);
                const data = await res.json();

                if (res.ok) {
                    setShops(data.data || []);
                }
            } catch (err) {
                console.error("โหลดร้านล้มเหลว:", err);
                await showAlert("โหลดร้านล้มเหลว");
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    return { shops, loading };
};
