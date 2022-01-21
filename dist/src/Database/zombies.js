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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZombieQueryError = void 0;
const database_1 = require("../database");
const zombies_1 = require("../Controllers/zombies");
const db = (0, database_1.getDatabase)();
class ZombieQueryError extends Error {
}
exports.ZombieQueryError = ZombieQueryError;
/*
    Returning promises in those function simulates async/await behavior of mongoose framework
*/
const zombiesController = {
    getZombies: () => {
        return new Promise((resolve, reject) => {
            db.find({}, (err, zombies) => {
                if (err) {
                    reject(new zombies_1.ZombieError("Something went wrong when performing findOne query", 500));
                    return;
                }
                resolve(zombies);
            });
        });
    },
    getZombieById: (id) => {
        return new Promise((resolve, reject) => {
            db.findOne({ _id: id }, (err, zombie) => {
                if (err) {
                    reject(new zombies_1.ZombieError("Something went wrong when performing findOne query", 500));
                    return;
                }
                resolve(zombie);
            });
        });
    },
    updateZombie: (zombie) => {
        return new Promise((resolve, reject) => {
            db.update({ _id: zombie._id }, zombie, {}, (err, zombie) => {
                if (err) {
                    reject(new zombies_1.ZombieError("Something went wrong when updating zombie database", 500));
                    return;
                }
                resolve(zombie);
            });
        });
    },
    createZombies: (cfg) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const zombiesToAdd = [];
            const zombies = yield zombiesController.getZombies();
            cfg.forEach(zombie => {
                const name = (typeof zombie == "string") ? zombie : zombie.name;
                if (!zombies.some(z => z.name === name)) {
                    zombiesToAdd.push({
                        name: name,
                        createdAt: zombie.createdAt || new Date(),
                        items: zombie.items || []
                    });
                }
            });
            db.insert(zombiesToAdd, (err, zombies) => {
                if (err) {
                    reject(new zombies_1.ZombieError("Something went wrong while creating zombies", 500));
                    return;
                }
                resolve(zombies);
            });
        }));
    },
    deleteZombies: (zombies) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const result = {
                success: [],
                error: []
            };
            if (!!!zombies.length) {
                resolve(result);
            }
            zombies.forEach((zombie, index) => {
                db.remove({ _id: zombie._id || zombie }, {}, (err, n) => {
                    if (err) {
                        result.error.push(zombie);
                        return;
                    }
                    result.success.push(zombie);
                    if (result.error.length + result.success.length === zombies.length) {
                        resolve(result);
                    }
                });
            });
        });
    })
};
exports.default = zombiesController;
//# sourceMappingURL=zombies.js.map