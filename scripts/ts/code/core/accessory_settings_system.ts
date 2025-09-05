import { DimensionTypes, system, world } from "@minecraft/server";
import { PlayerInterval } from "../lib/player_interval.js";
import { UFLib } from "../lib/uflib/uflib_core.js";
import { getPlayerDataStore } from "../lib/data_store.js";


/**
 * 設定
 */
const MaintainInterval_m = 10;

/**
 * 物品容器邏輯
 */
PlayerInterval.subscribe(player => {
    const playerData = getPlayerDataStore(player.id);
    // 不是鑲嵌設定物品
    if (!(UFLib.Player.getMainHand(player)?.typeId == "miki:accessory_settings")){
        if(playerData.accessory_settings_table !== undefined){
            world.getEntity(playerData.accessory_settings_table)?.remove();
            playerData.accessory_settings_table = undefined;
        }
        return;
    }
    // 鑲嵌設定物品
    if(playerData.accessory_settings_table === undefined){
        const table = player.dimension.spawnEntity("miki:accessory_settings_table", player.getHeadLocation());
        table.nameTag = "miki:accessory_settings_table";
        playerData.accessory_settings_table = table.id;
    }else{
        const table = world.getEntity(playerData.accessory_settings_table);
        if((table === undefined) || !table.isValid){
            table?.remove(); // 確保移除
            playerData.accessory_settings_table = undefined;
            return;
        }
        // 正常邏輯
        table.teleport(player.getHeadLocation());
    }
});

/**
 * 維護系統
 */
system.runInterval(() => {
    // 取得所有使用中容器列表
    const UseList: string[] = [];
    world.getAllPlayers().forEach(player => {
        const playerData = getPlayerDataStore(player.id);
        if(playerData.accessory_settings_table !== undefined) UseList.push(playerData.accessory_settings_table);
    });
    // 清除未使用容器
    DimensionTypes.getAll().forEach(dimensionType => {
        world.getDimension(dimensionType.typeId).getEntities({ type: "miki:accessory_settings_table" }).forEach(table => {
            if(!UseList.includes(table.id)) table.remove();
        });
    });
}, MaintainInterval_m * 1200);