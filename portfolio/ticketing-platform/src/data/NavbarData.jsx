import { Ticket, CheckCircle } from "lucide-react";
import { faLine, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Settings = {
    icons: {
        size: 13
    }
};

export const elements = [
    { id: 1, title: "หน้าหลัก", icon: <Ticket size={22} strokeWidth={1.8} />, link: "/" },
    { id: 2, title: "ตรวจสอบ", icon: <CheckCircle size={22} strokeWidth={1.8} />, link: "/package" },
];

export const topbar = [
    {
        title: "ติดต่อไลน์",
        description: "",
        logo: <FontAwesomeIcon icon={faLine} />,
        link: "https://lin.ee/tcWxcLF"
    },
    {
        title: "ติดต่อเฟซ",
        description: "",
        logo: <FontAwesomeIcon icon={faFacebook} />,
        link: "https://www.facebook.com/profile.php?id=100078155573991"
    },
];