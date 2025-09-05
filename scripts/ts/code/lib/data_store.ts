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