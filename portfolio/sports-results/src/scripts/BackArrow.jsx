import { useNavigate } from "react-router-dom";
import "./css/BackArrow.css";
import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const navigate = useNavigate();

  return (
    <div className="back-arrow" onClick={() => navigate(-1)}>
      <ArrowLeft size={22} />
    </div>
  );
};

export default BackArrow;
