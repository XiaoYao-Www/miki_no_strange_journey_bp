/**
 * 初始化任務定義在這
 */
import { DimensionTypes, Player, system, world } from "@minecraft/server";
import { UFLib } from "../lib/uflib/uflib_core.js";
import { getPlayerDataStore } from "../lib/data_store.js";


/**
 * 遊戲系統啟動前
 */
system.beforeEvents.startup.subscribe(signal => {
    // 註冊自訂組件
    // signal.blockComponentRegistry.registerCustomComponent("miki:inlay_workbench_place", {
    //     onPlace(e){
    //         let entity = e.dimension.spawnEntity("miki:inlay_workbench_table", UFLib.Vector3.sum(e.block.location, {x: 0.5, y: 1.1, z: 0.5}));
    //         entity.nameTag = "miki:inlay_workbench_table";
    //     }
    // });
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
            playerData.accessory_slot.necklace_slot = player.getDynamicProperty("miki:necklace_slot") as string | undefined;
        }
        if (playerData.accessory_slot.ring_slot !== player.getDynamicProperty("miki:ring_slot")) {
            playerData.accessory_slot.ring_slot = player.getDynamicProperty("miki:ring_slot") as string | undefined;
        }
        if (playerData.accessory_slot.belt_slot !== player.getDynamicProperty("miki:belt_slot")) {
            playerData.accessory_slot.belt_slot = player.getDynamicProperty("miki:belt_slot") as string | undefined;
        }
        if (playerData.accessory_slot.bracelet_slot !== player.getDynamicProperty("miki:bracelet_slot")) {
            playerData.accessory_slot.bracelet_slot = player.getDynamicProperty("miki:bracelet_slot") as string | undefined;
        }
        if (playerData.accessory_slot.amulet_slot !== player.getDynamicProperty("miki:amulet_slot")) {
            playerData.accessory_slot.amulet_slot = player.getDynamicProperty("miki:amulet_slot") as string | undefined;
        }
        if (playerData.accessory_slot.special_slot !== player.getDynamicProperty("miki:special_slot")) {
            playerData.accessory_slot.special_slot = player.getDynamicProperty("miki:special_slot") as string | undefined;
        }
        if (playerData.accessory_slot.relic_slot !== player.getDynamicProperty("miki:relic_slot")) {
            playerData.accessory_slot.relic_slot = player.getDynamicProperty("miki:relic_slot") as string | undefined;
        }
    });
});

/**
 * 玩家加入後
 */
world.afterEvents.playerJoin.subscribe(signal => {
    const playerData = getPlayerDataStore(signal.playerId);
    const player = world.getEntity(signal.playerId) as Player;
    // 飾品欄位初始化
    if (playerData.accessory_slot.necklace_slot !== player.getDynamicProperty("miki:necklace_slot")){
        playerData.accessory_slot.necklace_slot = player.getDynamicProperty("miki:necklace_slot") as string | undefined;
    }
    if(playerData.accessory_slot.ring_slot !== player.getDynamicProperty("miki:ring_slot")){
        playerData.accessory_slot.ring_slot = player.getDynamicProperty("miki:ring_slot") as string | undefined;
    }
    if(playerData.accessory_slot.belt_slot !== player.getDynamicProperty("miki:belt_slot")){
        playerData.accessory_slot.belt_slot = player.getDynamicProperty("miki:belt_slot") as string | undefined;
    }
    if(playerData.accessory_slot.bracelet_slot !== player.getDynamicProperty("miki:bracelet_slot")){
        playerData.accessory_slot.bracelet_slot = player.getDynamicProperty("miki:bracelet_slot") as string | undefined;
    }
    if(playerData.accessory_slot.amulet_slot !== player.getDynamicProperty("miki:amulet_slot")){
        playerData.accessory_slot.amulet_slot = player.getDynamicProperty("miki:amulet_slot") as string | undefined;
    }
    if(playerData.accessory_slot.special_slot !== player.getDynamicProperty("miki:special_slot")){
        playerData.accessory_slot.special_slot = player.getDynamicProperty("miki:special_slot") as string | undefined;
    }
    if(playerData.accessory_slot.relic_slot !== player.getDynamicProperty("miki:relic_slot")){
        playerData.accessory_slot.relic_slot = player.getDynamicProperty("miki:relic_slot") as string | undefined;
    }
});