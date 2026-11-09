const router = require("express").Router();
const verifySessions = require("../middlewares/verifySession");
const { requireAdmin, requirePublic } = require("../middlewares/requireRole");

const matchCtrl = require("../controllers/matches.controller");
const resultCtrl = require("../controllers/matchResults.controller");

router.get("/matches", verifySessions, requirePublic, matchCtrl.getMatches);
router.get("/matches/results", verifySessions, requirePublic, resultCtrl.getResults);
router.post("/matches/:id/results", verifySessions, requireAdmin, resultCtrl.saveResults);


module.exports = router;