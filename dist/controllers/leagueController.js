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
// Dev KEY
const key = "RGAPI-c157ab80-bc24-4c3a-bd5b-f563e3916a98";
const SEASON_12_BEGINS_TIMESTAMP = 1641297600;
// Get Summoner ID
const getEncryptID = (sumName, region) => __awaiter(void 0, void 0, void 0, function* () {
    function sumInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${sumName}`, {
                headers: {
                    "X-Riot-Token": "RGAPI-c157ab80-bc24-4c3a-bd5b-f563e3916a98"
                },
                params: {}
            });
        });
    }
    return ((yield sumInfo()).data);
});
// Return summoner id for now
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    getEncryptID(req.params.id, req.params.region).then((result) => {
        res.send(result.id);
    });
});
exports.getStats = getStats;
//# sourceMappingURL=leagueController.js.map