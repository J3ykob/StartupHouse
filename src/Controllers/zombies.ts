import Nedb, {Cursor} from 'nedb'
import {Zombie, Item} from '../../interfaces/zombies'
import zombiesController from '../Database/zombies'
import { updateItemsList, getItemsList } from '../Database/items'
import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser();

export class ItemError extends Error {}

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

            // let jObj = parser.parse();

            return {
                EUR: currencies.find((rate: { code: string })=>rate.code === "EUR").ask * total,
                USD: currencies.find((rate: { code: string })=>rate.code === "USD").ask * total,
                PLN: total
            }

        }catch(err){
            throw err;
        }        
    }

    addItemToZombie = async (id: string, itemName: string) => {
        try{
            const zombie = await zombiesController.getZombieById(id);
            const now = new Date()
            
            let possibleItems = await getItemsList();
            if(possibleItems.updatedAt < now){
                const updatedList = await (await axios.get('https://zombie-items-api.herokuapp.com/api/items')).data.items;
                await updateItemsList(updatedList);
                possibleItems = updatedList;
            }
            
            const item: Item = possibleItems.items.find((item: { name: string })=>item.name === itemName);

            if(!item){
                throw new ItemError('Item not found');
            }else if(zombie.items.find((item: { name: string })=>item.name === itemName)){
                throw new ItemError('Item already exists');
            }

            zombie.items = [...zombie.items, item];
            await zombiesController.updateZombie(zombie);
            return zombie;

        }catch(err){
            throw err;
        }
    }

    removeItemFromZombie = async (id: string, name: string) => {
        try{
            const zombie = await zombiesController.getZombieById(id);
            const item = zombie.items.find((item: Item) =>item.name === name);
            if(!item){
                throw new ItemError('Item not found');
            }
            zombie.items.splice(zombie.items.indexOf(item), 1);
            await zombiesController.updateZombie(zombie);
            return item;
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

    kill = async (zombies: Zombie[]) => {
        try{
            const deadHorde = await zombiesController.deleteZombies(zombies);
            return deadHorde;
        }catch(err){
            throw err;
        }
    }

}