import { initDatabase, getDatabase } from "../../src/database";
import {Zombie} from '../../interfaces/zombies';

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
            await zombieController.addItemToZombie('123', [5123]);
        }catch(err){
            expect(err).toBeInstanceOf(Error);
        }
        const zombie = await zombieController.addItemToZombie('123', [4567]);
        expect(zombie).toBeInstanceOf(Object);
    })

    it("Should show a list of zombies", async () => {
        const zombies = await zombieController.gatherHorde();
        expect(zombies[0]).toHaveProperty('name', 'Zombie1');
        expect(zombies[0]).toHaveProperty('createdAt');
    })

    it("Should create zombies", async () => {
        const zombie = await zombieController.riseFromDeath([{name: 'Zombaie2'}]);
        expect(zombie[0]).toHaveProperty('name', 'Zombaie2');
        expect(zombie[0]).toHaveProperty('createdAt');
    })
    it("Should remove zombies", async () => {
        const zombies = await zombieController.kill([{_id: '123', name: 'Zombie1', items:[]} as Zombie]);
        expect(zombies.success[0]).toHaveProperty('_id', '123');
    })
})