import Nedb from 'nedb';

let database = null;

export default class Database {

    #db: Nedb;

    constructor(options?: Nedb.DataStoreOptions){
        this.#db = new Nedb({ filename: './database.db', autoload: true, ...options });
    }
    get db(){
        return this.#db;
    }
}

export const initDatabase = (): Nedb => {
    database = new Database();
    return database.db;
}

export const getDatabase = (): Nedb => {
    if(!database){
        initDatabase();
    }
    return database.db;
}