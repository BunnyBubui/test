// src/components/MatchTableHeader.jsx
const MatchTableHeader = ({ rows = 4 }) => {
    return (
        <div className={`match-header rows${rows}`}>
            <div>วัน / เวลา</div>
            <div>รอบ</div>
            <div>การแข่งขัน</div>
            {rows === 4 && <div>สถานที่</div>}
        </div>
    );
};

export default MatchTableHeader;
