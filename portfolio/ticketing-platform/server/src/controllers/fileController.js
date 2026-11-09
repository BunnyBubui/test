const fileService = require("../services/fileService");
const saveLog = require("../middlewares/admin_logs");

const getFolders = async (req, res) => {
    try {
        const folders = await fileService.listFolders();
        saveLog(req.admin?.id, "FM_LIST_SUCCESS", "อ่านรายการโฟลเดอร์สำเร็จ", req);
        res.json(folders);
    } catch (err) {
        saveLog(req.admin?.id, "FM_LIST_FAILED", `อ่านโฟลเดอร์ล้มเหลว: ${err.message}`, req);
        res.status(500).json({ error: "อ่านโฟลเดอร์ไม่ได้" });
    }
};

const getFiles = async (req, res) => {
    const { folder } = req.params;
    if (!folder || typeof folder !== "string") {
        return res.status(400).json({ error: "โฟลเดอร์ไม่ถูกต้อง" });
    }

    try {
        const files = await fileService.listFilesInFolder(folder);
        saveLog(req.admin?.id, "FM_LIST_FILES_SUCCESS", `อ่านไฟล์ใน ${folder}`, req);
        res.json(files);
    } catch (err) {
        saveLog(req.admin?.id, "FM_LIST_FILES_FAILED", `อ่านไฟล์ล้มเหลว: ${folder}`, req);
        res.status(500).json({ error: "อ่านไฟล์ไม่ได้" });
    }
};

const downloadSingle = (req, res) => {
    const { folder, file } = req.params;
    if (!folder || !file) {
        return res.status(400).json({ error: "ข้อมูลไฟล์ไม่ถูกต้อง" });
    }

    const fullPath = fileService.getFilePath(folder, file);
    saveLog(req.admin?.id, "FM_DOWNLOAD", `ดาวน์โหลดไฟล์: ${folder}/${file}`, req);
    res.download(fullPath); // Express จัดการการส่งไฟล์ให้
};

const deleteSingle = async (req, res) => {
    const { folder, file } = req.body;
    if (!folder || !file) {
        return res.status(400).json({ error: "ข้อมูลไฟล์ไม่ถูกต้อง" });
    }

    try {
        await fileService.deleteFile(folder, file);
        saveLog(req.admin?.id, "FM_DELETE_SUCCESS", `ลบไฟล์: ${folder}/${file}`, req);
        res.json({ message: "ลบสำเร็จ" });
    } catch (err) {
        saveLog(req.admin?.id, "FM_DELETE_FAILED", `ลบไฟล์ล้มเหลว: ${folder}/${file}`, req);
        res.status(500).json({ error: "ลบไม่ได้" });
    }
};

const renameSingle = async (req, res) => {
    const { folder, oldName, newName } = req.body;
    if (!folder || !oldName || !newName) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบ" });
    }

    try {
        await fileService.renameFile(folder, oldName, newName);
        saveLog(req.admin?.id, "FM_RENAME_SUCCESS", `rename: ${oldName} → ${newName}`, req);
        res.json({ message: "rename สำเร็จ" });
    } catch (err) {
        saveLog(req.admin?.id, "FM_RENAME_FAILED", `rename ล้มเหลว: ${oldName} → ${newName}`, req);
        res.status(500).json({ error: "rename ล้มเหลว" });
    }
};

const bulkDeleteFiles = (req, res) => {
    const { files } = req.body;
    if (!files || !Array.isArray(files)) {
        return res.status(400).json({ error: "ข้อมูลไฟล์ไม่ถูกต้อง" });
    }

    const successCount = fileService.bulkDelete(files);
    saveLog(req.admin?.id, "FM_BULK_DELETE", `ลบไฟล์หลายรายการ: ${successCount}/${files.length}`, req);
    res.json({ message: `ลบ ${successCount} ไฟล์สำเร็จ` });
};

const bulkDownloadZip = (req, res) => {
    const { files } = req.body;
    if (!files || files.length === 0) {
        return res.status(400).json({ error: "ไม่มีไฟล์ที่ต้องการดาวน์โหลด" });
    }

    const zipName = `files_${Date.now()}.zip`;
    res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${zipName}`,
    });

    const archive = fileService.createBulkArchive(files);

    archive.on("error", (err) => {
        saveLog(req.admin?.id, "FM_BULK_DOWNLOAD_FAILED", `${err.message}`, req);
        res.status(500).end();
    });

    // เชื่อมต่อท่อส่งข้อมูล (Stream) กลับไปที่ผู้ใช้ (res)
    archive.pipe(res);
    archive.finalize(); // สั่งแพ็คไฟล์

    saveLog(req.admin?.id, "FM_BULK_DOWNLOAD", `ดาวน์โหลดทั้งหมด: ${files.length} ไฟล์`, req);
};

const downloadFolderZip = (req, res) => {
    const { folder } = req.params;
    if (!folder) {
        return res.status(400).json({ error: "โฟลเดอร์ไม่ถูกต้อง" });
    }

    try {
        const zipName = `${folder}.zip`;
        res.set({
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename=${zipName}`,
        });

        const archive = fileService.createFolderArchive(folder);

        archive.on("error", (err) => {
            res.status(500).send(err.message);
        });

        archive.pipe(res);
        archive.finalize();

        saveLog(req.admin?.id, "FM_DOWNLOAD_FOLDER", `ดาวน์โหลดทั้งโฟลเดอร์: ${folder}`, req);
        
    } catch (err) {
        // ดักจับ Error กรณีไม่พบโฟลเดอร์จาก Service
        res.status(404).json({ error: err.message });
    }
};

module.exports = {
    getFolders,
    getFiles,
    downloadSingle,
    deleteSingle,
    renameSingle,
    bulkDeleteFiles,
    bulkDownloadZip,
    downloadFolderZip
};