"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
const port = 8080;
app.set('port', process.env.PORT || port);
const server = app.listen(app.settings.port);
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/api/v1/', index_1.default);
app.use('/', (req, res) => {
    res.send("Martin's gay");
});
//# sourceMappingURL=index.js.map