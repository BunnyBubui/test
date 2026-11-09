const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middlewares/verifyAdmin");
const adminController = require("../controllers/adminController");
const fileController = require("../controllers/fileController");
const exportController = require("../controllers/exportController");

// แมปเส้นทาง /export-orders ไปยัง Controller พร้อมเช็คสิทธิ์ (verifyAdmin) ก่อนเสมอ
router.get("/export-orders", verifyAdmin, exportController.exportOrders);

// แมปเส้นทางทั้งหมดไปที่ Controller (คง URL แบบเดิมไว้เป๊ะๆ เพื่อไม่ให้ Frontend พังครับ)
router.get("/file-manager/list", verifyAdmin, fileController.getFolders);
router.get("/file-manager/list/:folder", verifyAdmin, fileController.getFiles);
router.get("/file-manager/download/:folder/:file", verifyAdmin, fileController.downloadSingle);

router.delete("/file-manager/delete", verifyAdmin, fileController.deleteSingle);
router.put("/file-manager/rename", verifyAdmin, fileController.renameSingle);

router.post("/file-manager/bulk-delete", verifyAdmin, fileController.bulkDeleteFiles);
router.post("/file-manager/bulk-download", verifyAdmin, fileController.bulkDownloadZip);
router.get("/file-manager/download-folder/:folder", verifyAdmin, fileController.downloadFolderZip);

// แมปเส้นทางต่างๆ ไปยัง Controller
router.post("/admin/login", adminController.login);
router.post("/admin/logout", verifyAdmin, adminController.logout);

router.get("/admin/session", verifyAdmin, adminController.getSession);
router.get("/admin/logs", verifyAdmin, adminController.getLogs);

router.post("/admin/logs/save", verifyAdmin, adminController.saveSearchLogHandler);
router.get("/admin/search/history", verifyAdmin, adminController.getSearchHistory);

module.exports = router;