const router = require('express').Router({mergeParams:true});
const { getStats } = require("../controllers/leagueController.js");

router.get('/stats/:id/:region/:queueId', getStats);


module.exports = router;