import AdminMenu from "../button/AdminMenu";
import { LogOut, UserCog } from "lucide-react";

const AdminHeader = ({ admin, toggle, handleRefresh, handleExportExcel, handleLogout, handleOpenHistory, handleOpenSearchHistory, handleFileManager }) => {
    return (
        <header className="admin-header">
            <div className="admin-title">
                <div className="admin-title-group">
                    <UserCog size={26} />
                    <h2>ระบบจัดการออเดอร์</h2>
                </div>

                <span className="admin-name">
                    สวัสดี, {admin?.admin_name || admin?.username}
                </span>
            </div>

            <div className="admin-right">
                <AdminMenu
                    toggle={toggle}
                    handleRefresh={handleRefresh}
                    handleExportExcel={handleExportExcel}
                    handleOpenHistory={handleOpenHistory}
                    handleOpenSearchHistory={handleOpenSearchHistory}
                    handleFileManager={handleFileManager}
                />
                

                <button className="admin-logout-btn logout" onClick={handleLogout}>
                    <LogOut size={20} /> ออกจากระบบ
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
