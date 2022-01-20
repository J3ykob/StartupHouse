"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const router = (0, express_1.Router)();
const database_1 = require("../database");
const zombies_1 = __importStar(require("../Controllers/zombies"));
const zombiesController = new zombies_1.default((0, database_1.getDatabase)());
router.route('/')
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zombies = yield zombiesController.gatherHorde();
        res.json(zombies);
    }
    catch (err) {
        next(err);
    }
}))
    .post((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zombies } = req.body;
        if (!zombies) {
            res.status(401).json({ error: 'No zombies to create' });
        }
        const risedZombies = yield zombiesController.riseFromDeath(zombies);
        res.json(risedZombies);
    }
    catch (err) {
        next(err);
    }
}))
    .delete((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zombies } = req.body;
        if (!zombies) {
            res.status(401).json({ error: 'No zombies to delete' });
        }
        const killedZombies = yield zombiesController.kill(zombies);
        res.json(killedZombies);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const zombie = zombiesController.getById(id);
        res.json(zombie);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id/items', (req, res, next) => {
    try {
        const { id } = req.params;
        const zombieItems = zombiesController.getItems(id);
        res.json(zombieItems);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id/value', (req, res, next) => {
    try {
        const { id } = req.params;
        const zombieValue = zombiesController.getItemsValue(id);
        res.json(zombieValue);
    }
    catch (err) {
        next(err);
    }
});
router.post('/:id/:item', (req, res, next) => {
    try {
        const { id, item } = req.params;
        const zombieItem = zombiesController.addItemToZombie(id, item);
        res.json(zombieItem);
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id/:item', (req, res, next) => {
    try {
        const { id, item } = req.params;
        const zombieItem = zombiesController.removeItemFromZombie(id, item);
        res.json(zombieItem);
    }
    catch (err) {
        next(err);
    }
});
router.use((err, _, res, next) => {
    if (err instanceof zombies_1.ItemError) {
        res.status(401).json({ error: err.message });
    }
    else {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=zombies.js.map