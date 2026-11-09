exports.canRead = (role) => {
    return ["public", "admin"].includes(role);
};

exports.canWrite = (role) => {
    return role === "admin";
};
