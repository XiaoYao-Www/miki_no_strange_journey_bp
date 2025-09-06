import { system, world } from "@minecraft/server";
/**
 * 設定
 */
const MaintainInterval_m = 10;
const EntityStore = new Map();
/**
 * 取得玩家儲存資料
 * @param playerId 玩家ID
 * @returns 玩家儲存資料
 */
export function getPlayerDataStore(playerId) {
    let data = EntityStore.get(playerId);
    if (data === undefined) {
        data = {
            accessory_settings_table: undefined,
            accessory_slot: {
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
        if (world.getEntity(entityId) === undefined) {
            EntityStore.delete(entityId);
        }
    });
}, MaintainInterval_m * 1200);
