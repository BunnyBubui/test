const paymentModel = require("../models/paymentModel");
const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');

//path file ฟอนต์สำหรับลง production ถ้าไม่โหลดมามันจะมีข้อความเพี้ยน
const regularFontPath = path.join(__dirname, '../../public/fonts/Kanit-Regular.ttf');
const boldFontPath = path.join(__dirname, '../../public/fonts/Kanit-Bold.ttf');

//เช็คไฟล์ว่าพร้อมใช้มั้ย
try {
    registerFont(regularFontPath, { family: 'Kanit', weight: 'normal' });
    registerFont(boldFontPath, { family: 'Kanit', weight: 'bold' });
    console.log("✅ โหลดฟอนต์ Kanit สำเร็จ");
} catch (error) {
    console.log("⚠️ ไม่พบไฟล์ฟอนต์ Kanit ระบบจะใช้ฟอนต์พื้นฐานแทน", error.message);
}

//ใส่เลขพร้อมเพย์ 
const PROMPTPAY_ID = process.env.PROMPTPAY_ID;

//ลบออกเลยก็ได้ไม่ต้องใช้ ยังไงก็ไม่หมดอายุ
const EXPIRE_MINUTES = 15;

const generatePaymentQR = async (orderId) => {
    if (!PROMPTPAY_ID) throw { status: 503, message: "Payment is disabled in this portfolio demo." };
    const order = await paymentModel.getOrderForPayment(orderId);
    if (!order) throw { status: 404, message: "ไม่พบออเดอร์นี้" };

    //ถ้าไม่ใช้เวลาลบออกเลย
    const orderTime = new Date(order.create_at).getTime();
    const currentTime = Date.now();
    const diffMinutes = (currentTime - orderTime) / (1000 * 60);

    if (diffMinutes > EXPIRE_MINUTES) {
        throw { status: 400, message: "❌ ออเดอร์นี้หมดเวลาชำระเงินแล้ว" };
    }

    //สร้างจำนวนเงินและรหัสเพื่อเจน qr code
    const amount = parseFloat(order.total_price);
    const payload = generatePayload(PROMPTPAY_ID, { amount });

    //สร้าง qr code มา
    const qrCanvas = createCanvas(300, 300);
    await qrcode.toCanvas(qrCanvas, payload, {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
    });

    //สร้างขนาดรูปภาพกว้าง 400px * ยาว 700px
    const finalCanvas = createCanvas(400, 700);
    const ctx = finalCanvas.getContext('2d');

    //เติมสีดำหรือจะเปลี่ยนสีอื่นก็ได้ 6 เลขหลักจะเป็นโค้ดสี 2 ตัวสุดท้าย 61 คือค่าความโปร่งใส
    ctx.fillStyle = '#00000061';
    ctx.fillRect(0, 0, 400, 700);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Kanit';
    ctx.textAlign = 'center';
    ctx.fillText('สแกนเพื่อชำระเงิน', 200, 45);

    ctx.drawImage(qrCanvas, 50, 70, 300, 300);

    try {
        //ใส่รูปโลโก้
        const logoPath = path.join(__dirname, '../../public/pictures/favicon.png');
        console.log("🔍 1. กำลังหาไฟล์ที่:", logoPath);

        const imageBuffer = fs.readFileSync(logoPath);
        console.log("✅ 2. เจอไฟล์แล้ว! ขนาดไฟล์:", imageBuffer.length, "bytes");

        const logo = await loadImage(imageBuffer);
        console.log("✅ 3. แปลงภาพเข้า Canvas สำเร็จ!");

        const boxX = 165;
        const boxY = 200;
        const boxSize = 70;
        const radius = 15;

        //แมทคำนวณอะไรสักอย่าง
        ctx.beginPath();
        ctx.moveTo(boxX + radius, boxY);
        ctx.lineTo(boxX + boxSize - radius, boxY);
        ctx.quadraticCurveTo(boxX + boxSize, boxY, boxX + boxSize, boxY + radius);
        ctx.lineTo(boxX + boxSize, boxY + boxSize - radius);
        ctx.quadraticCurveTo(boxX + boxSize, boxY + boxSize, boxX + boxSize - radius, boxY + boxSize);
        ctx.lineTo(boxX + radius, boxY + boxSize);
        ctx.quadraticCurveTo(boxX, boxY + boxSize, boxX, boxY + boxSize - radius);
        ctx.lineTo(boxX, boxY + radius);
        ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
        ctx.closePath();

        ctx.fillStyle = '#ffffff';
        ctx.fill();

        const logoSize = 56;
        const logoOffset = (boxSize - logoSize) / 2;
        ctx.drawImage(logo, boxX + logoOffset, boxY + logoOffset, logoSize, logoSize);

        console.log("✅ 4. วาดโลโก้ลงสลิปสำเร็จ!");
    } catch (error) {
        console.error("⚠️ เกิดข้อผิดพลาดในการวาดโลโก้:", error.message);
    }

    ctx.fillStyle = '#e65100';
    ctx.font = 'bold 42px Kanit';
    //คำนวณตำแหน่งให้ดีๆนะ ลองเทสหลายๆครั้ง 200, 430 คือจุดแกน x, y ของรูปภาพที่วาด
    ctx.fillText(`฿ ${amount.toLocaleString()}`, 200, 430);

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 24px Kanit";
    ctx.fillText(`ชื่อบัญชี`, 200, 485);

    ctx.fillStyle = '#bfbfbf';
    ctx.font = "20px Kanit";
    ctx.fillText(`พัชรพล แดงสีดา`, 200, 510);

    ctx.fillStyle = '#7e7eed';
    ctx.font = '16px Kanit';
    ctx.fillText(`หมายเลขออเดอร์: #${order.order_id}`, 200, 550);
    ctx.fillText(`สั่งซื้อตั๋วเข้างาน`, 200, 575);
    ctx.fillText(`กรุณาชำระภายใน 15 นาที`, 200, 600);

    ctx.fillStyle = '#ed5252';
    ctx.font = 'bold 18px Kanit';
    ctx.fillText(`หลังจากชำระเสร็จให้อัปโหลดสลิปเข้าสู่ระบบ`, 200, 640);

    const compositeImageBase64 = finalCanvas.toDataURL('image/png');
    return {
        order_id: order.order_id,
        total_price: amount,
        qr_image: compositeImageBase64,
        expire_in_minutes: Math.max(0, Math.ceil(EXPIRE_MINUTES - diffMinutes))
    };
};

const verifyAndConfirmSlip = async (orderId, slipPath) => {
    const order = await paymentModel.getOrderForPayment(orderId);
    if (!order) {
        throw { status: 404, message: "ไม่พบข้อมูลออเดอร์ในระบบ" };
    }

    const orderTime = new Date(order.create_at).getTime();
    const currentTime = Date.now();
    const diffMinutes = (currentTime - orderTime) / (1000 * 60);

    await paymentModel.updatePaymentSuccess(orderId, slipPath);
    return true;
};

module.exports = {
    generatePaymentQR,
    verifyAndConfirmSlip
};