"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestFunction = exports.getStats = void 0;
const axios_1 = __importDefault(require("axios"));
const SEASON_12_BEGINS_TIMESTAMP = 1641297600;
const requestFunction = (path) => {
    return new Promise((resolve, reject) => {
        axios_1.default.get(path).then((response) => {
            resolve(response.data);
        }, (error) => {
            reject(error);
        });
    });
};
exports.requestFunction = requestFunction;
const getStats = (req, res) => {
    res.send("No empty");
};
exports.getStats = getStats;
//# sourceMappingURL=leagueController.js.map