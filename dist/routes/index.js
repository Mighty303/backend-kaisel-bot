"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const league_1 = __importDefault(require("./league"));
const router = (0, express_1.default)()._router({ mergeParams: true });
router.use("/league", league_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map