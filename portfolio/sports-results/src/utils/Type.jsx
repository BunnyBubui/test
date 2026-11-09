export const getSelectType = (type) => {
    switch (type) {
        case "latest":      // แก้จาก lasted เป็น latest เพื่อให้สื่อความหมายสากล
        case "lasted":      // เผื่อไว้ถ้าคุณใช้คำนี้จริงๆ
            return "ใหม่ล่าสุด";
            
        case "oldest":
            return "เก่าที่สุด";
            
        case "popular":
            return "ยอดนิยม";
            
        case "most_liked":
            return "ถูกใจสูงสุด";
            
        default:
            return "เรียงลำดับ"; // ค่า Default กรณีไม่ตรงเงื่อนไข
    }
};

export const TEAM_OPTIONS = [
    { label: "สีน้ำเงิน", value: 1 },
    { label: "สีเขียว", value: 2 },
    { label: "สีแดง", value: 3 },
    { label: "สีขาว", value: 4 },
    { label: "สีเหลือง", value: 5 },
    { label: "สีชมพู", value: 6 },
    { label: "อื่นๆ", value: 7 },
];

export const SPORT_OPTIONS = [
    { label: "ทุกกีฬา", value: "" },
    { label: "บาสเกตบอล", value: "Basketball" },
    { label: "ฟุตบอล", value: "Football" },
    { label: "เปตอง", value: "Petanque" },
    { label: "กรีฑา", value: "Athletics" },
    { label: "แบดมินตัน", value: "Badminton" },
    { label: "วอลเลย์บอล", value: "Volleyball" },
    { label: "กีฬาพื้นบ้าน", value: "More" },
];

export const CATEGORY_OPTIONS = [
    { label: "ทุกประเภท", value: "" },
    { label: "ชาย", value: "male" },
    { label: "หญิง", value: "female" },
    { label: "ทั้งชายและหญิง", value: "both" },
    { label: "พิเศษ", value: "special" }
];

export const DATE_OPTIONS = [
    { label: "ทุกวัน", value: "" },
    { label: "12 ม.ค. 2568", value: "2025-01-12" },
    { label: "13 ม.ค. 2568", value: "2025-01-13" },
    { label: "14 ม.ค. 2568", value: "2025-01-14" },
    { label: "15 ม.ค. 2568", value: "2025-01-15" },
    { label: "16 ม.ค. 2568", value: "2025-01-16" },
    { label: "17 ม.ค. 2568", value: "2025-01-17" },
    { label: "18 ม.ค. 2568", value: "2025-01-18" },
    { label: "19 ม.ค. 2568", value: "2025-01-19" },
    { label: "20 ม.ค. 2568", value: "2025-01-20" },
    { label: "21 ม.ค. 2568", value: "2025-01-21" },
    { label: "22 ม.ค. 2568", value: "2025-01-22" },
    { label: "23 ม.ค. 2568", value: "2025-01-23" },
    { label: "24 ม.ค. 2568", value: "2025-01-24" },
    { label: "25 ม.ค. 2568", value: "2025-01-25" },
    { label: "26 ม.ค. 2568", value: "2025-01-26" },
];