import express from "express";
import leagueRouter from "./league";


const router = express()._router({mergeParams:true});
router.use("/league", leagueRouter);

export default router;
