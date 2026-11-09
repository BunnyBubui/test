import { useState, useEffect } from "react";
import './css/UserHome.css';
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";

const UserHome = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    const navigate = useNavigate();
    useEffect(() => {
        document.body.style.overflow = "";
    }, []);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <HamburgerMenu 
                    isOpen={isMenuOpen} 
                    onClose={() => setIsMenuOpen(false)} 
                />
                
                <div style={{ display: "flex", flexDirection: "column", width: "100%"}}>
                    <Nav
                        toggleMenu={() => setIsMenuOpen(!isMenuOpen)} 
                        isMenuOpen={isMenuOpen}
                    />
                </div>
            </div>
        </>
    );
};

export default UserHome;