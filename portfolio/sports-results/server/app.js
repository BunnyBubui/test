const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const Routes = require("./routes");
const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());

app.use("/api", Routes);
app.use(errorHandler);

app.use(express.static(path.join(__dirname, "./publics")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./publics/index.html"));
});

module.exports = app;
