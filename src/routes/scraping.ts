import express from "express";
import { populateDataBase} from "../controllers/scrapingController";
const router = express();

router.get('/', populateDataBase);

export default router;