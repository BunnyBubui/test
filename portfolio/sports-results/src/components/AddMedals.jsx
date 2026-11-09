import { useEffect, useMemo, useState } from "react";
import { selectServer } from "../utils/Server";
import "../routers/css/Dashboard.css";
import { TEAM_OPTIONS } from "../utils/Type";

const BASE_URL = selectServer();

const emptyRow = {
    team_id: "",
    gold: 0,
    silver: 0,
    bronze: 0
};

const AddMedals = () => {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [rows, setRows] = useState([ { ...emptyRow } ]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [filters, setFilters] = useState({ date: "", sport: "" });

    /* ===== fetch matches ===== */
    useEffect(() => {
        const fetchMatches = async () => {
            const res = await fetch(`${BASE_URL}/api/matches`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-public-key": "dsdkmckalsld55"
                }
            });
            const data = await res.json();
            setMatches(Array.isArray(data) ? data : []);
        };
        fetchMatches();
    }, []);

    useEffect(() => {
        setVisibleCount(10);
    }, [filters]);

    /* ===== filter ===== */
    const filteredMatches = useMemo(() => {
        return matches.filter(m =>
            (!filters.date || m.match_date === filters.date) &&
            (!filters.sport || m.sport_name === filters.sport)
        );
    }, [matches, filters]);

    /* ===== handlers ===== */
    const addRow = () => setRows(prev => [...prev, { ...emptyRow }]);
    const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

    const updateRow = (i, field, value) => {
        setRows(prev =>
            prev.map((r, idx) =>
                idx === i ? { ...r, [field]: Number(value) } : r
            )
        );
    };

    /* ===== save ===== */
    const saveMedals = async () => {
        if (!selectedMatch) return;

        const payload = {
            medals: rows
                .filter(r => r.team_id && (r.gold || r.silver || r.bronze))
                .map(r => ({
                    ...r,
                    match_id: selectedMatch.match_id
                }))
        };

        if (payload.medals.length === 0) {
            alert("ยังไม่ได้กรอกเหรียญ");
            return;
        }

        const res = await fetch(`${BASE_URL}/api/medals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-token": "5dslsjxnndkd"
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            alert("บันทึกเหรียญไม่สำเร็จ");
            return;
        }

        alert("บันทึกเหรียญสำเร็จ");
        setRows([{ ...emptyRow }]);
        setSelectedMatch(null);
    };

    return (
        <div className="results-page">
            <h2 className="page-title">เพิ่มเหรียญรางวัล</h2>

            {/* ===== Filters ===== */}
            <div className="filter-bar">
                <input
                    type="date"
                    value={filters.date}
                    onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                />
                <select
                    value={filters.sport}
                    onChange={e => setFilters(f => ({ ...f, sport: e.target.value }))}
                >
                    <option value="">ทุกประเภท</option>
                    {[...new Set(matches.map(m => m.sport_name))].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* ===== Match list ===== */}
            <div className="match-select-list">
                {filteredMatches.slice(0, visibleCount).map(m => (
                    <div
                        key={m.match_id}
                        className={`match-select-card ${selectedMatch?.match_id === m.match_id ? "active" : ""}`}
                        onClick={() => setSelectedMatch(m)}
                    >
                        <div className="date">
                            {m.match_date} {m.match_time}
                        </div>
                        <div className="round">{m.round_name}</div>
                        <div className="vs-line">
                            {m.matchup.first.team_name}
                            <span className="vs"> VS </span>
                            {m.matchup.second.team_name}
                        </div>
                    </div>
                ))}
            </div>

            {filteredMatches.length > visibleCount && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                    <button className="btn-add" onClick={() => setVisibleCount(v => v + 10)}>
                        แสดงเพิ่มเติม
                    </button>
                </div>
            )}

            {/* ===== Medal form ===== */}
            {selectedMatch && (
                <div className="overlay-result-card">
                    <div className="result-card">
                        <h3>บันทึกเหรียญการแข่งขัน</h3>

                        {rows.map((r, i) => (
                            <div className="result-row" key={i}>
                                <select
                                    value={r.team_id}
                                    onChange={e => updateRow(i, "team_id", e.target.value)}
                                >
                                    <option value="">เลือกทีม</option>
                                    {TEAM_OPTIONS.map(t => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    min="0"
                                    value={r.gold}
                                    onChange={e => updateRow(i, "gold", e.target.value)}
                                    placeholder="🥇"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={r.silver}
                                    onChange={e => updateRow(i, "silver", e.target.value)}
                                    placeholder="🥈"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={r.bronze}
                                    onChange={e => updateRow(i, "bronze", e.target.value)}
                                    placeholder="🥉"
                                />

                                {rows.length > 1 && (
                                    <button className="btn-delete" onClick={() => removeRow(i)}>
                                        ✖
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="result-actions">
                            <button className="btn-add" onClick={addRow}>
                                ➕ เพิ่มทีม
                            </button>
                            <button className="btn-save" onClick={saveMedals}>
                                💾 บันทึกเหรียญ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMedals;
