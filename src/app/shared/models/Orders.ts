export interface Orders{
    primi: Map<string, number>;
    secondi: Map<string, number>;
    contorni: Map<string, number | {abbondanti: number; normali: number}>;
    pizze: Map<string, number>;
}