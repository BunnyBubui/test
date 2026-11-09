const DataService = require('../services/dataServices');

const getContent = (req, res) => {
        try {
            // รับค่าจาก URL
            const type = req.params.type; 
            const { section, slug, id } = req.query; 

            // ส่งให้ Service จัดการหาข้อมูล
            const data = DataService.getFilteredData(type, section, slug, id);

            // ถ้าไม่พบข้อมูล
            if (!data) {
                return res.status(404).json({ 
                    success: false, 
                    message: "ไม่พบข้อมูลที่คุณต้องการ" 
                });
            }

            // ส่งข้อมูลกลับไปให้ React
            return res.status(200).json({
                success: true,
                data: data
            });

        } catch (error) {
            console.error("Error in DataController:", error);
            return res.status(500).json({ 
                success: false, 
                message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" 
            });
        }
    }

module.exports = {getContent};