const matchService = require("../services/matches.service");
const matchValidator = require("../validators/matches.validator");

exports.getMatches = async (req, res) => {
    try {
        matchValidator.validateGetMatchesQuery(req.query);
        const result = await matchService.getMatches(req.query);
        res.json(result);

    } catch (err) {
        console.error(err);

        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }

        res.status(500).json({ message: "Server Error" });
    }
};