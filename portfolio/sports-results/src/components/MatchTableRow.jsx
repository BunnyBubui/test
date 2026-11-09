import React from "react";
const MatchTableRow = ({ match, index, rows = 4, isResult = false }) => {
    const isSpecialTeam = (team) => team?.team_id === 7;

    const renderResultBadge = (result) => {
        if (result === "win")
            return <span className="badge" style={{ background: "#4caf50" }}>Win</span>;
        if (result === "lose")
            return <span className="badge" style={{ background: "#f44336" }}>Lose</span>;
        return <span className="badge" style={{ background: "#9e9e9e" }}>Draw</span>;
    };

    let teams = match.teams;
    if (typeof teams === "string") {
        try {
            teams = JSON.parse(teams);
        } catch {
            teams = [];
        }
    }

    return (
        <div className={`match-card ${index % 2 === 0 ? "even" : "odd"} rows${rows}`}>
            <div className="cell date">
                {match.match_date}
                <div className="time">{match.match_time}</div>
            </div>

            <div className="cell round">
                {match.round_name}
                {match.round_name?.includes("รอบคัดเลือก") === false &&
                    match.round_name !== "A" &&
                    match.round_name !== "B" && (
                        <span className="badge">พิเศษ</span>
                    )}
            </div>

            <div className="cell teams">
                {isResult ? (

                    teams?.map((t, i) => (
                        <React.Fragment key={t.team_id}>
                            <div className="team center">
                                <div className="item">
                                    <div className="top">
                                        {t.team_name && (
                                            <img
                                                className="pic first"
                                                src={`pictures/${t.team_name}.jpg`}
                                                onError={(e) => (e.target.style.display = "none")}
                                            />
                                        )}
                                        <div>{t.team_name}</div>
                                    </div>

                                    <div className="bottom">
                                        {renderResultBadge(t.result)}
                                    </div>
                                </div>
                            </div>

                            {teams.length === 2 && i === 0 && (
                                <span className="vs">VS</span>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    match.sport_name !== "Athletics" ? (
                        <>
                            <span
                                className={`team left ${isSpecialTeam(match.matchup.first) ? "special" : ""}`}
                            >
                                {!match.matchup.first.team_name.includes("จับคู่หน้าสนาม") && (
                                    <img
                                        className="pic first"
                                        src={`pictures/${match.matchup.first.team_name}.jpg`}
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                )}
                                {match.matchup.first.team_name}
                            </span>

                            <span className="vs">VS</span>

                            <span
                                className={`team right ${isSpecialTeam(match.matchup.second) ? "special" : ""}`}
                            >
                                {!match.matchup.second.team_name.includes("จับคู่หน้าสนาม") && (
                                    <img
                                        className="pic second"
                                        src={`pictures/${match.matchup.second.team_name}.jpg`}
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                )}
                                {match.matchup.second.team_name}
                            </span>
                        </>
                    ) : (
                        <span className="vs special-text">แมตช์หน้าสนาม</span>
                    )
                )}
            </div>

            {rows === 4 && (
                <div className="cell meta">
                    {match.location_name}
                </div>
            )}
        </div>
    );
};

export default MatchTableRow;
