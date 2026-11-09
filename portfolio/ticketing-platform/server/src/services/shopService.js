const shopModel = require("../models/shopModel");

const fetchAllShops = async () => {
    const result = await shopModel.getAllShops();
    if (!result || result.length === 0) {
        throw { status: 404, message: "ไม่พบข้อมูลร้านค้า" };
    }

    const now = new Date();
    const updatedShops = result.map((shop) => {
        const start = new Date(shop.start_date);
        const end = new Date(shop.end_date);
        
        let saleStatus = 'open';
        if (now < start) {
            saleStatus = 'waiting';
        } else if (now > end) {
            saleStatus = 'closed';
        }

        return {
            ...shop,
            sale_status: saleStatus, 
            status: saleStatus === 'open' 
        };
    });

    const sortedShops = updatedShops.sort((a, b) => {
        const order = { 'open': 1, 'waiting': 2, 'closed': 3 };
        return order[a.sale_status] - order[b.sale_status];
    });

    return {
        count: result.length,
        data: sortedShops
    };
};

module.exports = { fetchAllShops };