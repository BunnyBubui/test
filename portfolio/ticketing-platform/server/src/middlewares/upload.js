const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirBase = path.join(__dirname, '../../public/uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const today = new Date().toISOString().slice(0, 10);
        const finalDir = path.join(uploadDirBase, today);

        if (!fs.existsSync(finalDir)) {
            fs.mkdirSync(finalDir, { recursive: true });
        }

        cb(null, finalDir);
    },
    filename: function (req, file, cb) {
        // 🌟 1. รับค่าออเดอร์และรหัสบัตรจาก Frontend (ถ้าไม่มีให้ใช้คำว่า Order/NoID กันพัง)
        const orderId = req.body.orderId || req.body.order_id || "Order";
        const cardNumber = req.body.cardNumber || req.body.card_number || "NoID";

        // 🌟 2. ดึงเวลาปัจจุบันมาแปลงเป็น พ.ศ. (ไทย)
        const now = new Date();
        const thaiYear = now.getFullYear() + 543;
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const thaiDate = `${dd}-${mm}-${thaiYear}`; // จะได้รูปแบบเช่น 07-05-2569

        // 🌟 3. ประกอบร่างชื่อไฟล์: orderID-รหัสบัตรประจำตัว-วันเดือนปีไทย.นามสกุลไฟล์
        const ext = path.extname(file.originalname);
        const newName = `${orderId}-${cardNumber}-${thaiDate}${ext}`;
        
        cb(null, newName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('❌ รองรับเฉพาะไฟล์รูปภาพเท่านั้น! (jpg, png, gif)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: fileFilter
});

module.exports = upload;