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
exports.ZombieError = void 0;
const zombies_1 = __importDefault(require("../Database/zombies"));
const items_1 = require("../Database/items");
const axios_1 = __importDefault(require("axios"));
class ZombieError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.ZombieError = ZombieError;
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
        this.addItemToZombie = (id, itemsId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const zombie = yield zombies_1.default.getZombieById(id);
                const now = new Date();
                let possibleItems = yield (0, items_1.getItemsList)();
                if (!possibleItems || new Date(possibleItems.updatedAt).getDate() < now.getDate()) {
                    const updatedList = yield (yield axios_1.default.get('https://zombie-items-api.herokuapp.com/api/items')).data.items;
                    possibleItems = { items: updatedList, updatedAt: new Date() };
                    yield (0, items_1.updateItemsList)(possibleItems);
                }
                let itemsToAdd = possibleItems.items.filter((item) => itemsId.includes(item.id));
                itemsToAdd = itemsToAdd.filter((item) => !zombie.items.find((zombieItem) => zombieItem.id === item.id));
                if (!itemsToAdd[0]) {
                    throw new ZombieError('No new items found', 401);
                }
                zombie.items = [...zombie.items, ...itemsToAdd];
                if (zombie.items.length > 5) {
                    zombie.items.splice(5);
                }
                yield zombies_1.default.updateZombie(zombie);
                return zombie;
            }
            catch (err) {
                throw err;
            }
        });
        this.removeItemsFromZombie = (id, itemsId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const zombie = yield zombies_1.default.getZombieById(id);
                zombie.items = zombie.items.filter((item) => !itemsId.includes(item.id));
                yield zombies_1.default.updateZombie(zombie);
                return zombie;
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