const express = require('express');
const router = express.Router();

// 🌟 เช็ค Path ให้ตรงกับที่คุณเก็บไฟล์ Controller ไว้นะครับ
const DataController = require('../controllers/dataControllers'); 

// กำหนดเส้นทาง
router.get('/:type', DataController.getContent);

module.exports = router;