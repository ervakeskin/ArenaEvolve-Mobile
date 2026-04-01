import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameStore {
    gold: number;
    gems: number;
    inventory: string[];
    ownedSkins: string[];
    heroExperience: number;
    addGold: (amount: number) => void;
    addGems: (amount: number) => void;
    buyItem: (itemId: string, cost: number) => boolean;
    addToInventory: (itemId: string) => void;
    purchaseSkin: (skinId: string, cost: number) => boolean;
    updateHeroExperience: (amount: number) => void;
    resetStore: () => void;
}

const initialState = {
    gold: 0,
    gems: 0,
    inventory: [],
    ownedSkins: [],
    heroExperience: 0,
};

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            ...initialState,
            addGold: (amount: number) =>
                set((state) => ({ gold: state.gold + amount })),
            addGems: (amount: number) =>
                set((state) => ({ gems: state.gems + amount })),
            buyItem: (itemId: number | string, cost: number) => { // Hem sayı hem string gelebilir diye esnettik
                let success = false;
                set((state) => {
                    if (state.gold >= cost) {
                        success = true;
                        return {
                            gold: state.gold - cost,
                            inventory: [...state.inventory, String(itemId)],
                        };
                    }
                    return state;
                });
                return success;
            },
            addToInventory: (itemId: string) =>
                set((state) => ({
                    inventory: [...state.inventory, itemId],
                })),
            purchaseSkin: (skinId: string, cost: number) => {
                let success = false;
                set((state) => {
                    if (state.gems >= cost && !state.ownedSkins.includes(skinId)) {
                        success = true;
                        return {
                            gems: state.gems - cost,
                            ownedSkins: [...state.ownedSkins, skinId],
                        };
                    }
                    return state;
                });
                return success;
            },
            updateHeroExperience: (amount: number) =>
                set((state) => ({ heroExperience: state.heroExperience + amount })),
            resetStore: () => set(initialState),
        }),
        {
            name: 'game-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);