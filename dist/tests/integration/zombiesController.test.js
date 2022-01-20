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
const database_1 = require("../../src/database");
const zombies_1 = __importDefault(require("../../src/Controllers/zombies"));
(0, database_1.initDatabase)();
const db = (0, database_1.getDatabase)();
const zombieController = new zombies_1.default(db);
describe("Zombies controller", () => {
    it("Should get all zombies", () => __awaiter(void 0, void 0, void 0, function* () {
        const zombies = yield zombieController.gatherHorde();
        expect(zombies[0]).toHaveProperty('name', 'Zombie1');
        expect(zombies[0]).toHaveProperty('createdAt');
    }));
    // I want to display items that this zombie has;
    // I want to see total value of zombie’s items in 3 currencies, PLN/EU/USD;
    // I want to add and remove items from the zombie;
    // I want to see a list of zombies (create/update/remove them also);
    it("Should display items that this zombie has", () => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield zombieController.getItems('123');
        expect(items[0]).toHaveProperty('name', 'item1');
    }));
    it("Should show total value of zombie's items in 3 currencies", () => __awaiter(void 0, void 0, void 0, function* () {
        const totalValue = yield zombieController.getItemsValue('123');
        expect(totalValue).toHaveProperty('EUR');
        expect(totalValue).toHaveProperty('PLN');
        expect(totalValue).toHaveProperty('USD');
    }));
    it("Should add and remove items from the zombie", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield zombieController.addItemToZombie('123', 'item1');
        }
        catch (err) {
            expect(err).toBeInstanceOf(Error);
        }
        const zombie = yield zombieController.addItemToZombie('123', 'item3');
        expect(zombie).toBeInstanceOf(Object);
    }));
    it("Should show a list of zombies", () => __awaiter(void 0, void 0, void 0, function* () {
        const zombies = yield zombieController.gatherHorde();
        expect(zombies[0]).toHaveProperty('name', 'Zombie1');
        expect(zombies[0]).toHaveProperty('createdAt');
    }));
    it("Should create zombies", () => __awaiter(void 0, void 0, void 0, function* () {
        const zombie = yield zombieController.riseFromDeath([{ name: 'Zombie2' }]);
        expect(zombie[0]).toHaveProperty('name', 'Zombie2');
        expect(zombie[0]).toHaveProperty('createdAt');
    }));
    it("Should remove zombies", () => __awaiter(void 0, void 0, void 0, function* () {
        const zombies = yield zombieController.kill([{ _id: '123', name: 'Zombie1', items: [] }]);
        expect(zombies.success[0]).toHaveProperty('_id', '123');
    }));
});
//# sourceMappingURL=zombiesController.test.js.map