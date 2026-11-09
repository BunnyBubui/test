import { useEffect, useState, useMemo } from "react";
import "./css/Matches.css";
import Nav from "../components/Nav";
import HamburgerMenu from "../components/HamburgerMenu";
import MatchFilters from "../components/MatchFilters";
import { SPORT_OPTIONS, CATEGORY_OPTIONS } from "../utils/Type";
import { selectServer } from "../utils/Server";
import LoadingSpinner from "../scripts/LoadingSpinner";
import Banner from "../components/Banner-Image";
import DailyMatchCard from "../components/DailyMatchCard";
import HeaderTitle from "../components/HeaderTitle";

const BASE_URL = selectServer();

const DailyMatchResults = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [matches, setMatches] = useState([]);   // ตารางแข่งวันนี้
    const [results, setResults] = useState([]);   // ผลแข่งวันนี้

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    const today = new Date().toLocaleDateString("en-CA");
    // ได้ YYYY-MM-DD ตามเวลาท้องถิ่น


    const [filters, setFilters] = useState({
        sport: "",
        category: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);

                const [matchRes, resultRes] = await Promise.all([
                    fetch(`${BASE_URL}/api/matches?date=${today}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "x-public-key": "dsdkmckalsld55"
                        }
                    }),
                    fetch(`${BASE_URL}/api/matches/results?date=${today}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "x-public-key": "dsdkmckalsld55"
                        }
                    })
                ]);

                const matchData = await matchRes.json();
                const resultData = await resultRes.json();

                setMatches(Array.isArray(matchData) ? matchData : []);
                setResults(Array.isArray(resultData) ? resultData : []);

                console.log(resultData)

            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [today]);


    const mergedMatches = useMemo(() => {
        return matches.map(match => {
            const result = results.find(
                r => r.match_id === match.match_id
            );

            let teams = [];

            if (Array.isArray(result?.teams)) {
                teams = result.teams;
            } else if (typeof result?.teams === "string") {
                try {
                    teams = JSON.parse(result.teams);
                } catch (e) {
                    console.error("Invalid teams JSON", result.teams);
                    teams = [];
                }
            }

            return {
                ...match,
                teams
            };
        });
    }, [matches, results]);

    const filteredMatches = useMemo(() => {
        return mergedMatches.filter(m => {
            return (
                (!filters.sport || m.sport_name === filters.sport) &&
                (!filters.category || m.category_name === filters.category)
            );
        });
    }, [mergedMatches, filters]);

    return (
        <div style={{ display: "flex", width: "100%" }}>
            <HamburgerMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <div style={{ width: "100%" }}>
                <Nav toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
                <div className="matches-page">
                    <HeaderTitle title="ผลการแข่งขันวันนี้!" />

                    {loading && <LoadingSpinner />}
                    {error && <div className="observer">โหลดข้อมูลไม่สำเร็จ</div>}
                    
                    {!loading && !error && (
                        <>
                            {filteredMatches.length === 0 && (
                                <div className="observer">
                                    วันนี้ยังไม่มีการแข่งขัน
                                </div>
                            )}

                            <div className="daily-page">
                                {filteredMatches.map(match => (
                                    <DailyMatchCard key={match.match_id} match={match} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyMatchResults;
