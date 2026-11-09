const router = require("express").Router();
const verifySession = require("../middlewares/verifySession");
const { requireAdmin, requirePublic } = require("../middlewares/requireRole");

const controller = require("../controllers/medals.controller");

router.get("/medals", verifySession, requirePublic, controller.getMedalBoard);
router.post("/medals", verifySession, requireAdmin, controller.addMedals);

module.exports = router;