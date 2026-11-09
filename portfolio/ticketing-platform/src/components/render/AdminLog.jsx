import { useEffect, useState } from "react";
import "../../styles/render/AdminLog.css";
import BackArrow from "../ui/BackArrow";
import { selectServer } from "../../utils/Server";

const AdminLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                const res = await fetch(`${selectServer()}/api/admin-logs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
                    const currentAdminId = tokenPayload.id;

                    const filteredLogs = data.logs.filter(
                        (log) => log.admin_id === currentAdminId
                    );

                    setLogs(filteredLogs);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return <p className="admin-loading-text">กำลังโหลดข้อมูลนะคะ…</p>;

    return (<>
        <BackArrow />
        <div className="admin-log-container">

            <h2 className="admin-log-title">ประวัติการใช้งานของคุณ</h2>

            {logs.length === 0 ? (
                <p className="admin-log-empty">ยังไม่มีประวัติการใช้งานค่ะ</p>
            ) : (
                <div className="admin-log-list">
                    {logs.map((log) => (
                        <div className="admin-log-card" key={log.id}>
                            <div className="admin-log-header">
                                <span className="admin-log-name">{log.admin_name}</span>
                                <span className="admin-log-date">
                                    {new Date(log.created_at).toLocaleString()}
                                </span>
                            </div>

                            <div className="admin-log-detail">
                                <p><strong>การทำงาน</strong> {log.action}</p>
                                <p><strong>รายละเอียด</strong> {log.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </>
    );
};

export default AdminLogsPage;
