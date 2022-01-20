import { getDatabase } from "../database";
import { Item } from '../../interfaces/zombies';


const db = getDatabase();

export const updateItemsList = async (updatedList: Item[]) => {
    return new Promise<number>((resolve, reject) => {
        db.update({_id: "itemsList"}, { $set: { items: updatedList, updatedAt: new Date() } }, {}, (err, n) => {
            if (err) {
                reject(err)
                return;
            }
            resolve(n);
        });
    })   
}

export const getItemsList = async () => {
    return new Promise<{updatedAt: Date, items: Item[]}>((resolve, reject) => {
        db.findOne({_id: "itemsList"}, (err, itemsList) => {
            if (err) {
                reject(err)
                return;
            }
            resolve(itemsList);
        })
    })
}