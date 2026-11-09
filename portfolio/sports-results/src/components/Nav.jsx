import "./css/Nav.css";
import { Menu } from "lucide-react";
const Nav = ({ toggleMenu, isMenuOpen }) => {

    return (
        <>
            <div className={`navbar`}>
                <div className="nav-group">
                    <button className={`hamburger-btn ${isMenuOpen && "hide"}`} onClick={() => toggleMenu()}>
                        <Menu size={28} color="#fff" />
                    </button>

                    <div className="nav-right">
                        <div className="nav-border">

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;
