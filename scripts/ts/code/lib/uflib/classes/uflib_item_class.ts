/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/

import { Enchantment, ItemLockMode, RGB } from "@minecraft/server";
import { DynamicPropertyData, EnchantmentData } from "./uflib_unity_class.js";

/**
 * 物品資料
 */
export interface ItemStackData {
    amount: number;
    keepOnDeath: boolean;
    lockMode: ItemLockMode;
    nameTag?: string;
    typeId: string;
    canDestroy: string[];
    canPlaceOn: string[];
    durabilityDamage?: number;
    enchantments?: EnchantmentData[];
    dynamicPropertys?: DynamicPropertyData[];
    lore: string[];
    color?: RGB;
}