export type DishType = "primi" | "secondi" | "contorni" | "pizze"

export interface Dish {
    name: string;
    selected?: boolean;
}