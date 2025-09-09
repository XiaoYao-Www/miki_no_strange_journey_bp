import { system, world } from "@minecraft/server";


/**
 * 設定
 */
const MaintainInterval_m = 10;

/**
 * 資料系統本體
 */

// 生物資料儲存
export interface PlayerDataStore {
    accessory_settings_table: string | undefined
    accessory_slot: {
        necklace_slot: string | undefined,
        ring_slot: string | undefined,
        belt_slot: string | undefined,
        bracelet_slot: string | undefined,
        amulet_slot: string | undefined,
        special_slot: string | undefined,
        relic_slot: string | undefined,
    }
}

export interface EnemyDataStore {

}

export interface FunctionEntityDataStore {

}

const EntityStore = new Map<string, PlayerDataStore | EnemyDataStore | FunctionEntityDataStore>();


/**
 * 取得玩家儲存資料
 * @param playerId 玩家ID
 * @returns 玩家儲存資料
 */
export function getPlayerDataStore(playerId: string): PlayerDataStore {
    let data = EntityStore.get(playerId) as PlayerDataStore | undefined;
    if (data === undefined) {
        data = {
            accessory_settings_table: undefined,
            accessory_slot:{
                necklace_slot: undefined,
                ring_slot: undefined,
                belt_slot: undefined,
                bracelet_slot: undefined,
                amulet_slot: undefined,
                special_slot: undefined,
                relic_slot: undefined,
            }
        };
        EntityStore.set(playerId, data);
    }
    return data;
}

/**
 * 資料庫維護系統
 */
system.runInterval(() => {
    // 生物資料維護
    EntityStore.keys().forEach(entityId => {
        // 回收不存在生物
        if(world.getEntity(entityId) === undefined){
            EntityStore.delete(entityId);
        }
    });
}, MaintainInterval_m * 1200);

/**
 * 生物死亡回收資料
 */
world.afterEvents.entityRemove.subscribe(signal => {
    if(signal.typeId !== "minecraft:player")
        EntityStore.delete(signal.removedEntityId);
});

/**
 * 玩家退出回收資料
 */
world.afterEvents.playerLeave.subscribe(signal => {
    EntityStore.delete(signal.playerId);
});