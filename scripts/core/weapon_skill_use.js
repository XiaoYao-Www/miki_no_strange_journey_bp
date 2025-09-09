/**
 * 武器技能使用
 */
import { world } from "@minecraft/server";
import { getPlayerDataStore } from "../lib/data_store.js";
import { AccessoryFeaturesData } from "../lib/accessory_features_data.js";
/**
 * 武器開始使用事件
 */
world.afterEvents.itemStartUse.subscribe(signal => {
    if (signal.itemStack.hasTag("miki:weapon_active_skill")) {
        const playerData = getPlayerDataStore(signal.source.id);
        // 飾品能力
        for (const value of Object.values(playerData.accessory_slot)) {
            if (value === undefined)
                continue;
            const feature = AccessoryFeaturesData[value];
            if (feature.beforeUseItemSkill !== undefined) {
                feature.beforeUseItemSkill(signal.source, signal.itemStack);
            }
        }
    }
});
/**
 * 武器使用過程事件
 */
world.afterEvents.itemUse.subscribe(signal => {
    if (signal.itemStack.hasTag("miki:weapon_active_skill")) {
        const playerData = getPlayerDataStore(signal.source.id);
    }
});
/**
 * 武器結束使用事件
 */
world.afterEvents.itemStopUse.subscribe(signal => {
    if (signal.itemStack === undefined)
        return;
    if (signal.itemStack.hasTag("miki:weapon_active_skill")) {
        const playerData = getPlayerDataStore(signal.source.id);
        // 飾品能力
        for (const value of Object.values(playerData.accessory_slot)) {
            if (value === undefined)
                continue;
            const feature = AccessoryFeaturesData[value];
            if (feature.afterUseItemSkill !== undefined) {
                feature.afterUseItemSkill(signal.source, signal.itemStack);
            }
        }
    }
});
