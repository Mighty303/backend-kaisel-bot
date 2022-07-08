"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leagueController_1 = require("../controllers/leagueController");
const router = (0, express_1.default)()._router({ mergeParams: true });
router.get('/stats/:id/:region/:queueId', leagueController_1.getStats);
exports.default = router;
//# sourceMappingURL=league.js.map