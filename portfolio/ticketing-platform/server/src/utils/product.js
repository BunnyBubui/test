
const productData = [
    // === 1. เซ็ตเสื้อโปโลคอปก (4 สี) ราคา 499 บาท ===
    {
        shopId: 1,
        name: "เสื้อโปโลคอปก มนต์เสน่ห์ท่าศาลาบ้านเรา (สีน้ำเงิน)",
        description: "เสื้อโปโลคอปก Warrix แท้ เนื้อผ้าคุณภาพ ทรงสุภาพ ใส่ทำงาน ลายสกรีนอัตลักษณ์ของดีท่าศาลา",
        picture: "pictures/01.jpg",
        type: "N",
        promo_count: 1,
        price: 499,
        price_piece: 499,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อโปโลคอปก สีน้ำเงิน",
                shirt: ["สีน้ำเงิน"],
                pictures: ["pictures/01.jpg"],
                size: [
                    { size: "XS", chest: 34, length: 25, arm: 0 }, { size: "S", chest: 36, length: 26, arm: 0 },
                    { size: "M", chest: 38, length: 27, arm: 0 }, { size: "L", chest: 42, length: 28, arm: 0 },
                    { size: "XL", chest: 44, length: 29, arm: 0 }, { size: "2L", chest: 46, length: 30, arm: 0 },
                    { size: "3L", chest: 48, length: 31, arm: 0 }, { size: "5L", chest: 52, length: 32, arm: 0 },
                    { size: "7L", chest: 56, length: 33, arm: 0 }
                ]
            },
        ],
    },
    {
        shopId: 1,
        name: "เสื้อโปโลคอปก มนต์เสน่ห์ท่าศาลาบ้านเรา (สีม่วง)",
        description: "เสื้อโปโลคอปก Warrix แท้ เนื้อผ้าคุณภาพ ทรงสุภาพ ใส่ทำงาน ลายสกรีนอัตลักษณ์ของดีท่าศาลา",
        picture: "pictures/02.jpg",
        type: "N",
        promo_count: 1,
        price: 499,
        price_piece: 499,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อโปโลคอปก สีม่วง",
                shirt: ["สีม่วง"],
                pictures: ["pictures/02.jpg"],
                size: [
                    { size: "XS", chest: 34, length: 25, arm: 0 }, { size: "S", chest: 36, length: 26, arm: 0 },
                    { size: "M", chest: 38, length: 27, arm: 0 }, { size: "L", chest: 42, length: 28, arm: 0 },
                    { size: "XL", chest: 44, length: 29, arm: 0 }, { size: "2L", chest: 46, length: 30, arm: 0 },
                    { size: "3L", chest: 48, length: 31, arm: 0 }, { size: "5L", chest: 52, length: 32, arm: 0 },
                    { size: "7L", chest: 56, length: 33, arm: 0 }
                ]
            },
        ],
    },
    {
        shopId: 1,
        name: "เสื้อโปโลคอปก มนต์เสน่ห์ท่าศาลาบ้านเรา (สีเขียว)",
        description: "เสื้อโปโลคอปก Warrix แท้ เนื้อผ้าคุณภาพ ทรงสุภาพ ใส่ทำงาน ลายสกรีนอัตลักษณ์ของดีท่าศาลา",
        picture: "pictures/03.jpg",
        type: "N",
        promo_count: 1,
        price: 499,
        price_piece: 499,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อโปโลคอปก สีเขียว",
                shirt: ["สีเขียว"],
                pictures: ["pictures/03.jpg"],
                size: [
                    { size: "XS", chest: 34, length: 25, arm: 0 }, { size: "S", chest: 36, length: 26, arm: 0 },
                    { size: "M", chest: 38, length: 27, arm: 0 }, { size: "L", chest: 42, length: 28, arm: 0 },
                    { size: "XL", chest: 44, length: 29, arm: 0 }, { size: "2L", chest: 46, length: 30, arm: 0 },
                    { size: "3L", chest: 48, length: 31, arm: 0 }, { size: "5L", chest: 52, length: 32, arm: 0 },
                    { size: "7L", chest: 56, length: 33, arm: 0 }
                ]
            },
        ],
    },
    {
        shopId: 1,
        name: "เสื้อโปโลคอปก มนต์เสน่ห์ท่าศาลาบ้านเรา (สีขาว)",
        description: "เสื้อโปโลคอปก Warrix แท้ เนื้อผ้าคุณภาพ ทรงสุภาพ ใส่ทำงาน ลายสกรีนอัตลักษณ์ของดีท่าศาลา",
        picture: "pictures/04.jpg",
        type: "N",
        promo_count: 1,
        price: 499,
        price_piece: 499,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อโปโลคอปก สีขาว",
                shirt: ["สีขาว"],
                pictures: ["pictures/04.jpg"],
                size: [
                    { size: "XS", chest: 34, length: 25, arm: 0 }, { size: "S", chest: 36, length: 26, arm: 0 },
                    { size: "M", chest: 38, length: 27, arm: 0 }, { size: "L", chest: 42, length: 28, arm: 0 },
                    { size: "XL", chest: 44, length: 29, arm: 0 }, { size: "2L", chest: 46, length: 30, arm: 0 },
                    { size: "3L", chest: 48, length: 31, arm: 0 }, { size: "5L", chest: 52, length: 32, arm: 0 },
                    { size: "7L", chest: 56, length: 33, arm: 0 }
                ]
            },
        ],
    },
    // === 2. เซ็ตเสื้อคอกลมผ้าคอตตอน มินิมอล (2 สี) ราคา 250 บาท ===
    {
        shopId: 1,
        name: "เสื้อคอกลม มนต์เสน่ห์ท่าศาลาบ้านเรา (สีดำ)",
        description: "เสื้อคอกลมผ้าคอตตอนสไตล์มินิมอล เรียบง่ายใส่สบาย แมทช์ลุคชิลๆ ได้ลงตัว หยิบมาใส่ได้ทุกสถานการณ์!",
        picture: "pictures/05.jpg",
        type: "N",
        promo_count: 1,
        price: 250,
        price_piece: 250,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อคอตตอน สีดำ",
                shirt: ["สีดำ"],
                pictures: ["pictures/07.jpg"],
                size: [
                    { size: "S", chest: 32, length: 0, arm: 0 }, { size: "M", chest: 36, length: 0, arm: 0 },
                    { size: "L", chest: 40, length: 0, arm: 0 }, { size: "XL", chest: 44, length: 0, arm: 0 },
                    { size: "2XL", chest: 48, length: 0, arm: 0 }, { size: "3XL", chest: 52, length: 0, arm: 0 },
                    { size: "4XL", chest: 56, length: 0, arm: 0 }, { size: "5XL", chest: 60, length: 0, arm: 0 }
                ]
            },
        ],
    },
    {
        shopId: 1,
        name: "เสื้อคอกลม มนต์เสน่ห์ท่าศาลาบ้านเรา (สีขาว)",
        description: "เสื้อคอกลมผ้าคอตตอนสไตล์มินิมอล เรียบง่ายใส่สบาย แมทช์ลุคชิลๆ ได้ลงตัว หยิบมาใส่ได้ทุกสถานการณ์!",
        picture: "pictures/06.jpg",
        type: "N",
        promo_count: 1,
        price: 250,
        price_piece: 250,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อคอตตอน สีขาว",
                shirt: ["สีขาว"],
                pictures: ["pictures/08.jpg"],
                size: [
                    { size: "S", chest: 32, length: 0, arm: 0 }, { size: "M", chest: 36, length: 0, arm: 0 },
                    { size: "L", chest: 40, length: 0, arm: 0 }, { size: "XL", chest: 44, length: 0, arm: 0 },
                    { size: "2XL", chest: 48, length: 0, arm: 0 }, { size: "3XL", chest: 52, length: 0, arm: 0 },
                    { size: "4XL", chest: 56, length: 0, arm: 0 }, { size: "5XL", chest: 60, length: 0, arm: 0 }
                ]
            },
        ],
    },
];

