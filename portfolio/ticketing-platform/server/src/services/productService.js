const productModel = require("../models/productModel");

const fetchAndFormatProducts = async () => {
    const rows = await productModel.getAllProductsWithDetails();

    if (!rows || rows.length === 0) {
        throw { status: 404, message: "ไม่พบข้อมูลสินค้า" };
    }

    const productList = rows.map(r => ({
        id: r.product_id,
        shopId: r.shop_id,
        name: r.name,
        description: r.description,
        picture: r.pictures_path,
        type: r.type,
        promoSetCount: r.promo_count,
        price: r.price,
        price_piece: r.price_piece,
        quantity: r.quantity,
        preorder: r.preorder,
        sold_out: (r.preorder === 0 && r.quantity <= 0)
    }));

    return {
        total: productList.length,
        data: productList,
    };
};

module.exports = {
    fetchAndFormatProducts
};