import express from "express";
import leagueRouter from "./league";


const router = express()
router.use("/league", leagueRouter);

export default router;
