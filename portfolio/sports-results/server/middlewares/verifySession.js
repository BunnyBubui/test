module.exports = (req, res, next) => {
    const publicKey = req.headers["x-public-key"];
    const adminToken = req.headers["x-admin-token"];

    if (adminToken === process.env.ADMIN_TOKEN) {
        req.admin = { role: "admin" };
        return next();
    }

    if (req.method === "GET" && publicKey === process.env.PUBLIC_API_KEY) {
        req.admin = { role: "public" };
        return next();
    }

    return res.status(403).json({ message: "Access Denied" });
}