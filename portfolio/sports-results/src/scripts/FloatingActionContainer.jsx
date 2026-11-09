import "./css/FloatingActionContainer.css";

const FloatingActionContainer = ({ children, position = "bottom-right" }) => {
    return (
        <div className={`floating-container ${position}`}>
            {children}
        </div>
    );
};

export default FloatingActionContainer;
