import { useEffect, useState } from "react";
import "../../styles/views/AdminDashboard.css";
import "../../styles/render/AdminSearchHistory.css";
import { Loader } from "lucide-react";
import BackArrow from "../ui/BackArrow";
import { selectServer } from "../../utils/Server";

const AdminSearchHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                const res = await fetch(`${selectServer()}/api/admin-search-history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (res.ok) {
                    setHistory(data.history || []);
                } else {
                    console.error(data.message);
                }
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <>
            <div className="admin-dashboard" style={{ paddingBottom: 50 }}>
                <div>
                    <BackArrow />
                </div>
                <div className="admin-content">

                    <h2 className="search-title">🔍 ประวัติการค้นหาของคุณ</h2>

                    {loading ? (
                        <p className="admin-loading-text">
                            <Loader /> กำลังโหลดข้อมูล...
                        </p>
                    ) : history.length === 0 ? (
                        <p className="no-search-data">ยังไม่มีประวัติการค้นหา</p>
                    ) : (
                        <div className="search-history-warp">
                            <div className="search-history-list">
                                {history.map((item) => (
                                    <div key={item.id} className="search-card">
                                        <div className="search-row">
                                            <span className="search-keyword">คำค้น <b>{item.keyword}</b></span>
                                            <span className="search-date">
                                                {new Date(item.created_at).toLocaleString("th-TH")}
                                            </span>
                                        </div>

                                        <p className="search-admin">
                                            แอดมิน <b>{item.admin_name}</b>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminSearchHistory;
