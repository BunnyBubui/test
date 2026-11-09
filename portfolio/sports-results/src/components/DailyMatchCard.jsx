import "./css/DailyMatchCard.css";

const getWinner = (match) => {
    if (!Array.isArray(match.teams)) return null;

    const win = match.teams.find(t => t.result === "win");
    return win?.team_id ?? null;
};


const DailyMatchCard = ({ match }) => {
    const teamsArray = Array.isArray(match.teams) ? match.teams : [];
    const winnerId = getWinner({ ...match, teams: teamsArray });
    const firstTeam = teamsArray[0] || match.matchup?.first;
    const secondTeam = teamsArray[1] || match.matchup?.second;
    if (!firstTeam || !secondTeam) return null;
    const firstWin = winnerId === firstTeam.team_id;
    const secondWin = winnerId === secondTeam.team_id;

    console.log(firstTeam)

    return (
        <div className="dmr-card">
            <div className="dmr-card-round">
                <h1>{match.sport_name} - {match.category_name}</h1>
                <h3>{match.round_name}</h3>
            </div>

            <div className="dmr-card-header">
                <span>
                    <h3 className="sport-name"></h3>
                    <p className="gender"></p>
                </span>


            </div>



            {/* body */}
            <div className="dmr-card-body">
                <div className={`dmr-team ${firstWin ? "dmr-team-winner" : winnerId && "dmr-team-lose"}`}>
                    <div className="dmr-team-card">
                        <img src={`pictures/${firstTeam.team_name}.jpg`} alt="" />
                        <p>{firstTeam.team_name}</p>
                    </div>
                </div>

                <div className="dmr-vs">VS</div>

                <div className={`dmr-team ${secondWin ? "dmr-team-winner" : winnerId && "dmr-team-lose"}`}>
                    <div className="dmr-team-card">
                        <img src={`pictures/${secondTeam.team_name}.jpg`} alt="" />
                        <p>{secondTeam.team_name}</p>
                    </div>
                </div>
            </div>

            {!winnerId && (
                <div className="dmr-no-result">
                    ยังไม่มีผลการแข่งขัน
                </div>
            )}

            <div className="dmr-card-footer">
                🕒 {match.match_time} | 📍 {match.location_name}
            </div>


        </div>
    );
};

export default DailyMatchCard;
