import { Dish } from '.';

export interface DishesForm{
    primi: Dish[];
    secondi: Dish[];
    contorni: Dish[];
    pizze: Dish[];
}

export interface Dishes{
    primi: string[];
    secondi: string[];
    contorni: string[];
    pizze: string[];
}