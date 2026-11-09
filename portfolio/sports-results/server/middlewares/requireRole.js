exports.requireAdmin = (req, res, next) => {
    if (req.admin?.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
};

exports.requirePublic = (req, res, next) => {
    if (!req.admin) {
        return res.status(403).json({ message: "Access Denied" });
    }
    next();
};
