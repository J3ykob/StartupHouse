const zombies = [{
    _id: '123',
    name: 'Zombie1',
    createdAt: '2019-01-01T00:00:00.000Z',
    items: [{
            name: 'item1',
            price: 10,
            id: 123
        },
        {
            name: 'item2',
            price: 20,
            id: 456
        }
    ]
},{
    _id: '456',
    name: 'Zombie2',
    createdAt: '2019-01-01T00:00:00.000Z',
    items: [{
            name: 'item1',
            price: 10,
            id: 123
    }]
},{
    _id: "itemsList",
    items: [{
        name: 'item1',
        price: 10,
        id: 1234
    },
    {
        name: 'item3',
        price: 20,
        id: 4567
    }],
    updatedAt: '2019-01-01T00:00:00.000Z'
}];

export default class Nedb {
    constructor(){
        const db: Nedb = {
            find: (q, callback) => {
                callback(null, zombies);
            },
            findOne: (g, callback) => {
                callback(null, zombies.find(zombie=>zombie._id === g._id));
            },
            insert: (zombie, callback) => {
                callback(null, zombie);
            },
            remove: (zombie, {}, callback) => {
                callback(null, zombie);
            },
            update: (q, zombie, {}, callback) => {
                callback(null, zombie);
            }
        }
        return db;
    }
    
}