const VALID_MEDALS = ["gold", "silver", "bronze"];
const db = require("../middlewares/db_connection");
exports.getMedalBoard = async () => {
    const [rows] = await db.execute(`
        SELECT 
            t.team_id,
            t.team_name,
            t.team_color,
            mt.gold,
            mt.silver,
            mt.bronze
        FROM medal_totals mt
        JOIN teams t ON mt.team_id = t.team_id
        ORDER BY mt.gold DESC, mt.silver DESC, mt.bronze DESC
    `);

    return rows;
};

exports.addMedals = async (medals) => {
    if (!Array.isArray(medals) || medals.length === 0) {
        const err = new Error("INVALID_MEDAL_ARRAY");
        err.statusCode = 400;
        throw err;
    }

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        for (const item of medals) {
            let {
                team_id,
                match_id,
                gold = 0,
                silver = 0,
                bronze = 0
            } = item;

            team_id = Number(team_id);
            match_id = Number(match_id);

            if (
                !Number.isInteger(team_id) ||
                !Number.isInteger(match_id)
            ) {
                const err = new Error("INVALID_TEAM_OR_MATCH");
                err.statusCode = 400;
                throw err;
            }

            // ตรวจทีม
            const [[team]] = await conn.execute(
                "SELECT team_id FROM teams WHERE team_id = ?",
                [team_id]
            );
            if (!team) {
                const err = new Error(`TEAM_NOT_FOUND: ${team_id}`);
                err.statusCode = 404;
                throw err;
            }

            /* ===== insert medal_records ตามจำนวน ===== */
            const insertMedal = async (type, count) => {
                for (let i = 0; i < count; i++) {
                    await conn.execute(
                        `INSERT INTO medal_records (team_id, match_id, medal)
                         VALUES (?, ?, ?)`,
                        [team_id, match_id, type]
                    );
                }
            };

            await insertMedal("gold", gold);
            await insertMedal("silver", silver);
            await insertMedal("bronze", bronze);

            /* ===== update medal_totals ===== */
            await conn.execute(
                `
                INSERT INTO medal_totals (team_id, gold, silver, bronze)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    gold = gold + VALUES(gold),
                    silver = silver + VALUES(silver),
                    bronze = bronze + VALUES(bronze)
                `,
                [team_id, gold, silver, bronze]
            );
        }

        await conn.commit();
        return { success: true, teams: medals.length };

    } catch (err) {
        await conn.rollback();

        if (err.code === "ER_DUP_ENTRY") {
            const e = new Error("MEDAL_ALREADY_RECORDED");
            e.statusCode = 409;
            throw e;
        }

        throw err;
    } finally {
        conn.release();
    }
};
