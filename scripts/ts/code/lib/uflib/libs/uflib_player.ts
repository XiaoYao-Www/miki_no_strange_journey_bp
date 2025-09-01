/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/

import { Container, ContainerSlot, EntityComponentTypes, EntityInventoryComponent, ItemStack, Player } from "@minecraft/server";
import { UFLib_Entity } from "./uflib_entity.js";

/**
 * 玩家函式庫
 */
export class UFLib_Player extends UFLib_Entity {
    /**
     * 錯誤輸出
     */
    protected static FunError = class extends Error {
        constructor(message?: string, options?: { cause?: unknown }) {
            super(message, options);
            this.name = 'UFLib-Player';
        }
    };

    /**
     * 取得指定物品的數量
     * @param player 目標玩家
     * @param item 目標物品
     * @returns 數量
     */
    static getItemCount(player: Player, item: string | ItemStack): number {
        try {
            // 取得背包容器
            const backPackContainer: Container | undefined = player.getComponent(EntityComponentTypes.Inventory)?.container;
            if (backPackContainer === undefined) return 0;
            // 計算數量
            let totalCount: number = 0;
            if (typeof item === "string") for (let i = 0; i < backPackContainer.size; i++) {
                const slot: ContainerSlot = backPackContainer.getSlot(i);
                if (slot.hasItem() && slot.typeId == item) totalCount += slot.amount;
            } else for (let i = 0; i < backPackContainer.size; i++) {
                const getItem: ItemStack | undefined = backPackContainer.getItem(i);
                if (getItem !== undefined && getItem.isStackableWith(item)) totalCount += getItem.amount;
            }
            return totalCount;
        } catch (error: any) {
            throw new UFLib_Player.FunError("error", { cause: error });
        }
    }

    /**
     * 取得手持物品(引用)
     * @param player 玩家
     * @returns 物品
     */
    static getMainHand(player: Player): ItemStack | undefined{
        try {
            // 取得背包容器
            const backPackContainer: Container | undefined = player.getComponent(EntityComponentTypes.Inventory)?.container;
            if (backPackContainer === undefined) return undefined;
            // 取得物品
            return backPackContainer.getItem(player.selectedSlotIndex);
        } catch (error: any) {
            throw new UFLib_Player.FunError("error", { cause: error });
        }
    }

    /**
     * 設定主手物品
     * @param player 玩家 
     * @param item 物品
     * @returns 無
     */
    static setMainHand(player: Player, item: ItemStack | undefined){
        try {
            // 取得背包容器
            const backPackContainer: Container | undefined = player.getComponent(EntityComponentTypes.Inventory)?.container;
            if (backPackContainer === undefined) return undefined;
            // 設定物品
            backPackContainer.setItem(player.selectedSlotIndex, item);
        } catch (error: any) {
            throw new UFLib_Player.FunError("error", { cause: error });
        }
    }
}