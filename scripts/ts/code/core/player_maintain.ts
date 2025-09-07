/**
 * 玩家基本維護
 */
import { AccessoryFeaturesData } from "../lib/accessory_features_data.js";
import { getPlayerDataStore } from "../lib/data_store.js";
import { PlayerInterval } from "../lib/player_interval.js";


PlayerInterval.subscribe(player => {
    const playerData = getPlayerDataStore(player.id);
    // 設定基本值
    let speed = 10;
    let health = 20;
    let attack = 2;
    // 飾品加成
    for (const value of Object.values(playerData.accessory_slot)) {
        if(value === undefined) continue;
        const feature = AccessoryFeaturesData[value];
        if(feature.speed) speed += feature.speed;
        if(feature.health) health += feature.health;
        if(feature.strength) attack += feature.strength;
    }
    // 載入值
    player.triggerEvent("miki:remove_custom_value");
    player.triggerEvent(`miki:add_movement_speed_${speed.toString().replace(".", "_")}`); // 移動速度
    player.triggerEvent(`miki:add_health_${health.toString().replace(".", "_")}`); // 生命值
    player.triggerEvent(`miki:add_attack_damage_${attack.toString().replace(".", "_")}`); // 攻擊力
});