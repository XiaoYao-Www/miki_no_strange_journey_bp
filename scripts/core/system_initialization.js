/**
 * 初始化任務定義在這
 */
import { DimensionTypes, system, TicksPerSecond, world } from "@minecraft/server";
import { getPlayerDataStore } from "../lib/data_store.js";
/**
 * 遊戲系統啟動前
 */
system.beforeEvents.startup.subscribe(signal => {
    // 註冊自訂組件
    signal.itemComponentRegistry.registerCustomComponent("miki:food_effect", {
        onCompleteUse({ source }, { params }) {
            for (const { name, duration, amplifier, show_particles } of params) {
                source.addEffect(name, duration * TicksPerSecond, { amplifier: amplifier, showParticles: show_particles });
            }
        },
    });
});
/**
 * 世界載入後
 */
world.afterEvents.worldLoad.subscribe(signal => {
    // 清除錯誤滯留實體
    system.runTimeout(() => {
        DimensionTypes.getAll().forEach(dimensionType => {
            // 飾品容器
            world.getDimension(dimensionType.typeId).getEntities({ type: "miki:accessory_settings_table" }).forEach(accessorySettingsTable => {
                accessorySettingsTable.remove();
            });
        });
    }, 100);
    // 玩家資料初始化
    world.getPlayers().forEach(player => {
        const playerData = getPlayerDataStore(player.id);
        // 飾品欄位初始化
        if (playerData.accessory_slot.necklace_slot !== player.getDynamicProperty("miki:necklace_slot")) {
            playerData.accessory_slot.necklace_slot = player.getDynamicProperty("miki:necklace_slot");
        }
        if (playerData.accessory_slot.ring_slot !== player.getDynamicProperty("miki:ring_slot")) {
            playerData.accessory_slot.ring_slot = player.getDynamicProperty("miki:ring_slot");
        }
        if (playerData.accessory_slot.belt_slot !== player.getDynamicProperty("miki:belt_slot")) {
            playerData.accessory_slot.belt_slot = player.getDynamicProperty("miki:belt_slot");
        }
        if (playerData.accessory_slot.bracelet_slot !== player.getDynamicProperty("miki:bracelet_slot")) {
            playerData.accessory_slot.bracelet_slot = player.getDynamicProperty("miki:bracelet_slot");
        }
        if (playerData.accessory_slot.amulet_slot !== player.getDynamicProperty("miki:amulet_slot")) {
            playerData.accessory_slot.amulet_slot = player.getDynamicProperty("miki:amulet_slot");
        }
        if (playerData.accessory_slot.special_slot !== player.getDynamicProperty("miki:special_slot")) {
            playerData.accessory_slot.special_slot = player.getDynamicProperty("miki:special_slot");
        }
        if (playerData.accessory_slot.relic_slot !== player.getDynamicProperty("miki:relic_slot")) {
            playerData.accessory_slot.relic_slot = player.getDynamicProperty("miki:relic_slot");
        }
    });
});
/**
 * 玩家加入後
 */
world.afterEvents.playerJoin.subscribe(signal => {
    const playerData = getPlayerDataStore(signal.playerId);
    const player = world.getEntity(signal.playerId);
    // 飾品欄位初始化
    if (playerData.accessory_slot.necklace_slot !== player.getDynamicProperty("miki:necklace_slot")) {
        playerData.accessory_slot.necklace_slot = player.getDynamicProperty("miki:necklace_slot");
    }
    if (playerData.accessory_slot.ring_slot !== player.getDynamicProperty("miki:ring_slot")) {
        playerData.accessory_slot.ring_slot = player.getDynamicProperty("miki:ring_slot");
    }
    if (playerData.accessory_slot.belt_slot !== player.getDynamicProperty("miki:belt_slot")) {
        playerData.accessory_slot.belt_slot = player.getDynamicProperty("miki:belt_slot");
    }
    if (playerData.accessory_slot.bracelet_slot !== player.getDynamicProperty("miki:bracelet_slot")) {
        playerData.accessory_slot.bracelet_slot = player.getDynamicProperty("miki:bracelet_slot");
    }
    if (playerData.accessory_slot.amulet_slot !== player.getDynamicProperty("miki:amulet_slot")) {
        playerData.accessory_slot.amulet_slot = player.getDynamicProperty("miki:amulet_slot");
    }
    if (playerData.accessory_slot.special_slot !== player.getDynamicProperty("miki:special_slot")) {
        playerData.accessory_slot.special_slot = player.getDynamicProperty("miki:special_slot");
    }
    if (playerData.accessory_slot.relic_slot !== player.getDynamicProperty("miki:relic_slot")) {
        playerData.accessory_slot.relic_slot = player.getDynamicProperty("miki:relic_slot");
    }
});
