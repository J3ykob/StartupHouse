import { initDatabase, getDatabase } from "../../src/database";
import Nedb from 'nedb'
import {Zombie} from '../../interfaces/zombies';

import ZombiesController from '../../src/Database/zombies';


describe("Database", () => {
    it("should be able to create a new database and test the connection", () => {
        initDatabase();
        expect(getDatabase()).toBeDefined();
    });

    jest.mock('../__mocks__/nedb')
    initDatabase();
    const db = getDatabase();

    it("should get elements from the database", async () => {
        const zombies = await ZombiesController.getZombies();
        expect(zombies).toBeInstanceOf(Object);
    })
    it("should remove elements from the database", async () => {
        const zombies: any = await ZombiesController.deleteZombies(['123']);
        expect(zombies.success[0]).toBe('123');
    })
    it("should add items to the database", async () => {
        const zombies = await ZombiesController.createZombies([{name: 'zombie1'}]);
        expect(zombies[0]).toHaveProperty('name', 'zombie1');
    })
    it("should update elements in the database", async ()=> {
        const newZombie: Zombie = {
            name: "newZombie",
            createdAt: new Date(),
            _id: "123",
            items: []
        }
        const zombies = await ZombiesController.updateZombie(newZombie);
        expect(zombies).toEqual(newZombie);
    })
});