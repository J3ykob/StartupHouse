import {getDatabase} from '../database';
import {Zombie, Item} from '../../interfaces/zombies';
import {ZombieError} from '../Controllers/zombies';

const db = getDatabase();

export class ZombieQueryError extends Error {}

/* 
    Returning promises in those function simulates async/await behavior of mongoose framework 
*/

const zombiesController = {
    getZombies: () => {
        return new Promise<Zombie[]>((resolve, reject)=>{
            db.find<Zombie>({}, (err:ZombieQueryError, zombies:Zombie[]) => {
                if(err){
                    reject(new ZombieError("Something went wrong when performing findOne query", 500));
                    return;
                }
                resolve(zombies)
            })
        })
    },
    getZombieById: (id: string) => {
        return new Promise<Zombie>((resolve, reject)=>{
            db.findOne<Zombie>({_id: id}, (err:ZombieQueryError, zombie:Zombie) => {
                if(err){
                    reject(new ZombieError("Something went wrong when performing findOne query", 500));
                    return;
                }
                resolve(zombie)
            })
        })
    },
    updateZombie: (zombie: Zombie) => {
        return new Promise<number>((resolve, reject)=>{
            db.update({_id: zombie._id}, zombie, {}, (err:ZombieQueryError, zombie:number) => {
                if(err){
                    reject(new ZombieError("Something went wrong when updating zombie database", 500));
                    return;
                }
                resolve(zombie)
            })
        });
    },
    createZombies: (cfg: [{name: string, items?: Item[], createdAt?: Date}] | string[]) => {
        return new Promise<Zombie[]>(async (resolve, reject)=>{
            const zombiesToAdd: Zombie[] = []
            const zombies = await zombiesController.getZombies();
            cfg.forEach(zombie=>{
                const name = (typeof zombie == "string") ? zombie : zombie.name
                if(!zombies.some(z=>z.name === name)){
                    zombiesToAdd.push({
                        name: name,
                        createdAt: zombie.createdAt || new Date(),
                        items: zombie.items || []
                    })
                }
            })
            db.insert(zombiesToAdd, (err:ZombieQueryError, zombies:Zombie[]) => {
                if(err){
                    reject(new ZombieError("Something went wrong while creating zombies", 500));
                    return;
                }
                resolve(zombies);
            })
        })
    },
    deleteZombies: async (zombies: Zombie[] | string[]) => {
        return new Promise<{success: Array<Zombie>,error: Array<Zombie> }>((resolve)=>{
            const result = {
                success: [],
                error: []
            };
            if(!!!zombies.length){
                resolve(result)
            }
            zombies.forEach((zombie: any, index:number)=>{
                db.remove({_id: zombie._id || zombie}, {}, (err:ZombieQueryError, n:number) => {
                    if(err){
                        result.error.push(zombie);
                        return;
                    }
                    result.success.push(zombie);
                    if(result.error.length + result.success.length === zombies.length){
                        resolve(result);
                    }
                })
            })
        })
    }
}

export default zombiesController;