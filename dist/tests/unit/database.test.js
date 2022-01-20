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
const zombies_1 = __importDefault(require("../../src/Database/zombies"));
describe("Database", () => {
    it("should be able to create a new database and test the connection", () => {
        (0, database_1.initDatabase)();
        expect((0, database_1.getDatabase)()).toBeDefined();
    });
    jest.mock('../__mocks__/nedb');
    (0, database_1.initDatabase)();
    const db = (0, database_1.getDatabase)();
    it("should get elements from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const zombies = yield zombies_1.default.getZombies();
        expect(zombies).toBeInstanceOf(Object);
    }));
    it("should remove elements from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const zombies = yield zombies_1.default.deleteZombies(['123']);
        expect(zombies.success[0]).toBe('123');
    }));
    it("should add items to the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const zombies = yield zombies_1.default.createZombies([{ name: 'zombie1' }]);
        expect(zombies[0]).toHaveProperty('name', 'zombie1');
    }));
    it("should update elements in the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const newZombie = {
            name: "newZombie",
            createdAt: new Date(),
            _id: "123",
            items: []
        };
        const zombies = yield zombies_1.default.updateZombie(newZombie);
        expect(zombies).toEqual(newZombie);
    }));
});
//# sourceMappingURL=database.test.js.map