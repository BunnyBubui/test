import { useEffect, useState } from "react";
import { selectServer } from "../../utils/Server";
import { showAlert, showLoading, hideLoading } from "../ui/Alert";
import "../../styles/render/FileManager.css";
import { CloudDownload, Square, SquareCheckBig, Pencil, Trash2, ArrowDownToLine, Download, X } from "lucide-react";

export default function FileManagerModal({ isOpen, onClose }) {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedBulk, setSelectedBulk] = useState([]);
    const [searchFolder, setSearchFolder] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [oldName, setOldName] = useState("");
    const [newName, setNewName] = useState("");
    const [fileName, setFileName] = useState("");
    const [searchFile, setSearchFile] = useState("");
    const [modalName, setModalName] = useState(false);
    const token = localStorage.getItem("adminToken");

    /* ---------------- Session Check ---------------- */
    const requireSession = async () => {
        if (!token) return false;

        try {
            const res = await fetch(`${selectServer()}/api/admin-session`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            return res.ok && data.admin;
        } catch {
            await showAlert("⏳ เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
            localStorage.removeItem("adminToken");
            window.location.href = "/admin-login";
            return false;
        }
    };

    /* ---------------- Load Items ---------------- */
    const loadFolders = async () => {
        if (!(await requireSession())) return;

        const res = await fetch(`${selectServer()}/api/file-manager/list`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setFolders(await res.json());
    };

    const loadFiles = async (folder) => {
        if (!(await requireSession())) return;

        showLoading("กำลังโหลดโฟลเดอร์...")

        const res = await fetch(
            `${selectServer()}/api/file-manager/list/${folder}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) return showAlert("⚠️ ดาวน์โหลดโฟลเดอร์ล้มเหลว");
        hideLoading();

        setFiles(await res.json());
    };

    useEffect(() => {
        if (isOpen) {
            loadFolders();
            setSelectedFolder(null);
            setSelectedFile(null);
            setSelectedBulk([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /* ---------------- Handlers ---------------- */

    const handleSelectFolder = (folder) => {
        setSelectedFolder(folder);
        setSelectedFile(null);
        setSelectedBulk([]);
        loadFiles(folder);
    };

    const toggleSelectAll = () => {
        if (selectedBulk.length === files.length) {
            setSelectedBulk([]);
        } else {
            setSelectedBulk(files.map(f => ({
                folder: selectedFolder,
                file: f
            })));
        }
    };

    const handleDownload = async (file) => {
        if (!(await requireSession())) return;

        showLoading("กำลังเริ่มดาวโหลด...");
        const res = await fetch(
            `${selectServer()}/api/file-manager/download/${selectedFolder}/${file}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) return showAlert("⚠️ ดาวน์โหลดล้มเหลว");
        hideLoading();

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = file;
        a.click();

        window.URL.revokeObjectURL(url);
    };

    const handleDownloadFolder = async (folderName) => {
        if (!folderName) return;
        if (!(await requireSession())) return;

        showLoading("กำลังบีบอัดโฟลเดอร์...");

        const res = await fetch(
            `${selectServer()}/api/file-manager/download-folder/${folderName}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );



        if (!res.ok) return showAlert("⚠️ ดาวน์โหลดโฟลเดอร์ล้มเหลว");
        hideLoading();

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${folderName}.zip`;
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleModalName = (bool) => {
        if (bool) {
            setModalName(bool);
        } else {
            const modal = document.querySelector(".fm-modalName-overlay");
            if (modal) modal.classList.add("hide");
            setTimeout(() => {
                setModalName(bool);
                if (modal) modal.classList.remove("hide");
            }, 300);
        }
    };

    const handleRename = (file) => {
        setFileName(file);
        setOldName(file);
        setNewName(file);
        setModalName(true);
    };

    const applyRename = async () => {
        if (!newName || newName === oldName) return showAlert("⚠️ กรุณาใส่ชื่อใหม่");

        if (!(await requireSession())) return;

        const res = await fetch(`${selectServer()}/api/file-manager/rename`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                folder: selectedFolder,
                oldName,
                newName,
            }),
        });

        if (!res.ok) return showAlert("⚠️ เปลี่ยนชื่อไม่สำเร็จ");

        handleModalName(false);
        loadFiles(selectedFolder);
    };

    /* ✅ ลบไฟล์เดี่ยว */
    const handleDelete = async (file) => {
        if (!(await requireSession())) return;

        const ok = await showAlert(`ต้องการลบไฟล์ ${file}?`, { confirm: true });
        if (!ok) return;

        await fetch(`${selectServer()}/api/file-manager/delete`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folder: selectedFolder, file }),
        });

        loadFiles(selectedFolder);
    };

    const toggleSelect = (file) => {
        const exist = selectedBulk.some((f) => f.file === file);
        setSelectedBulk(
            exist
                ? selectedBulk.filter((f) => f.file !== file)
                : [...selectedBulk, { folder: selectedFolder, file }]
        );
    };

    const handleBulkDownload = async () => {
        if (!(await requireSession())) return;
        if (selectedBulk.length === 0) return;

        showLoading("กำลังบีบอัดโฟลเดอร์...");

        const ok = await showAlert(`ดาวน์โหลดทั้งหมด ${selectedBulk.length} ไฟล์?`, {
            confirm: true
        });

        if (!ok) return;

        const res = await fetch(`${selectServer()}/api/file-manager/bulk-download`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ files: selectedBulk }),
        });

        if (!res.ok) return showAlert("⚠️ ดาวน์โหลด ZIP ล้มเหลว");

        hideLoading();

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `bulk_${Date.now()}.zip`;
        a.click();

        URL.revokeObjectURL(url);
    };

    /* ✅ Bulk delete */
    const handleBulkDelete = async () => {
        if (!(await requireSession())) return;
        if (selectedBulk.length === 0) return;

        const ok = await showAlert(`ลบทั้งหมด ${selectedBulk.length} ไฟล์?`, {
            confirm: true,
        });

        if (!ok) return;

        await fetch(`${selectServer()}/api/file-manager/bulk-delete`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ files: selectedBulk }),
        });

        loadFiles(selectedFolder);
        setSelectedBulk([]);
    };

    /* ---------------- Render ---------------- */
    return (
        <div className="fm-overlay">
            <div className="fm-modal">
                <div className="fm-header">
                    <h2>File Manager</h2>
                    <button
                        className="fm-close"
                        onClick={() => {
                            const modal = document.querySelector(".fm-overlay");
                            if (modal) modal.classList.add("hide");
                            setTimeout(() => {
                                if (modal) modal.classList.remove("hide");
                                onClose();
                            }, 300);
                        }}>
                        <X size={25} strokeWidth={4} />
                    </button>
                </div>

                <div className="fm-content">

                    {/* Sidebar Folders */}
                    <div className={`fm-left ${isCollapsed ? "collapsed" : ""}`}>
                        <div className="fm-left-header">
                            {!isCollapsed && <h4>Folders</h4>}
                            <button className="fm-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
                                {isCollapsed ? "▶" : "◀"}
                            </button>
                        </div>

                        {!isCollapsed && (
                            <>
                                <input
                                    type="text"
                                    className="fm-search"
                                    placeholder="ค้นหาโฟลเดอร์..."
                                    value={searchFolder}
                                    onChange={(e) => setSearchFolder(e.target.value)}
                                />

                                <div className="fm-folder-list">
                                    {folders
                                        .filter((f) =>
                                            f.name.toLowerCase().includes(searchFolder.toLowerCase())
                                        )
                                        .map((f) => (
                                            <div className="fm-folder">
                                                <div className="fm-folder-left">
                                                    <button
                                                        key={f.name}
                                                        className={`fm-folder-btn ${selectedFolder === f.name ? "active" : ""}`}
                                                        onClick={() => {
                                                            handleSelectFolder(f.name);
                                                            setIsCollapsed(!isCollapsed);
                                                        }}
                                                    >
                                                        {f.name}
                                                    </button>
                                                </div>
                                                <div className="fm-folder-right">
                                                    <button onClick={() => handleDownloadFolder(f.name)}>
                                                        <Download />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right file list */}
                    <div className="fm-right">

                        <div className="fm-toolbar">
                            <h4>{selectedFolder || "เลือกโฟลเดอร์"}</h4>

                            <div className="fm-tool-right">
                                {selectedFolder && (
                                    <>
                                        <button onClick={toggleSelectAll}>
                                            {selectedBulk.length === files.length
                                                ? (<><SquareCheckBig size={20} style={{ marginRight: 5 }} /> ยกเลิก</>)
                                                : (<><Square size={20} style={{ marginRight: 5 }} /> เลือกทั้งหมด</>)}
                                        </button>
                                    </>
                                )}


                                {selectedBulk.length > 0 && (
                                    <>
                                        <button className="fm-bulk-download" onClick={handleBulkDownload}>
                                            <ArrowDownToLine size={20} style={{ marginRight: 5 }} /> <p style={{ marginRight: 5 }}>ดาวน์โหลด</p>({selectedBulk.length})
                                        </button>

                                        <button className="fm-bulk-delete" onClick={handleBulkDelete}>
                                            <Trash2 size={20} style={{ marginRight: 5 }} /> <p style={{ marginRight: 5 }}>ลบ</p> ({selectedBulk.length})
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {selectedFolder && (
                            <input
                                type="text"
                                className="fm-search-file"
                                placeholder="ค้นหาไฟล์..."
                                value={searchFile}
                                onChange={(e) => setSearchFile(e.target.value)}
                            />
                        )}

                        <div className="fm-files">
                            {files
                                .filter(file => file.toLowerCase().includes(searchFile.toLowerCase()))
                                .map((file) => (
                                    <div key={file} className="fm-file-row">
                                        <div className="fm-file-body">
                                            <input
                                                type="checkbox"
                                                checked={selectedBulk.some((f) => f.file === file)}
                                                onChange={() => toggleSelect(file)}
                                            />

                                            <span
                                                className="fm-file-name"
                                                onClick={() => setSelectedFile(file)}
                                            >
                                                {file}
                                            </span>
                                        </div>

                                        <div className="fm-actions">
                                            <button className="download" onClick={() => handleDownload(file)}><CloudDownload size={20} /></button>
                                            <button className="edit" onClick={() => handleRename(file)}><Pencil size={20} /></button>
                                            <button className="danger" onClick={() => handleDelete(file)}><Trash2 size={20} /></button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedFile && (
                <div className="fm-preview" onClick={() => setSelectedFile()}>
                    <img
                        src={`${selectServer()}/uploads/${selectedFolder}/${selectedFile}`}
                        alt="preview"
                    />
                </div>
            )}

            {modalName && (
                <div className="fm-modalName-overlay">
                    <div className="fm-modalName">
                        <div className="fm-modalName-header">
                            <h1>Old name</h1>
                            <p>{oldName}</p>
                        </div>

                        <div className="fm-modalName-body">
                            <label htmlFor="newName">New name</label>
                            <textarea
                                rows={6}
                                id="newName"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>

                        <div className="fm-modalName-footer">
                            <button className="button-cancel" onClick={() => handleModalName(false)}>
                                ยกเลิก
                            </button>
                            <button className="button-apply" onClick={applyRename}>
                                เปลี่ยนชื่อ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
