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
exports.getItemsList = exports.updateItemsList = void 0;
const database_1 = require("../database");
const db = (0, database_1.getDatabase)();
const updateItemsList = (updatedList) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db.update({ _id: "itemsList" }, { $set: { items: updatedList, updatedAt: new Date() } }, {}, (err, n) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(n);
        });
    });
});
exports.updateItemsList = updateItemsList;
const getItemsList = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db.findOne({ _id: "itemsList" }, (err, itemsList) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(itemsList);
        });
    });
});
exports.getItemsList = getItemsList;
//# sourceMappingURL=items.js.map