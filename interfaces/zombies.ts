import Nedb from 'nedb'

export interface Item {
    name: string;
    id: number;
    price: number;
}

export interface Zombie{
    _id?: string;
    name: string;
    createdAt: Date;
    items?: Item[];
}