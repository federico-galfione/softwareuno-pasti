import { Dishes } from './Dishes';
import { Order } from './Order';

export interface Menu{
    orders?: Order[];
    date: Date;
    dishes: Dishes;
}