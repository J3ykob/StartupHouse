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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ZombiesController_db;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemError = void 0;
const zombies_1 = __importDefault(require("../Database/zombies"));
const axios_1 = __importDefault(require("axios"));
const fast_xml_parser_1 = require("fast-xml-parser");
const parser = new fast_xml_parser_1.XMLParser();
class ItemError extends Error {
}
exports.ItemError = ItemError;
class ZombiesController {
    constructor(db) {
        _ZombiesController_db.set(this, void 0);
        this.getById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const zombie = yield zombies_1.default.getZombieById(id);
                return {
                    name: zombie.name,
                    createdAt: zombie.createdAt
                };
            }
            catch (err) {
                throw err;
            }
        });
        this.getItems = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const zombie = yield zombies_1.default.getZombieById(id);
                return zombie.items;
            }
            catch (err) {
                throw err;
            }
        });
        this.getItemsValue = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.getItems(id);
                const total = items.reduce((acc, item) => acc + item.price, 0);
                const currencies = yield (yield axios_1.default.get('http://api.nbp.pl/api/exchangerates/tables/C/today/', { headers: { 'Accept': 'application/json' } })).data[0].rates;
                // let jObj = parser.parse();
                return {
                    EUR: currencies.find((rate) => rate.code === "EUR").ask * total,
                    USD: currencies.find((rate) => rate.code === "USD").ask * total,
                    PLN: total
                };
            }
            catch (err) {
                throw err;
            }
        });
        this.addItemToZombie = (id, itemName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const zombie = yield zombies_1.default.getZombieById(id);
                const possibleItems = yield (yield axios_1.default.get('https://zombie-items-api.herokuapp.com/api/items')).data.items;
                const item = possibleItems.find((item) => item.name === itemName);
                if (!item) {
                    throw new ItemError('Item not found');
                }
                zombie.items = [...zombie.items, item];
                yield zombies_1.default.updateZombie(zombie);
                return item;
            }
            catch (err) {
                throw err;
            }
        });
        this.removeItemFromZombie = (id, name) => __awaiter(this, void 0, void 0, function* () {
            try {
                const zombie = yield zombies_1.default.getZombieById(id);
                const item = zombie.items.find((item) => item.name === name);
                if (!item) {
                    throw new ItemError('Item not found');
                }
                zombie.items.splice(zombie.items.indexOf(item), 1);
                yield zombies_1.default.updateZombie(zombie);
                return item;
            }
            catch (err) {
                throw err;
            }
        });
        this.gatherHorde = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const zombies = yield zombies_1.default.getZombies();
                return zombies;
            }
            catch (err) {
                throw err;
            }
        });
        this.riseFromDeath = (zombies) => __awaiter(this, void 0, void 0, function* () {
            try {
                const horde = yield zombies_1.default.createZombies(zombies);
                return horde;
            }
            catch (err) {
                throw err;
            }
        });
        /*
            This function will resolve even if none of the items was successfully upgraded
            This way we can see which zombies were successfully upgraded and which not
        */
        this.upgradeHorde = (zombies) => __awaiter(this, void 0, void 0, function* () {
            const upgradedHorde = {
                success: [],
                error: []
            };
            zombies.forEach((zombie, index) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const updatedZombie = yield zombies_1.default.updateZombie(zombie);
                    upgradedHorde.success.push(updatedZombie);
                }
                catch (err) {
                    upgradedHorde.error.push({ error: err, zombie: zombie });
                }
                if (upgradedHorde.success.length + upgradedHorde.error.length === zombies.length) {
                    return upgradedHorde;
                }
            }));
        });
        this.kill = (zombies) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deadHorde = yield zombies_1.default.deleteZombies(zombies);
                return deadHorde;
            }
            catch (err) {
                throw err;
            }
        });
        __classPrivateFieldSet(this, _ZombiesController_db, db, "f");
    }
}
exports.default = ZombiesController;
_ZombiesController_db = new WeakMap();
//# sourceMappingURL=zombies.js.map