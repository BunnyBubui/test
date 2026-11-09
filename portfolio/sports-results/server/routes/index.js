const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const routesDir = __dirname;

fs.readdirSync(routesDir).forEach(file => {
    if (file === "index.js") return;
    if (!file.endsWith(".js")) return;

    const fullPath = path.join(routesDir, file);

    try {
        const route = require(fullPath);
        router.use(route);
        console.log(`✅ Loaded route: ${file}`);
    } catch (err) {
        console.error(`❌ Failed to load route: ${file}`);
        console.error(err.stack);
    }
});

module.exports = router;
