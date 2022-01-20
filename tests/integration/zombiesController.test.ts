import { initDatabase, getDatabase } from "../../src/database";
import Nedb from 'nedb'
import {Zombie} from '../../interfaces/zombies';
import axios from 'axios'

import ZombiesController from '../../src/Controllers/zombies';

initDatabase();
const db = getDatabase();

const zombieController = new ZombiesController(db);


describe("Zombies controller", () => {
    it("Should get all zombies", async () => {
        const zombies = await zombieController.gatherHorde();
        expect(zombies[0]).toHaveProperty('name', 'Zombie1');
        expect(zombies[0]).toHaveProperty('createdAt');
    })

// I want to display items that this zombie has;
// I want to see total value of zombie’s items in 3 currencies, PLN/EU/USD;
// I want to add and remove items from the zombie;
// I want to see a list of zombies (create/update/remove them also);

    it("Should display items that this zombie has", async () => {
        const items = await zombieController.getItems('123');
        expect(items[0]).toHaveProperty('name', 'item1');
    })

    it("Should show total value of zombie's items in 3 currencies", async () => {
        const totalValue = await zombieController.getItemsValue('123');
        expect(totalValue).toHaveProperty('EUR');
        expect(totalValue).toHaveProperty('PLN');
        expect(totalValue).toHaveProperty('USD');
    })

    it("Should add and remove items from the zombie", async () => {
        try{
            await zombieController.addItemToZombie('123', 'item1');
        }catch(err){
            expect(err).toBeInstanceOf(Error);
        }
        const zombie = await zombieController.addItemToZombie('123', 'item3');
        expect(zombie).toBeInstanceOf(Object);
    })

    it("Should show a list of zombies", async () => {
        const zombies = await zombieController.gatherHorde();
        expect(zombies[0]).toHaveProperty('name', 'Zombie1');
        expect(zombies[0]).toHaveProperty('createdAt');
    })

    it("Should create zombies", async () => {
        const zombie = await zombieController.riseFromDeath([{name: 'Zombie2'}]);
        expect(zombie[0]).toHaveProperty('name', 'Zombie2');
        expect(zombie[0]).toHaveProperty('createdAt');
    })
    it("Should remove zombies", async () => {
        const zombies = await zombieController.kill([{_id: '123', name: 'Zombie1', items:[]} as Zombie]);
        expect(zombies.success[0]).toHaveProperty('_id', '123');
    })
})