const router = require('express').Router({mergeParams:true});

const leagueRouter = require("./league");

router.use("/league", leagueRouter);

module.exports = router;