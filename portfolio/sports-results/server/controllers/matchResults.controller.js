const resultService = require("../services/matchResults.service");
const matchValidator = require("../validators/matchResult.validator");

exports.getResults = async (req, res) => {
    try {
        let date = req.query.date;
        if (req.query.today === "true") {
            date = new Date().toLocaleDateString("en-CA");
        }

        if (date && isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "INVALID_DATE" });
        }

        const filters = {};
        if (date) filters.date = date;
        if (req.query.sport_id) filters.sport_id = req.query.sport_id;
        if (req.query.category_id) filters.category_id = req.query.category_id;
        if (req.query.round_name) filters.round_name = req.query.round_name;

        const result = await resultService.getResults(filters);

        console.log("FINAL FILTERS:", filters);
        console.log("RESULT:", result);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.saveResults = async (req, res) => {
    try {
        matchValidator.validateMatchResults(
            req.params.id,
            req.body.results
        );

        await resultService.saveResults(
            req.params.id,
            req.body.results
        );

        res.status(201).json({ message: "Results saved" });

    } catch (err) {
        console.error(err);

        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }

        res.status(500).json({ message: "Save results failed" });
    }
};