"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.json());
const database_1 = require("./database");
(0, database_1.initDatabase)();
const zombies_1 = __importDefault(require("./Routes/zombies"));
app.use('/zombies', zombies_1.default);
app.use((error, _, res, __) => {
    console.error(`Error processing request ${error}. See next message for details`);
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=server.js.map