const old_Data = [
    {
        shopId: 1,
        name: "เสื้อโปโลคอปก มนต์เสน่ห์ท่าศาลาบ้านเรา",
        description: "เสื้อโปโลคอปก Warrix แท้ ทรงสุภาพ ใส่ทำงาน ลายสกรีนอัตลักษณ์ของดีท่าศาลา มี 4 สีให้เลือก สีนํ้าเงิน, สีม่วง, สีเขียว, สีขาว",
        picture: "pictures/01.jpg",
        type: "N",
        promo_count: 1,
        price: 499,
        price_piece: 499,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อโปโลคอปก",
                shirt: ["สีน้ำเงิน", "สีม่วง", "สีเขียว", "สีขาว"],
                pictures: ["pictures/01.jpg", "pictures/02.jpg", "pictures/03.jpg", "pictures/04.jpg"],
                size: [
                    { size: "XS", chest: 34, length: 25, arm: 0 }, { size: "S", chest: 36, length: 26, arm: 0 },
                    { size: "M", chest: 38, length: 27, arm: 0 }, { size: "L", chest: 42, length: 28, arm: 0 },
                    { size: "XL", chest: 44, length: 29, arm: 0 }, { size: "2L", chest: 46, length: 30, arm: 0 },
                    { size: "3L", chest: 48, length: 31, arm: 0 }, { size: "5L", chest: 52, length: 32, arm: 0 },
                    { size: "7L", chest: 56, length: 33, arm: 0 } // [cite: 6]
                ]
            },
        ],
    },

    // 2. เซ็ตเสื้อคอกลมพิมพ์ลายเกลียวคลื่น (2 สี) [cite: 8, 9, 10]
    {
        shopId: 1,
        name: "เสื้อคอกลมพิมพ์ลาย มนต์เสน่ห์ท่าศาลาบ้านเรา",
        description: "เสื้อคอกลมพิมพ์ลายเกลียวคลื่นสีสันสดใส เนื้อผ้าเบาใส่สบาย ไอเทมเด็ดที่สายเที่ยวต้องมีไว้ใส่ชิลรับลมทะเลท่าศาลา มี 2 สีให้เลือก สีชมพูและสีฟ้า",
        picture: "pictures/05.jpg",
        type: "N",
        promo_count: 1,
        price: 300, // [cite: 11]
        price_piece: 300,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อพิมพ์ลายสีชมพู",
                shirt: ["เสื้อพิมพ์ลายสีชมพู", "เสื้อพิมพ์ลายสีฟ้า"],
                pictures: ["pictures/05.jpg", "pictures/06.jpg"],
                size: [
                    { size: "SS", chest: 34, length: 0, arm: 0 }, { size: "S", chest: 36, length: 0, arm: 0 },
                    { size: "M", chest: 38, length: 0, arm: 0 }, { size: "L", chest: 40, length: 0, arm: 0 },
                    { size: "XL", chest: 42, length: 0, arm: 0 }, { size: "2XL", chest: 44, length: 0, arm: 0 },
                    { size: "3XL", chest: 46, length: 0, arm: 0 }, { size: "4XL", chest: 48, length: 0, arm: 0 },
                    { size: "5XL", chest: 50, length: 0, arm: 0 }, { size: "6XL", chest: 52, length: 0, arm: 0 },
                    { size: "7XL", chest: 54, length: 0, arm: 0 }, { size: "8XL", chest: 56, length: 0, arm: 0 },
                    { size: "9XL", chest: 58, length: 0, arm: 0 }, { size: "10XL", chest: 60, length: 0, arm: 0 } // [cite: 13]
                ]
            },
        ],
    },

    // 3. เซ็ตเสื้อคอกลมผ้าคอตตอน มินิมอล (2 สี) [cite: 14, 15, 16]
    {
        shopId: 1,
        name: "เสื้อคอกลม มนต์เสน่ห์ท่าศาลาบ้านเรา (สีดำ)",
        description: "เสื้อคอกลมผ้าคอตตอนสไตล์มินิมอล เรียบง่ายใส่สบาย แมทช์ลุคชิลๆ ได้ลงตัว หยิบมาใส่ได้ทุกสถานการณ์! มี 2 สีให้เลือก สีดำและสีขาว",
        picture: "pictures/07.jpg",
        type: "N",
        promo_count: 1,
        price: 250, // [cite: 17]
        price_piece: 250,
        quantity: 999,
        preorder: 1,
        parts: [
            {
                name: "เสื้อคอตตอนสีดำ",
                shirt: ["เสื้อคอตตอนสีดำ", "เสื้อคอตตอนสีขาว"],
                pictures: ["pictures/07.jpg", "pictures/08.jpg"],
                size: [
                    { size: "S", chest: 32, length: 0, arm: 0 }, { size: "M", chest: 36, length: 0, arm: 0 },
                    { size: "L", chest: 40, length: 0, arm: 0 }, { size: "XL", chest: 44, length: 0, arm: 0 },
                    { size: "2XL", chest: 48, length: 0, arm: 0 }, { size: "3XL", chest: 52, length: 0, arm: 0 },
                    { size: "4XL", chest: 56, length: 0, arm: 0 }, { size: "5XL", chest: 60, length: 0, arm: 0 } // [cite: 19]
                ]
            },
        ],
    },
]

module.exports = productData;