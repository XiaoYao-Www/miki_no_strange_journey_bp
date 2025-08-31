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
}