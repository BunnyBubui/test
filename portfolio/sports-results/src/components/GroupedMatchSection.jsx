import MatchTableRow from "./MatchTableRow";

const GroupedMatchSection = ({
    groupedMatches,
    rows = 4,
    isResult = false
}) => {
    if (!groupedMatches || Object.keys(groupedMatches).length === 0) {
        return <div className="observer">ไม่พบข้อมูล</div>;
    }

    return (
        <>
            {Object.entries(groupedMatches).map(([groupKey, items]) => {
                const sport = items[0]?.sport_name;
                const category = items[0]?.category_name;

                return (
                    <div key={groupKey} className="group-section">
                        <h3 className="group-title">
                            <img
                                src={`pictures/icon/${sport}.png`}
                                alt={sport}
                                className="group-icon"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                            <span className="group-text">
                                {sport} | {category}
                            </span>
                        </h3>

                        <div className="match-list">
                            {items.map((m, i) => (
                                <MatchTableRow
                                    key={m.match_id}
                                    match={m}
                                    index={i}
                                    rows={rows}
                                    isResult={isResult}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default GroupedMatchSection;
