import { useState } from "react";
import { PlayCircle, RotateCw, DownloadCloud, Menu, History, SearchCheck, Folder } from "lucide-react";

const AdminMenu = ({ toggle, handleRefresh, handleExportExcel, handleOpenHistory, handleOpenSearchHistory, handleFileManager }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const hanndleMenu = (bool) => {
        if (bool) { setMenuOpen(bool); }
        else {
            const hide = document.querySelector(".dropdown-menu");
            if (hide) hide.classList.add("hide");
            setTimeout(() => {
                if (hide) hide.classList.remove("hide");
                setMenuOpen(bool);
            }, 290);
        }
    }

    return (
        <div className="button-box" style={{ position: "relative" }}>
            <button
                className="admin-refresh-btn"
                onClick={() => hanndleMenu(!menuOpen)}
            >
                <Menu size={26} />
            </button>

            {menuOpen && (
                <div className="dropdown-menu">
                    <button
                        className="dropdown-item dropdown-menu-top admin-base"
                        onClick={() => {
                            handleRefresh();
                            hanndleMenu(false);
                        }}
                    >
                        <RotateCw size={16} /> รีเฟรชข้อมูล
                    </button>

                    <button
                        className="dropdown-item admin-base"
                        onClick={() => {
                            toggle();
                            hanndleMenu(false);
                        }}
                    >
                        <PlayCircle size={16} /> เปิดเพลงย้อมใจ
                    </button>

                    <button
                        className="dropdown-item admin-base"
                        onClick={() => {
                            handleOpenSearchHistory();
                            hanndleMenu(false);
                        }}
                    >
                        <SearchCheck size={16} /> ประวัติการค้นหา
                    </button>

                    <button
                        className="dropdown-item admin-base"
                        onClick={() => {
                            handleOpenHistory();
                            hanndleMenu(false);
                        }}
                    >
                        <History size={16} /> ประวัติการใช้งาน
                    </button>

                    <button
                        className="dropdown-item admin-base"
                        onClick={() => {
                            handleFileManager();
                            hanndleMenu(false);
                        }}
                    >
                        <Folder size={16} /> ตัวจัดการไฟล์
                    </button>

                    <button
                        className="dropdown-item dropdown-menu-bottom admin-download"
                        onClick={() => {
                            handleExportExcel();
                            hanndleMenu(false);
                        }}
                    >
                        <DownloadCloud size={16} /> รายการสั่งซื้อ
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;
