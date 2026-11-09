const db = require("../middlewares/db_connection");

const createSession = (adminId, token, ip, agent) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO admin_sessions (admin_id, token, ip_address, user_agent, is_active) VALUES (?, ?, ?, ?, TRUE)`;
        db.query(sql, [adminId, token, ip, agent], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const getAdminByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM admin_users WHERE username = ?";
        db.query(sql, [username], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const deleteSessionByToken = (token) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM admin_sessions WHERE token = ?";
        db.query(sql, [token], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const getAdminLogs = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT l.*, u.admin_name
            FROM admin_logs l
            LEFT JOIN admin_users u ON l.admin_id = u.admin_id
            ORDER BY l.created_at DESC
            LIMIT 500
        `;
        db.query(sql, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const getSearchLogsByAdminId = (adminId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT s.*, u.admin_name
            FROM admin_search_logs s
            LEFT JOIN admin_users u ON u.admin_id = s.admin_id
            WHERE s.admin_id = ?
            ORDER BY s.created_at DESC
            LIMIT 50
        `;
        db.query(sql, [adminId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

module.exports = {
    createSession,
    getAdminByUsername,
    deleteSessionByToken,
    getAdminLogs,
    getSearchLogsByAdminId
};