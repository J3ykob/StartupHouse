"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Database_db;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.initDatabase = void 0;
const nedb_1 = __importDefault(require("nedb"));
let database = null;
class Database {
    constructor(options) {
        _Database_db.set(this, void 0);
        __classPrivateFieldSet(this, _Database_db, new nedb_1.default(Object.assign({ filename: './dist/database.db', autoload: true }, options)), "f");
    }
    get db() {
        return __classPrivateFieldGet(this, _Database_db, "f");
    }
}
exports.default = Database;
_Database_db = new WeakMap();
const initDatabase = () => {
    database = new Database();
    return database.db;
};
exports.initDatabase = initDatabase;
const getDatabase = () => {
    if (!database) {
        (0, exports.initDatabase)();
    }
    return database.db;
};
exports.getDatabase = getDatabase;
//# sourceMappingURL=database.js.map