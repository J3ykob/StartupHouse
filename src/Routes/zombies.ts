import {NextFunction, Response, Router} from 'express';
const router = Router();

import {getDatabase} from '../database';

import {Zombie} from '../../interfaces/zombies';
import ZombiesController, {ItemError} from '../Controllers/zombies';
const zombiesController = new ZombiesController(getDatabase());


router.route('/')
    .get(async (req, res, next)=>{
        try{
            const zombies = await zombiesController.gatherHorde()
            res.json(zombies)
        }catch(err){
            next(err);
        }
    })
    .post(async (req, res, next)=>{
        try{
            const { zombies } = req.body;
            if(!zombies){
                res.status(401).json({error: 'No zombies to create'})
            }
            const risedZombies = await zombiesController.riseFromDeath(zombies)
            res.json(risedZombies)
        }catch(err){
            next(err)
        }
    })
    .delete(async (req, res, next)=>{
        try{
            const { zombies } = req.body
            if(!zombies){
                res.status(401).json({error: 'No zombies to delete'})
            }
            const killedZombies = await zombiesController.kill(zombies)
            res.json(killedZombies)
        }catch(err){
            next(err)
        }
    })

router.get('/:id', (req, res, next)=>{
    try{
        const { id } = req.params;
        const zombie = zombiesController.getById(id);
        res.json(zombie)
    }catch(err){
        next(err)
    }
})

router.get('/:id/items', (req, res, next)=>{
    try{
        const { id } = req.params;
        const zombieItems = zombiesController.getItems(id);
        res.json(zombieItems)
    }catch(err){
        next(err)
    }
})

router.get('/:id/value', (req, res, next)=> {
    try{
        const { id } = req.params;
        const zombieValue = zombiesController.getItemsValue(id);
        res.json(zombieValue)
    }catch(err){
        next(err)
    }
})

router.post('/:id/:item', (req, res, next)=>{
    try{
        const { id, item } = req.params;
        const zombieItem = zombiesController.addItemToZombie(id, item);
        res.json(zombieItem)
    }catch(err){
        next(err)
    }
})

router.delete('/:id/:item', (req, res, next)=>{
    try{
        const { id, item } = req.params;
        const zombieItem = zombiesController.removeItemFromZombie(id, item);
        res.json(zombieItem)
    }catch(err){
        next(err)
    }
})

router.use((err: Error, _:any, res: Response, next:NextFunction)=>{
    if(err instanceof ItemError){
        res.status(401).json({error: err.message})
    }else{
        next(err)
    }
})

export default router;