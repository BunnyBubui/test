const fs = require("fs").promises;
const fsSync = require("fs"); // จำเป็นต้องใช้แบบ Sync ในบางฟังก์ชัน (เช่น ตรวจสอบว่าไฟล์มีอยู่จริงไหม)
const path = require("path");
const archiver = require("archiver");

// ระบุ Path หลักของโฟลเดอร์ uploads (ถอยหลัง 2 โฟลเดอร์เพราะอยู่ใน services/)
const getBasePath = () => path.join(__dirname, "../../public/uploads");

const listFolders = async () => {
    const base = getBasePath();
    const list = await fs.readdir(base, { withFileTypes: true });
    return list
        .filter(f => f.isDirectory())
        .map(f => ({ name: f.name, type: "folder" }));
};

const listFilesInFolder = async (folder) => {
    const target = path.join(getBasePath(), folder);
    return await fs.readdir(target);
};

// ฟังก์ชันสร้าง Path เต็มๆ สำหรับให้ Controller เอาไปดาวน์โหลด (ป้องกัน Path Traversal เบื้องต้น)
const getFilePath = (folder, file) => {
    return path.join(getBasePath(), folder, file);
};

const deleteFile = async (folder, file) => {
    const full = getFilePath(folder, file);
    await fs.unlink(full);
};

const renameFile = async (folder, oldName, newName) => {
    const oldPath = getFilePath(folder, oldName);
    const newPath = getFilePath(folder, newName);
    await fs.rename(oldPath, newPath);
};

const bulkDelete = (files) => {
    let success = 0;
    files.forEach(item => {
        const { folder, file } = item || {};
        if (!folder || !file) return;

        try {
            const full = getFilePath(folder, file);
            fsSync.unlinkSync(full); // ใช้ Sync เพื่อให้ลบในลูปได้อย่างรวดเร็ว
            success++;
        } catch (err) {
            console.warn(`ลบไฟล์ไม่สำเร็จ ${folder}/${file}:`, err.message);
        }
    });
    return success;
};

// เตรียมข้อมูลสำหรับการทำ Zip หลายๆ ไฟล์
const createBulkArchive = (files) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    
    files.forEach(item => {
        const { folder, file } = item || {};
        if (folder && file) {
            const fullPath = getFilePath(folder, file);
            archive.file(fullPath, { name: `${folder}/${file}` });
        }
    });
    return archive;
};

// เตรียมข้อมูลสำหรับการทำ Zip ทั้งโฟลเดอร์
const createFolderArchive = (folder) => {
    const targetFolder = path.join(getBasePath(), folder);
    
    // ตรวจสอบก่อนว่ามีโฟลเดอร์นี้อยู่จริงไหม
    if (!fsSync.existsSync(targetFolder)) {
        throw new Error("ไม่พบโฟลเดอร์");
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.directory(targetFolder, folder);
    return archive;
};

module.exports = {
    listFolders,
    listFilesInFolder,
    getFilePath,
    deleteFile,
    renameFile,
    bulkDelete,
    createBulkArchive,
    createFolderArchive
};