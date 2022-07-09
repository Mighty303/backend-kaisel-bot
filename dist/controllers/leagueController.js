"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const axios_1 = __importDefault(require("axios"));
const SEASON_12_BEGINS_TIMESTAMP = 1641297600;
// Dev KEY
// Get Summoner ID
const getEncryptID = (sumName, region) => __awaiter(void 0, void 0, void 0, function* () {
    function sumInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${sumName}`, {
                headers: {
                    "X-Riot-Token": process.env.riotAPIKey
                },
                params: {}
            });
        });
    }
    return ((yield sumInfo()).data);
});
const getRankedStatsID = (sumID, region) => __awaiter(void 0, void 0, void 0, function* () {
    function sumInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${sumID}`, {
                headers: {
                    "X-Riot-Token": process.env.riotAPIKey
                },
                params: {}
            });
        });
    }
    return ((yield sumInfo()).data);
});
const findQueueData = (queuesData, queueRequested) => {
    const data = {};
    const dataFound = queuesData.find((queue) => {
        if (queue.queueType === "RANKED_SOLO_5x5" && queueRequested === "Solo") {
            return queue;
        }
        else if (queue.queueType === "RANKED_FLEX_SR" && queueRequested === "Flex") {
            return queue;
        }
    });
    return dataFound !== undefined ? dataFound : data;
};
// Return summoner id for now
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.queueId !== "Solo" && req.params.queueId !== "Flex") {
        res.json({
            message: "Bad Request",
        }).status(400);
    }
    else {
        getEncryptID(req.params.id, req.params.region).then(({ id }) => {
            getRankedStatsID(id, req.params.region).then((result) => {
                const data = findQueueData(result, req.params.queueId);
                if (Object.keys(data).length === 0) {
                    data.rank = "Unranked";
                    data.summonerId = id;
                    data.summonerName = req.params.id;
                }
                res.set('content-location', `/api/v1/league/stats/${req.params.queueId}/${req.params.region}/${req.params.id}`).json({
                    url: `/api/v1/league/stats/${req.params.queueId}/${req.params.region}/${req.params.id}`,
                    data
                }).status(201);
            });
        }).catch((error) => {
            res.json({
                message: "Not summoner found",
                error: error.message
            }).status(404);
        });
    }
});
exports.getStats = getStats;
//# sourceMappingURL=leagueController.js.map