const { isPositiveInt, throwError } = require("./common.validator");
const VALID_RESULTS = ["win", "lose", "draw"];

exports.validateMatchResults = (matchId, results) => {

    if (!isPositiveInt(matchId)) {
        throwError("INVALID_MATCH_ID");
    }

    if (!Array.isArray(results) || results.length === 0) {
        throwError("INVALID_RESULTS");
    }

    for (const r of results) {
        if (!isPositiveInt(r.team_id)) {
            throwError("INVALID_TEAM_ID");
        }

        if (!VALID_RESULTS.includes(r.result)) {
            throwError("INVALID_RESULT_VALUE");
        }
    }
};
