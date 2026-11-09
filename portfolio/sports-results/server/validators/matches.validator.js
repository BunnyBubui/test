const { isPositiveInt, throwError } = require("./common.validator");
exports.validateGetMatchesQuery = (query) => {
    const {
        page,
        limit,
        sport_id,
        category_id,
        date
    } = query;

    if (page && !isPositiveInt(page)) {
        throwError("INVALID_PAGE");
    }

    if (limit && !isPositiveInt(limit)) {
        throwError("INVALID_LIMIT");
    }

    if (sport_id && !isPositiveInt(sport_id)) {
        throwError("INVALID_SPORT_ID");
    }

    if (category_id && !isPositiveInt(category_id)) {
        throwError("INVALID_CATEGORY_ID");
    }

    if (date && isNaN(Date.parse(date))) {
        throwError("INVALID_DATE");
    }
};