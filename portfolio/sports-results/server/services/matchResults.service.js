const VALID_RESULTS = ["win", "lose", "draw"];
const db = require("../middlewares/db_connection");

exports.saveResults = async (matchId, results) => {
    if (!matchId || !Array.isArray(results) || results.length === 0) {
        const err = new Error("INVALID_INPUT");
        err.statusCode = 400;
        throw err;
    }

    for (const r of results) {
        if (!r.team_id || !VALID_RESULTS.includes(r.result)) {
            const err = new Error("INVALID_RESULT_FORMAT");
            err.statusCode = 400;
            throw err;
        }
    }

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();
        const insertSql = `
            INSERT INTO match_results
            (match_id, team_id, result, record_datetime)
            VALUES (?, ?, ?, NOW())
        `;

        for (const r of results) {
            await conn.execute(insertSql, [
                matchId,
                r.team_id,
                r.result
            ]);
        }

        await conn.commit();
        return { match_id: matchId };

    } catch (error) {
        await conn.rollback();
        throw error;

    } finally {
        conn.release();
    }
};

exports.getResults = async ({ date, sport_id, category_id, round_name }) => {
    let where = "1=1";
    const params = [];

    if (date) {
        where += " AND m.match_date = ?";
        params.push(date);
    }

    if (sport_id) {
        where += " AND m.sport_id = ?";
        params.push(Number(sport_id));
    }

    if (category_id) {
        where += " AND m.category_id = ?";
        params.push(Number(category_id));
    }

    if (round_name) {
        where += " AND m.round_name = ?";
        params.push(round_name);
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
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'team_id', t.team_id,
                    'team_name', t.team_name,
                    'team_color', t.team_color,
                    'result', mr.result
                )
            ) AS teams
        FROM match_results mr
        JOIN matches m ON mr.match_id = m.match_id
        JOIN teams t ON mr.team_id = t.team_id
        JOIN sports s ON m.sport_id = s.sport_id
        JOIN categories c ON m.category_id = c.categories_id
        JOIN locations l ON m.location_id = l.location_id
        WHERE ${where}
        GROUP BY m.match_id
        ORDER BY m.match_time ASC
    `;

    console.log("SQL:", sql);
    console.log("PARAMS:", params);

    const [rows] = await db.execute(sql, params);
    return rows;
};


