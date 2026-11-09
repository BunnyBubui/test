exports.isPositiveInt = (value) => {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
};

exports.isNonEmptyString = (value) => {
    return typeof value === "string" && value.trim().length > 0;
};

exports.throwError = (message, statusCode = 400) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    throw err;
};
