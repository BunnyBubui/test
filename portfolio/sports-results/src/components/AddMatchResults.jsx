import { useEffect, useMemo, useState } from "react";
import { selectServer } from "../utils/Server";
import "../routers/css/Dashboard.css";
import { TEAM_OPTIONS } from "../utils/Type";
import MatchFilters from "./MatchFilters";
import { showAlert } from "../scripts/Alert";

const BASE_URL = selectServer();
const RESULT_OPTIONS = ["win", "lose", "draw"];

const isAutoMatch = (m) => {
    return (
        m?.matchup &&
        m.matchup.first.team_id !== 7 &&
        m.matchup.second.team_id !== 7
    );
};

const groupMatchesBySportAndCategory = (matches) => {
    const grouped = {};

    matches.forEach(m => {
        const sport = m.sport_name || "อื่นๆ";
        const category = m.category_name || "other";

        if (!grouped[sport]) grouped[sport] = {};
        if (!grouped[sport][category]) grouped[sport][category] = [];

        grouped[sport][category].push(m);
    });

    return grouped;
};

const AddMatchResults = () => {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [results, setResults] = useState([{ team_id: "", result: "" }]);
    const [filters, setFilters] = useState({
        date: "",
        sport: "",
        category: ""
    });
    const [enableMedals, setEnableMedals] = useState(false);
    const [medals, setMedals] = useState({
        gold: "",
        silver: "",
        bronze: ""
    });

    const usedTeams = Object.values(medals).filter(Boolean);

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
                setMatches(Array.isArray(data) ? data : []);
            } catch {
                setMatches([]);
            }
        };
        fetchMatches();
    }, []);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setSelectedMatch(null);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const filteredMatches = useMemo(() => {
        return matches.filter(m =>
            (!filters.date || m.match_date === filters.date) &&
            (!filters.sport || m.sport_name === filters.sport) &&
            (!filters.category || m.category_name === filters.category)
        );
    }, [matches, filters]);

    const groupedMatches = useMemo(() => {
        return groupMatchesBySportAndCategory(filteredMatches);
    }, [filteredMatches]);

    const selectMatch = (m) => {
        if (m === null) {
            const overlay = document.querySelector(".overlay-result-card");
            if (overlay) overlay.classList.add("hide");
            setTimeout(() => {
                setSelectedMatch(m);
            }, 500);
        } else {
            setSelectedMatch(m);
        }



        if (isAutoMatch(m)) {
            setResults([
                { team_id: m.matchup.first.team_id, result: "" },
                { team_id: m.matchup.second.team_id, result: "" }
            ]);
        } else {
            setResults([{ team_id: "", result: "" }]);
        }
    };

    const addResultRow = () =>
        setResults(prev => [...prev, { team_id: "", result: "" }]);

    const removeResultRow = (index) =>
        setResults(prev => prev.filter((_, i) => i !== index));

    const updateResultRow = (index, field, value) =>
        setResults(prev =>
            prev.map((r, i) => i === index ? { ...r, [field]: value } : r)
        );

    const updateAutoResult = (index, value) => {
        setResults(prev => {
            const next = [...prev];
            next[index].result = value;
            next[1 - index].result =
                value === "win" ? "lose" :
                    value === "lose" ? "win" : "draw";
            return next;
        });
    };

    const saveResults = async () => {
        const payload = { results: results.filter(r => r.result) };
        if (!payload.results.length) return alert("กรุณาเลือกผลการแข่งขัน");

        const teamIds = payload.results.map(r => r.team_id);
        if (new Set(teamIds).size !== teamIds.length)
            return alert("ห้ามเลือกทีมซ้ำ");

        const res = await fetch(
            `${BASE_URL}/api/matches/${selectedMatch.match_id}/results`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-token": "5dslsjxnndkd"
                },
                body: JSON.stringify(payload)
            }
        );

        if (!res.ok) return alert("ไม่มีสิทธิ์บันทึกผลการแข่งขัน");
        await showAlert("บันทึกผลสำเร็จ");
        setSelectedMatch(null);
    };

    return (
        <div className="results-page">
            <h2 className="page-title">เพิ่มผลการแข่งขัน</h2>

            <div className="dashboard-filter">
                <MatchFilters
                    filters={filters}
                    setFilters={setFilters}
                    sportOptions={[
                        { label: "กีฬาทั้งหมด", value: "" },
                        ...[...new Set(matches.map(m => m.sport_name))].map(s => ({
                            label: s,
                            value: s
                        }))
                    ]}

                    categoryOptions={[
                        { label: "ไม่ระบุเพศ", value: "" },
                        { label: "ชาย", value: "male" },
                        { label: "หญิง", value: "female" },
                        { label: "ผสม", value: "both" },
                        { label: "พิเศษ", value: "special" }
                    ]}

                    dateOptions={[
                        { label: "ทุกวัน", value: "" },
                        ...[...new Set(matches.map(m => m.match_date))].map(d => ({
                            label: d,
                            value: d
                        }))
                    ]}

                />
            </div>

            <div className="match-select-list">
                {Object.entries(groupedMatches).map(([sport, categories]) => (
                    <div key={sport} className="sport-section">

                        {/* ===== หัวข้อกีฬา ===== */}
                        <div className="sport-header">
                            🏅 {sport}
                        </div>

                        {Object.entries(categories).map(([category, matches]) => (
                            <div key={category} className="category-section">

                                {/* ===== หัวข้อประเภท ===== */}
                                <div className="category-header">
                                    {category === "male" && "👨 ชาย"}
                                    {category === "female" && "👩 หญิง"}
                                    {category === "both" && "👫 ผสม"}
                                    {category === "special" && "⭐ พิเศษ"}
                                    {!["male", "female", "both", "special"].includes(category) && category}
                                </div>

                                {matches.map(m => (
                                    <div
                                        key={m.match_id}
                                        className={`match-select-card ${selectedMatch?.match_id === m.match_id ? "active" : ""
                                            }`}
                                        onClick={() => selectMatch(m)}
                                    >
                                        <div className="date">
                                            {m.match_date} {m.match_time}
                                        </div>

                                        <div className="round">{m.round_name}</div>

                                        <div className="vs-line">
                                            <div className="left">
                                                {m.matchup.first.team_name.includes("จับคู่หน้าสนาม") === false &&
                                                    <img src={`pictures/${m.matchup.first.team_name}.jpg`} alt="" className="pic first" />
                                                }

                                                {m.matchup.first.team_name}
                                            </div>

                                            <span className="vs"> VS </span>

                                            <div className="right">
                                                {m.matchup.first.team_name.includes("จับคู่หน้าสนาม") === false &&
                                                    <img src={`pictures/${m.matchup.second.team_name}.jpg`} alt="" className="pic second" />
                                                }

                                                {m.matchup.second.team_name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {selectedMatch && (
                <div className="overlay-result-card">
                    <div className="result-card">
                        <div className="dash-close">
                            <button className="dash-close-btn" onClick={() => selectMatch(null)}>X</button>
                        </div>
                        <h3>กรอกผลการแข่งขัน</h3>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={enableMedals}
                                    onChange={(e) => setEnableMedals(e.target.checked)}
                                    style={{ marginRight: 8 }}
                                />
                                🥇 บันทึกเหรียญการแข่งขันนี้ด้วย
                            </label>
                        </div>

                        {results.map((r, index) => (
                            <div className="result-row" key={index}>
                                {isAutoMatch(selectedMatch) ? (
                                    <div className="team-label">
                                        {TEAM_OPTIONS.find(t => t.value === r.team_id)?.label}
                                    </div>
                                ) : (
                                    <select value={r.team_id}
                                        onChange={e =>
                                            updateResultRow(index, "team_id", Number(e.target.value))
                                        }>
                                        <option value="">เลือกทีม</option>
                                        {TEAM_OPTIONS.map(t =>
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        )}
                                    </select>
                                )}

                                <select value={r.result}
                                    onChange={e =>
                                        isAutoMatch(selectedMatch)
                                            ? updateAutoResult(index, e.target.value)
                                            : updateResultRow(index, "result", e.target.value)
                                    }>
                                    <option value="">ผล</option>
                                    {RESULT_OPTIONS.map(o =>
                                        <option key={o} value={o}>{o}</option>
                                    )}
                                </select>

                                {!isAutoMatch(selectedMatch) && results.length > 1 &&
                                    <button className="btn-delete"
                                        onClick={() => removeResultRow(index)}>✖</button>
                                }
                            </div>
                        ))}

                        {enableMedals && (
                            <div className="medal-section">
                                <h4>บันทึกเหรียญ (เลือกได้เหรียญละ 1 ทีม)</h4>

                                {["gold", "silver", "bronze"].map(type => (
                                    <div className="result-row" key={type}>
                                        <label style={{ width: 60 }}>
                                            {type === "gold" && "🥇"}
                                            {type === "silver" && "🥈"}
                                            {type === "bronze" && "🥉"}
                                        </label>

                                        <select
                                            value={medals[type]}
                                            onChange={e =>
                                                setMedals(prev => ({
                                                    ...prev,
                                                    [type]: Number(e.target.value) || ""
                                                }))
                                            }
                                        >
                                            <option value="">เลือกทีม</option>

                                            {TEAM_OPTIONS
                                                .filter(t =>
                                                    !usedTeams.includes(t.value) ||
                                                    t.value === medals[type]
                                                )
                                                .map(t => (
                                                    <option key={t.value} value={t.value}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="result-actions">
                            {!isAutoMatch(selectedMatch) &&
                                <button className="btn-add" onClick={addResultRow}>➕ เพิ่มทีม</button>
                            }

                            <button className="btn-save" onClick={saveResults}>💾 บันทึกผล</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMatchResults;
