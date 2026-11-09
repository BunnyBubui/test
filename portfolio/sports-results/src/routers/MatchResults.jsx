import { useEffect, useState, useMemo } from "react";
import "./css/Matches.css";
import Nav from "../components/Nav";
import HamburgerMenu from "../components/HamburgerMenu";
import { selectServer } from "../utils/Server";
import LoadingSpinner from "../scripts/LoadingSpinner";
import MatchTableHeader from "../components/MatchTableHeader";
import MatchTableRow from "../components/MatchTableRow";
import MatchFilters from "../components/MatchFilters";
import GroupedMatchSection from "../components/GroupedMatchSection";
import { SPORT_OPTIONS, CATEGORY_OPTIONS, DATE_OPTIONS } from "../utils/Type";
import HeaderTitle from "../components/HeaderTitle";

const BASE_URL = selectServer();

const groupMatches = (matches) =>
    matches.reduce((acc, m) => {
        const key = `${m.sport_name} | ${m.category_name}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
    }, {});

const MatchResults = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filters, setFilters] = useState({
        sport: "",
        category: "",
        date: ""
    });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/matches/results`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-public-key": "dsdkmckalsld55"
                    }
                });

                const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const toDateOnly = (d) => d?.slice(0, 10);

    const filteredResults = useMemo(() => {
        return results.filter(m => {
            return (
                (!filters.sport || m.sport_name === filters.sport) &&
                (!filters.category || m.category_name === filters.category) &&
                (!filters.date || toDateOnly(m.match_date) === toDateOnly(filters.date))
            );
        });
    }, [results, filters]);

    const groupedResults = useMemo(
        () => groupMatches(filteredResults),
        [filteredResults]
    );

    const dateOptionsFromResults = useMemo(() => {
        const dates = [...new Set(results.map(m => toDateOnly(m.match_date)))];

        dates.sort((a, b) => new Date(a) - new Date(b));

        return [
            { value: "", label: "ทุกวัน" },
            ...dates.map(d => ({ value: d, label: d }))
        ];
    }, [results]);



    return (
        <div style={{ display: "flex", width: "100%" }}>
            <HamburgerMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <Nav toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
                <div className="matches-page">
                    <HeaderTitle title="ผลการแข่งขันทั้งหมด" hideLogo={true} />
                    <MatchFilters
                        filters={filters}
                        setFilters={setFilters}
                        sportOptions={SPORT_OPTIONS}
                        categoryOptions={CATEGORY_OPTIONS}
                        dateOptions={dateOptionsFromResults}
                    />

                    {loading && <LoadingSpinner />}
                    {error && <div className="observer">โหลดผลการแข่งขันไม่สำเร็จ</div>}

                    {!loading && !error && (
                        <>
                            <MatchTableHeader rows={3} />

                            {Object.entries(groupedResults).length > 0 ? (
                                <GroupedMatchSection
                                    groupedMatches={groupedResults}
                                    rows={3}
                                    isResult
                                />
                            ) : (
                                <div className="observer">ไม่พบผลการแข่งขัน</div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchResults;
