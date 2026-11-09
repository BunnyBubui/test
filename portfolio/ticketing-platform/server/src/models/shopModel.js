const db = require("../middlewares/db_connection");

const getAllShops = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM shops ORDER BY shop_id ASC";
        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = {
    getAllShops
};