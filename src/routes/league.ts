import express from "express";
import {getStats, requestFunction} from "../controllers/leagueController"
const router = express()._router({mergeParams:true});

router.get('/stats/:id/:region/:queueId', getStats);


export default router;