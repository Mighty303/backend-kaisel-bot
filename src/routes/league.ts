import express from "express";
import {getStats} from "../controllers/leagueController"
const router = express();

router.get('/stats/:queueId/:region/:id', getStats);

export default router;