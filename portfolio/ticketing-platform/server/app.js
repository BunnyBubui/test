const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
require("dotenv").config({path: path.join(__dirname, "./configs/db.env")})

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "./public/uploads")));

const routesPath = path.join(__dirname, "src", "routes");
try {
  const files = fs.readdirSync(routesPath);
  
  files.forEach((file) => {
    if (file.endsWith(".js") && file !== "dataRoutes.js") { 
      const filePath = path.join(routesPath, file);
      
      try {
        const routeModule = require(filePath);
        if (typeof routeModule === 'function' || typeof Object.getPrototypeOf(routeModule) === 'function') {
            app.use("/api", routeModule);
            console.log(`✅ Router loaded  : ${file}`);
        } else {
            console.log(`⚠️ Router skipped : ${file} (ไม่ได้ Export Router อย่างถูกต้อง)`);
        }
      } catch (err) {
        console.log(`❌ Router failed  : ${file} =>`, err.message);
      }
    }
  });

  const dataRoutePath = path.join(routesPath, "dataRoutes.js");
  if (fs.existsSync(dataRoutePath)) {
      const dataRouteModule = require(dataRoutePath);
      app.use("/api", dataRouteModule);
      console.log(`✅ Router loaded  : dataRoutes.js (Loaded Last)`);
  }

} catch (err) {
  console.error("❌ ไม่สามารถอ่านโฟลเดอร์ src/routes ได้:", err.message);
}

app.use(express.static(path.join(__dirname, "./clients")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./clients/index.html"));
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("🚀 Server started successfully on port 3000.");
  } else {
    console.log("❌ Server failed to start:", err);
  }
});