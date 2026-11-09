import { useNavigate } from "react-router-dom";

const Contact = () => {
    const navigate = useNavigate();
    const handleOpen = () => {
        window.open("https://www.facebook.com/WUSABs", "_blank");
        navigate("/home");
    };

    return (
        <div style={{ padding: 20 }}>
            <button onClick={handleOpen}>
                เปิดเพจบน Facebook
            </button>
        </div>
    );
};

export default Contact;
