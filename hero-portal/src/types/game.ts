export enum Rarity {
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    Epic = "epic",
    Legendary = "legendary",
}

export interface HeroStats {
    hp: number;
    mana: number;
    atkPhysical: number;
    atkMagic: number;
    def: number;
    speed: number;
}

export interface Ability {
    id: string;
    name: string;
    description: string;
    cooldown: number;
    manaCost: number;
    damage?: number;
    healing?: number;
}

export interface Skin {
    id: string;
    name: string;
    rarity: Rarity;
    imageUrl: string;
}

export interface Hero {
    id: string;
    name: string;
    rarity: Rarity;
    baseStats: HeroStats;
    abilities: Ability[];
    skins: Skin[];
    level: number;
    experience: number;
}