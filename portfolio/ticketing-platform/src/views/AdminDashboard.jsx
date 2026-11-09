import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, Download, FileText, CheckCircle, Clock, Truck, Trash2, Edit, X, ImageIcon } from "lucide-react";
import { selectServer } from "../utils/Server";
import "../styles/views/AdminDashboard.css";
import { showAlert } from "../components/ui/Alert";

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    // --- States ---
    const [admin, setAdmin] = useState(null);
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({ total_orders: 0, status_0_pending: 0, status_1_waiting_ship: 0, status_2_shipping: 0, status_3_completed: 0, summary_total: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // --- Modals ---
    const [previewSlip, setPreviewSlip] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editForm, setEditForm] = useState({ first_name: "", last_name: "", phone: ""});

    // 1. ตรวจสอบ Session เมื่อเปิดหน้า
    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                navigate("/admin-login");
                return;
            }

            try {
                // อ้างอิงจาก adminRoutes.js -> router.get("/admin/session")
                const res = await fetch(`${selectServer()}/api/admin/session`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (res.ok) {
                    setAdmin(data.admin);
                    fetchSummary(token);
                    fetchOrders(token, 1, "");
                } else {
                    throw new Error("Token Invalid");
                }
            } catch (err) {
                console.warn("เซสชั่นหมดอายุ กรุณาล็อกอินใหม่");
                localStorage.removeItem("adminToken");
                navigate("/admin-login");
            }
        };
        verifySession();
    }, [navigate]);

    // 2. ดึงข้อมูลสรุป (Summary)
    const fetchSummary = async (token) => {
        try {
            const res = await fetch(`${selectServer()}/api/get-summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSummary(data);
            }
        } catch (error) {
            console.error("Fetch summary failed");
        }
    };

    // 3. ดึงข้อมูลออเดอร์ (Orders)
    const fetchOrders = async (token, targetPage = 1, keyword = "") => {
        setLoading(true);
        try {
            const res = await fetch(`${selectServer()}/api/get-all-orders?page=${targetPage}&search=${encodeURIComponent(keyword)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("adminToken");
                navigate("/admin-login");
                return;
            }

            const data = await res.json();
            if (res.ok) {
                setOrders(data.data || []);
                setPage(data.page || 1);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error("Fetch orders failed");
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---
    const handleSearch = async () => {
        const token = localStorage.getItem("adminToken");
        // บันทึก Log การค้นหา (อ้างอิง: /admin/logs/save)
        try {
            await fetch(`${selectServer()}/api/admin/logs/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ keyword: searchTerm.trim() }),
            });
        } catch (e) {}
        
        fetchOrders(token, 1, searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        fetchOrders(localStorage.getItem("adminToken"), 1, "");
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${selectServer()}/api/update-status/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setOrders(orders.map(o => o.order_id === orderId ? { ...o, received: newStatus } : o));
                fetchSummary(token);
            } else {
                await showAlert("อัปเดตสถานะไม่สำเร็จ");
            }
        } catch (err) {
            await showAlert("เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        const alert = await showAlert(`คุณต้องการลบออเดอร์ #${orderId} หรือไม่?`, {confirm: true});
        if (!alert) return;
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${selectServer()}/api/orders/${orderId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setOrders(orders.filter(o => o.order_id !== orderId));
                fetchSummary(token);
            }
        } catch (err) {
            await showAlert("ลบออเดอร์ไม่สำเร็จ");
        }
    };

    const handleExport = async () => {
        const token = localStorage.getItem("adminToken");
        const confirm = await showAlert("ต้องการดาวน์โหลดไฟล์ Excel ใช่หรือไม่?", { confirm : true })
        if (!confirm) return;
        try {
            const res = await fetch(`${selectServer()}/api/export-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Orders_${new Date().toISOString().split('T')[0]}.xlsx`;
                a.click();
            }
        } catch (err) {
            await showAlert("ดาวน์โหลดไฟล์ล้มเหลว");
        }
    };

    const handleLogout = async () => {
        const confirm = await showAlert("ต้องการออกจากระบบหรือไม่?", { confirm : true })
        if (confirm) {
            localStorage.removeItem("adminToken");
            navigate("/admin-login");
        }
    };

    const openEditModal = (order) => {
        setEditForm({
            first_name: order.first_name || "", last_name: order.last_name || "",
            phone: order.phone || ""
        });
        setEditingOrder(order);
    };

    const submitEditOrder = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${selectServer()}/api/orders/${editingOrder.order_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                await showAlert("อัปเดตข้อมูลสำเร็จ");
                setEditingOrder(null);
                fetchOrders(token, page, searchTerm);
            } else {
                await showAlert("แก้ไขไม่สำเร็จ");
            }
        } catch (err) {
            await showAlert("ระบบขัดข้อง");
        }
    };

    return (
        <div className="admin-sp-layout">
            {/* --- HEADER --- */}
            <header className="admin-sp-header">
                <div className="admin-sp-brand">
                    <h2>BuddyCamp <span>Admin Panel</span></h2>
                    <span className="admin-badge">Welcome, {admin?.username || 'Admin'}</span>
                </div>
                <div className="admin-sp-actions">
                    <button className="btn-outline" onClick={handleExport}><Download size={16}/> Export Excel</button>
                    <button className="btn-danger-outline" onClick={handleLogout}><LogOut size={16}/> Logout</button>
                </div>
            </header>

            <main className="admin-sp-main">
                {/* --- SUMMARY CARDS --- */}
                <section className="admin-sp-stats">
                    <div className="stat-card">
                        <FileText size={24} color="#60a5fa" />
                        <div className="stat-info">
                            <p>ออเดอร์ทั้งหมด</p>
                            <h3>{summary.total_orders || 0}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Clock size={24} color="#fbbf24" />
                        <div className="stat-info">
                            <p>รอชำระเงิน</p>
                            <h3>{summary.status_0_pending || 0}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Clock size={24} color="#a991ff" />
                        <div className="stat-info">
                            <p>รอตรวจสอบการชำระ</p>
                            <h3>{summary.status_1_waiting || 0}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <CheckCircle size={24} color="#4ade80" />
                        <div className="stat-info">
                            <p>สำเร็จแล้ว</p>
                            <h3>{summary.status_2_completed || 0}</h3>
                        </div>
                    </div>
                    <div className="stat-card revenue">
                        <p>ยอดขายรวม</p>
                        <h3>฿ {summary.summary_total?.toLocaleString() || 0}</h3>
                    </div>
                    <div className="stat-card success">
                        <p>ยอดเงินที่โอนแล้ว</p>
                        <h3>฿ {summary.status_3_success?.toLocaleString() || 0}</h3>
                    </div>
                    <div className="stat-card not-success">
                        <p>ยังไม่ชำระ</p>
                        <h3>฿ {summary.status_4_not_success?.toLocaleString() || 0}</h3>
                    </div>
                </section>

                {/* --- CONTROLS --- */}
                <section className="admin-sp-controls">
                    <div className="search-box">
                        <Search size={20} color="#94a3b8" />
                        <input 
                            type="text" 
                            placeholder="ค้นหาด้วยชื่อ, เบอร์โทร, เลขออเดอร์..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {searchTerm && <X size={18} className="clear-icon" onClick={handleClearSearch} />}
                    </div>
                    <button className="btn-primary" onClick={handleSearch}>ค้นหา</button>
                </section>

                {/* --- DATA TABLE --- */}
                <section className="admin-sp-table-container">
                    {loading ? (
                        <div className="admin-loading">กำลังโหลดข้อมูลออเดอร์...</div>
                    ) : orders.length === 0 ? (
                        <div className="admin-empty">ไม่พบออเดอร์ในระบบ</div>
                    ) : (
                        <table className="admin-sp-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>รหัสบัตร</th>
                                    <th>ลูกค้า</th>
                                    <th>เบอร์โทร</th>
                                    <th>สั่งซื้อ</th>
                                    <th>ยอดรวม</th>
                                    <th>สลิปโอนเงิน</th>
                                    <th>สถานะ</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.order_id}>
                                        <td className="fw-bold">#{order.order_id}</td>
                                        <td>{order.items[0].ticket_code}</td>
                                        <td>{order.first_name} {order.last_name}</td>
                                        <td>{order.phone}</td>
                                        <td>{order.items[0].name}</td>
                                        <td className="txt-gold">฿{order.total_price?.toLocaleString()}</td>
                                        <td>
                                            {order.slip_path ? (
                                                <button className="btn-icon" onClick={() => setPreviewSlip(order.slip_path)}>
                                                    <ImageIcon size={18} color="#60a5fa" /> ดูสลิป
                                                </button>
                                            ) : (
                                                <span className="txt-muted">ไม่มีสลิป</span>
                                            )}
                                        </td>
                                        <td>
                                            <select 
                                                className={`status-select s-${order.received}`}
                                                value={order.received}
                                                onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                            >
                                                <option value="0">รอชำระเงิน</option>
                                                <option value="1">รอเช็คสลิป</option>
                                                <option value="2">ชำระเงินแล้ว</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn-icon" onClick={() => openEditModal(order)}><Edit size={18} color="#fbbf24"/></button>
                                                <button className="btn-icon" onClick={() => handleDeleteOrder(order.order_id)}><Trash2 size={18} color="#ef4444"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>

                {/* --- PAGINATION --- */}
                {!loading && totalPages > 1 && (
                    <div className="admin-sp-pagination">
                        <button disabled={page <= 1} onClick={() => fetchOrders(localStorage.getItem("adminToken"), page - 1, searchTerm)}>
                            ก่อนหน้า
                        </button>
                        <span>หน้า {page} จาก {totalPages}</span>
                        <button disabled={page >= totalPages} onClick={() => fetchOrders(localStorage.getItem("adminToken"), page + 1, searchTerm)}>
                            ถัดไป
                        </button>
                    </div>
                )}
            </main>

            {/* --- MODAL: EDIT ORDER --- */}
            {editingOrder && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-box">
                        <h3>แก้ไขออเดอร์ #{editingOrder.order_id}</h3>
                        <form onSubmit={submitEditOrder} className="admin-form">
                            <div className="form-group">
                                <label>ชื่อจริง</label>
                                <input required type="text" value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>นามสกุล</label>
                                <input required type="text" value={editForm.last_name} onChange={e => setEditForm({...editForm, last_name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>เบอร์โทร</label>
                                <input required type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-outline" onClick={() => setEditingOrder(null)}>ยกเลิก</button>
                                <button type="submit" className="btn-primary">บันทึกการแก้ไข</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL: SLIP PREVIEW --- */}
            {previewSlip && (
                <div className="admin-modal-overlay" onClick={() => setPreviewSlip(null)}>
                    <div className="admin-slip-preview" onClick={e => e.stopPropagation()}>
                        <button className="close-slip-btn" onClick={() => setPreviewSlip(null)}><X size={24}/></button>
                        <img src={`${selectServer()}${previewSlip.startsWith('/') ? '' : '/'}${previewSlip}`} alt="Slip" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;