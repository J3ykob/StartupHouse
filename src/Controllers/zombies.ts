import Nedb from 'nedb'
import {Zombie, Item} from '../../interfaces/zombies'
import zombiesController from '../Database/zombies'
import { updateItemsList, getItemsList } from '../Database/items'
import axios from 'axios'

export class ZombieError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export default class ZombiesController {
    #db: Nedb;
    constructor(db: Nedb) {
        this.#db = db;
    }

    getById = async (id: string) => {
        try{
            const zombie = await zombiesController.getZombieById(id);
            return {
                name: zombie.name,
                createdAt: zombie.createdAt
            };
        }catch(err){
            throw err;
        }   
    }

    getItems = async (id: string) => {
        try{
            const zombie = await zombiesController.getZombieById(id);
            return zombie.items;
        }catch(err){
            throw err;
        }
    }
    getItemsValue = async (id: string) => {
        try{
            const items = await this.getItems(id);
            const total = items.reduce((acc:number, item) => acc+item.price, 0);
            const currencies = await (await axios.get('http://api.nbp.pl/api/exchangerates/tables/C/today/', {headers: {'Accept': 'application/json'}})).data[0].rates;

            return {
                EUR: total / currencies.find((rate: { code: string })=>rate.code === "EUR").ask,
                USD: total / currencies.find((rate: { code: string })=>rate.code === "USD").ask,
                PLN: total
            }

        }catch(err){
            throw err;
        }        
    }

    addItemToZombie = async (id: string, itemsId: number[]) => {
        try{
            const zombie = await zombiesController.getZombieById(id);
            const now = new Date()
            
            let possibleItems = await getItemsList();
            if(!possibleItems || new Date(possibleItems.updatedAt).getDate() < now.getDate()){
                const updatedList = await (await axios.get('https://zombie-items-api.herokuapp.com/api/items')).data.items;
                possibleItems = {items: updatedList, updatedAt: new Date()};
                await updateItemsList(possibleItems);   
            }
            
            let itemsToAdd: Item[] = possibleItems.items.filter((item: Item)=>itemsId.includes(item.id));
            itemsToAdd = itemsToAdd.filter((item: Item)=>!zombie.items.find((zombieItem: Item)=>zombieItem.id === item.id));

            if(!itemsToAdd[0]){
                throw new ZombieError('No new items found', 401);
            }

            zombie.items = [...zombie.items, ...itemsToAdd];
            if(zombie.items.length > 5){
                zombie.items.splice(5)
            }
            await zombiesController.updateZombie(zombie);
            return zombie;

        }catch(err){
            throw err;
        }
    }

    removeItemsFromZombie = async (id: string, itemsId: number[]) => {
        try{
            const zombie = await zombiesController.getZombieById(id);
            zombie.items = zombie.items.filter((item: Item) =>!itemsId.includes(item.id));
            await zombiesController.updateZombie(zombie);
            return zombie;
        }catch(err){
            throw err;
        }
    }

    gatherHorde = async () => {
        try{
            const zombies = await zombiesController.getZombies();
            return zombies;
        }catch(err){
            throw err;
        }
    }

    riseFromDeath = async (zombies: [{name: string, items?: Item[], createdAt?: Date}]) => {
        try{
            const horde = await zombiesController.createZombies(zombies);
            return horde;
        }catch(err){
            throw err;
        }
    }

    /* 
        This function will resolve even if none of the items was successfully upgraded
        This way we can see which zombies were successfully upgraded and which not 
    */

    upgradeHorde = async (zombies: Zombie[]) => {
        const upgradedHorde = {
            success: [],
            error: []
        }
        zombies.forEach(async (zombie: Zombie, index:number)=>{
            try{
                const updatedZombie = await zombiesController.updateZombie(zombie);
                upgradedHorde.success.push(updatedZombie);
            }catch(err){
                upgradedHorde.error.push({error: err, zombie: zombie});
            }
            if(upgradedHorde.success.length+upgradedHorde.error.length === zombies.length){
                return upgradedHorde;
            }
        })
    }

    kill = async (zombies: Zombie[] | string[]) => {
        try{
            const deadHorde = await zombiesController.deleteZombies(zombies);
            return deadHorde;
        }catch(err){
            throw err;
        }
    }
}