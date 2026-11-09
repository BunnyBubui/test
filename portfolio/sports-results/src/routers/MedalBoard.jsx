import { useEffect, useState, useMemo } from "react";
import "./css/MedalBoard.css";
import Nav from "../components/Nav";
import HamburgerMenu from "../components/HamburgerMenu";
import Banner from "../components/Banner-Image";
import LoadingSpinner from "../scripts/LoadingSpinner";
import { selectServer } from "../utils/Server";
import { Medal } from "lucide-react";
import HeaderTitle from "../components/HeaderTitle";

const BASE_URL = selectServer();

/* ===== rank (dense ranking) ===== */
const rankMedals = (teams) => {
    let lastKey = null;
    let rank = 0;

    return teams.map(t => {
        const key = `${t.gold}-${t.silver}-${t.bronze}`;
        if (key !== lastKey) {
            rank += 1;
            lastKey = key;
        }
        return { ...t, rank };
    });
};

/* ===== Medal Card ===== */
const MedalCard = ({ team, size = "md" }) => {
    return (
        <div className={`medal-card ${size} rank-${team.rank}`}
            style={{
                background: `url("pictures/${team.team_name}-bg.jpg")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}>

            <div className="medals">
                <span className="gold">
                    <Medal color="rgb(129, 115, 48)" fill="rgb(255, 213, 0)" size={24} />
                    <p>{team.gold}</p>
                </span>

                <span className="silver">
                    <Medal color="rgb(173, 173, 173)" fill="rgb(255, 255, 255)" size={24} />
                    <p>{team.silver}</p>
                </span>

                <span className="bronze">
                    <Medal color="rgb(130, 91, 75)" fill="rgb(237, 162, 129)" size={24} />
                    <p>{team.bronze}</p>
                </span>
            </div>
        </div>
    );
};

const MedalBoard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [medals, setMedals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMedals = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/medals`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-public-key": "dsdkmckalsld55"
                    }
                });
                const data = await res.json();
                setMedals(Array.isArray(data) ? data : []);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchMedals();
    }, []);

    const ranked = useMemo(() => rankMedals(medals), [medals]);

    const top1 = ranked.filter(t => t.rank === 1);
    const top2 = ranked.filter(t => t.rank === 2);
    const top3 = ranked.filter(t => t.rank === 3);
    const others = ranked.filter(t => t.rank > 3);

    return (
        <div style={{ display: "flex", width: "100%" }}>
            <HamburgerMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <Nav
                    toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                    isMenuOpen={isMenuOpen}
                />

                <div className="medal-page">
                    <div style={{display : "flex", justifyContent: "center", marginBottom: 20}}>
                        <HeaderTitle title="ตารางคะแนนเหรียญรางวัล" hideLogo={true} />
                    </div>

                    {loading && <LoadingSpinner />}
                    {error && <div className="observer">โหลดข้อมูลไม่สำเร็จ</div>}

                    {!loading && !error && (
                        <>
                            {/* ===== TOP 1 ===== */}
                            <div className="medal-top1">
                                {top1.map(t => (
                                    <MedalCard key={t.team_id} team={t} size="xl" />
                                ))}
                            </div>

                            {/* ===== TOP 2 & 3 ===== */}
                            <div className="medal-top23">
                                {[...top2, ...top3].map(t => (
                                    <MedalCard key={t.team_id} team={t} size="lg" />
                                ))}
                            </div>

                            {/* ===== OTHERS ===== */}
                            <div className="medal-grid">
                                {others.map(t => (
                                    <MedalCard key={t.team_id} team={t} size="md" />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedalBoard;
