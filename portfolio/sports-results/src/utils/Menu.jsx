const menuConfig = [
    {
        title: null,
        items: [
            {
                id: "home",
                label: "คะแนนการแข่งขันวันนี้",
                icon: "NotepadText",
                color: "blue",
                path: "/",
            },
        ],
    },
    {
        title: "ผลคะแนนการแข่งขัน",
        items: [
            {
                id: "ISSUE",
                label: "คะแนนการแข่งขันทั้งหมด",
                icon: "Trophy",
                color: "red",
                path: "/results",
            },
            {
                id: "Vote",
                label: "เหรียญรางวัลแต่ละคณะสี",
                icon: "Medal",
                color: "purple",
                path: "/medal",
            },
        ],
    },
    {
        title: "ตารางและกติกาการแข่งขัน",
        items: [
            {
                id: "calendar",
                label: "ตารางการแข่งขัน",
                icon: "CalendarDays",
                color: "orange",
                path: "/calendar",
            },
            
        ],
    },
    {
        title: "ติดต่อและช่วยเหลือ",
        items: [
            {
                id: "contact",
                label: "ติดต่อหน่วยงาน",
                icon: "Contact2",
                color: "blue-fb",
                path: "/contact",
                external: true,
                url: "https://www.facebook.com/WUSABs",
            },
        ],
    },
];

//{id: "rule",label: "เกณฑ์การแข่งขัน",icon: "FileText",color: "orange",path: "/rules",external: true,url: "https://www.facebook.com/WUSABs",},//

export {menuConfig}