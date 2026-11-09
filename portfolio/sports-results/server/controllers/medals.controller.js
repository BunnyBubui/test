const medalService = require("../services/medals.service");
exports.getMedalBoard = async (req, res) => {
    try {
        const data = await medalService.getMedalBoard();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addMedals = async (req, res) => {
    try {
        const { medals } = req.body;
        const result = await medalService.addMedals(medals);

        res.status(201).json({
            message: "Medals recorded successfully",
            ...result
        });

    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Server Error"
        });
    }
};
