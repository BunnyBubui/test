const db = require("../middlewares/db_connection");

exports.getMatches = async (query) => {

    let where = "1=1";
    const params = [];

    if (query.search) {
        where += ` AND (
            s.sport_name LIKE ? OR
            l.location_name LIKE ? OR
            m.round_name LIKE ?
        )`;
        const like = `%${query.search}%`;
        params.push(like, like, like);
    }

    if (query.sport_id) {
        where += " AND m.sport_id = ?";
        params.push(Number(query.sport_id));
    }

    if (query.category_id) {
        where += " AND m.category_id = ?";
        params.push(Number(query.category_id));
    }

    if (query.date) {
        where += " AND m.match_date = ?";
        params.push(query.date); // YYYY-MM-DD
    }

    const sql = `
        SELECT
            m.match_id,

            DATE_FORMAT(m.match_date, '%Y-%m-%d') AS match_date,
            TIME_FORMAT(m.match_time, '%H:%i') AS match_time,

            m.round_name,

            s.sport_name,
            c.category_name,
            l.location_name,

            m.first_team,
            m.second_team,

            CASE 
                WHEN m.first_team = 7 THEN 'จับคู่หน้าสนาม'
                ELSE t1.team_name
            END AS first_team_name,

            CASE 
                WHEN m.second_team = 7 THEN 'จับคู่หน้าสนาม'
                ELSE t2.team_name
            END AS second_team_name,

            (m.first_team = 7)  AS is_first_special,
            (m.second_team = 7) AS is_second_special

        FROM matches m
        JOIN sports s ON m.sport_id = s.sport_id
        JOIN categories c ON m.category_id = c.categories_id
        JOIN locations l ON m.location_id = l.location_id
        LEFT JOIN teams t1 ON m.first_team = t1.team_id
        LEFT JOIN teams t2 ON m.second_team = t2.team_id
        WHERE ${where}
        ORDER BY 
    m.sport_id ASC,
    m.match_date ASC,
    m.match_time ASC

    `;

    const [rows] = await db.execute(sql, params);

    return rows.map(r => ({
        match_id: r.match_id,
        match_date: r.match_date,
        match_time: r.match_time,
        round_name: r.round_name,
        sport_name: r.sport_name,
        category_name: r.category_name,
        location_name: r.location_name,

        matchup: {
            first: {
                team_id: r.first_team,
                team_name: r.first_team_name,
                is_special: Boolean(r.is_first_special)
            },
            second: {
                team_id: r.second_team,
                team_name: r.second_team_name,
                is_special: Boolean(r.is_second_special)
            }
        }
    }));

};
