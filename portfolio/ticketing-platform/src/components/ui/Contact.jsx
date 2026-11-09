import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ui/Contact.css";
export const Contact = () => {
    const hasOpened = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasOpened.current) {
            hasOpened.current = true;
            window.open("https://lin.ee/tcWxcLF", "_blank");
        }

        navigate("/");
    }, []);

    return null;
};

export const ShowContact = ({ title = "หากมีปัญหาเรื่องการสั่งซื้อบัตร โปรดติดต่อเรา", link = "https://lin.ee/tcWxcLF" }) => {
    return (
        <a
            href={link}
            target="__blank"
            className="pa-hero-contact">
            {title}
        </a>
    )
};