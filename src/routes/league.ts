import express from "express";
import {getStats, getMatchHistory} from "../controllers/leagueController"
const router = express();

router.get('/stats/:queueId/:region/:id', getStats);
router.get('/match/:queueId/:region/:id', getMatchHistory);

export default router;