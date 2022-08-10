import express from "express";
import leagueRouter from "./league";
import scrapingRouter from "./scraping";


const router = express()
router.use("/league", leagueRouter);
router.use("/startscraping", scrapingRouter);

export default router;
