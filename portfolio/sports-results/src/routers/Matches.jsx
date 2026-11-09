import { useEffect, useState, useMemo } from "react";
import "./css/Matches.css";
import Nav from "../components/Nav";
import HamburgerMenu from "../components/HamburgerMenu";
import { selectServer } from "../utils/Server";
import LoadingSpinner from "../scripts/LoadingSpinner";
import { SPORT_OPTIONS, CATEGORY_OPTIONS, DATE_OPTIONS } from "../utils/Type";
import MatchFilters from "../components/MatchFilters";
import MatchTableHeader from "../components/MatchTableHeader";
import MatchTableRow from "../components/MatchTableRow";
import Banner from "../components/Banner-Image";
import GroupedMatchSection from "../components/GroupedMatchSection";
import HeaderTitle from "../components/HeaderTitle";

const BASE_URL = selectServer();

const groupMatches = (matches) =>
    matches.reduce((acc, m) => {
        const key = `${m.sport_name} | ${m.category_name}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
    }, {});

const Matches = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [filters, setFilters] = useState({
        sport: "",
        category: "",
        date: ""
    });

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/matches`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-public-key": "dsdkmckalsld55"
                    }
                });

                const data = await res.json();
                setMatches(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const filteredMatches = useMemo(() => {
        return matches.filter(m => {
            return (
                (!filters.sport || m.sport_name === filters.sport) &&
                (!filters.category || m.category_name === filters.category) &&
                (!filters.date || m.match_date === filters.date)
            );
        });
    }, [matches, filters]);

    const groupedMatches = useMemo(
        () => groupMatches(filteredMatches),
        [filteredMatches]
    );

    const toDateOnly = (d) => d?.slice(0, 10);

    const dateOptionsFromResults = useMemo(() => {
        const dates = [...new Set(matches.map(m => toDateOnly(m.match_date)))];

        dates.sort((a, b) => new Date(a) - new Date(b));

        return [
            { value: "", label: "ทุกวัน" },
            ...dates.map(d => ({ value: d, label: d }))
        ];
    }, [matches]);


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
                <div className="matches-page">
                    <HeaderTitle title="ตารางการแข่งขัน" hideLogo={true}/>

                    <MatchFilters
                        filters={filters}
                        setFilters={setFilters}
                        sportOptions={SPORT_OPTIONS}
                        categoryOptions={CATEGORY_OPTIONS}
                        dateOptions={dateOptionsFromResults}
                    />

                    {loading && <LoadingSpinner />}
                    {error && <div className="observer">โหลดข้อมูลไม่สำเร็จ</div>}

                    {!loading && !error && (
                        <>
                            <MatchTableHeader rows={4} />

                            {Object.entries(groupedMatches).length > 0 ? (
                                <GroupedMatchSection
                                    groupedMatches={groupedMatches}
                                    rows={4}
                                />
                            ) : (
                                <div className="observer">ไม่พบข้อมูลการแข่งขัน</div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Matches;
