import { Clock, MapPin, Phone, Star } from "lucide-react"
import useScrollAnimation from "../../hooks/useScrollAnimation"
import "../../styles/header/InfoBar.css";

const InfoBar = ({ place }) => {
    useScrollAnimation();

    return (
        <div className="info-bar animate-fade-top">
            <div className="info-item">
                <Clock size={20} color="#16a34a" /> <span>{place.time || "เปิดทำการทุกวัน"}</span>
            </div>
            {place.location && (
                <div className="info-item">
                    <MapPin size={20} color="#16a34a" /> <span>{place.location}</span>
                </div>
            )}
            {place.contact && (
                <div className="info-item">
                    <Phone size={20} color="#16a34a" /> <span>{place.contact}</span>
                </div>
            )}
            <div className="info-item">
                <Star size={20} color="#f59e0b" fill="#f59e0b" />
                <span><strong>{place.rating || "5.0"}</strong> ({place.reviews || "ไม่มี"} รีวิว)</span>
            </div>
        </div>
    )
}

export default InfoBar;