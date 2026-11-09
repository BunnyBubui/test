import { useState, useEffect } from "react";
import { getStoredUser } from "../scripts/UserData";
import { selectServer } from "../utils/Server";

const useAdminCheck = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminRole = async () => {
            const user = getStoredUser();
            const token = user?.token;

            if (!token) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`http://localhost:3000/api/check-admin`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.status === 200) {
                    setIsAdmin(true); 
                } else {
                    setIsAdmin(false); 
                }
            } catch (err) {
                console.error("Failed to verify admin:", err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdminRole();
    }, []);
    return { isAdmin, loading };
};

export default useAdminCheck;