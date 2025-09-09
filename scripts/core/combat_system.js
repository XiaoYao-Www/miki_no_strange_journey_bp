/**
 * 戰鬥系統
 */
import { world } from "@minecraft/server";
import { getPlayerDataStore } from "../lib/data_store.js";
import { AccessoryFeaturesData } from "../lib/accessory_features_data.js";
/**
 * 實體受傷事件
 */
world.afterEvents.entityHurt.subscribe(signal => {
    // 玩家攻擊
    if (signal.damageSource.damagingEntity?.typeId === "minecraft:player") {
        const attackPlayerData = getPlayerDataStore(signal.damageSource.damagingEntity.id);
        // 飾品效果 - 攻擊實體後觸發
        for (const value of Object.values(attackPlayerData.accessory_slot)) {
            if (value === undefined)
                continue;
            const feature = AccessoryFeaturesData[value];
            if (feature.afterHitEntity !== undefined) {
                feature.afterHitEntity(signal.damageSource.damagingEntity, signal.hurtEntity, signal.damage, signal.damageSource.cause);
            }
        }
    }
    // 玩家受傷
    if (signal.hurtEntity.typeId === "minecraft:player") {
        const hurtPlayerData = getPlayerDataStore(signal.hurtEntity.id);
        // 飾品效果 - 受傷後觸發
        for (const value of Object.values(hurtPlayerData.accessory_slot)) {
            if (value === undefined)
                continue;
            const feature = AccessoryFeaturesData[value];
            if (feature.afterHurt !== undefined) {
                feature.afterHurt(signal.hurtEntity, signal.damage, signal.damageSource.cause, signal.damageSource.damagingEntity);
            }
        }
    }
});
/**
 * 實體死亡事件
 */
world.afterEvents.entityDie.subscribe(signal => {
    // 飾品效果 - 殺死實體後觸發
    if (signal.damageSource.damagingEntity?.typeId === "minecraft:player") {
        const attackPlayerData = getPlayerDataStore(signal.damageSource.damagingEntity.id);
        for (const value of Object.values(attackPlayerData.accessory_slot)) {
            if (value === undefined)
                continue;
            const feature = AccessoryFeaturesData[value];
            if (feature.afterKillEntity !== undefined) {
                feature.afterKillEntity(signal.damageSource.damagingEntity, signal.deadEntity, signal.damageSource.cause);
            }
        }
    }
});
