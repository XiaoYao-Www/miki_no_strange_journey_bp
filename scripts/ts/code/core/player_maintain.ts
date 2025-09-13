/**
 * 玩家基本維護
 */
import { system } from "@minecraft/server";
import { AccessoryFeaturesData } from "../lib/accessory_features_data.js";
import { getPlayerDataStore } from "../lib/data_store.js";
import { PeriodicEffectManager } from "../lib/periodic_effect_manager.js";
import { PlayerInterval } from "../lib/player_interval.js";
import { UFLib } from "../lib/uflib/uflib_core.js";
import { TimeManager } from "../lib/time_manager.js";


PlayerInterval.subscribe(player => {
    const playerData = getPlayerDataStore(player.id);
    // 設定基本屬性值基底
    let speed = 10;
    let health = 20;
    let attack = 1;

    // 飾品處理
    for (const value of Object.values(playerData.accessory_slot)) {
        if(value === undefined) continue;
        const feature = AccessoryFeaturesData[value];
        if(feature === undefined) continue;
        // 飾品加成基本屬性質
        if(feature.speed !== undefined) speed += feature.speed;
        if(feature.health !== undefined) health += feature.health;
        if(feature.strength !== undefined) attack += feature.strength;
        // 常駐效果
        if(feature.passiveEffects !== undefined){
            for(const effect of feature.passiveEffects){
                if(effect.type === "vanilla"){
                    player.addEffect(effect.name, 3, {amplifier: effect.amplifier ?? 0, showParticles: false});
                }else{
                    // 自定義效果還沒完成系統
                }
            }
        }
        // 定期效果
        if(feature.periodicEffects !== undefined){
            for(const effect of feature.periodicEffects){
                PeriodicEffectManager.setEffect(player.id, effect);
            }
        }
    }

    // 應用基本屬性值
    //// 數值預處理
    speed = UFLib.UnityBasic.clamp(speed, 0, 100); // 移動速度限制在1~100
    health = UFLib.UnityBasic.clamp(health, 1, 100); // 生命值限制在1~100
    attack = UFLib.UnityBasic.clamp(attack, 0, 100); // 攻擊力限制在0~100
    //// 應用數值
    player.triggerEvent("miki:remove_custom_value");
    player.triggerEvent(`miki:add_movement_speed_${speed.toString()}`); // 移動速度
    player.triggerEvent(`miki:add_health_${health.toString()}`); // 生命值
    player.triggerEvent(`miki:add_attack_damage_${attack.toString()}`); // 攻擊力
});

system.afterEvents.scriptEventReceive.subscribe(signal => {
    switch (signal.id) {
        case "miki:lethal_target":
            /*
                玩家觸發免死
            */
            if(signal.sourceEntity === undefined || signal.sourceEntity.typeId != "minecraft:player") return;
            UFLib.Game.sendMessage("test");
            break;
        
        case "miki:set_time":
            /*
                設定時間
            */
           if(!signal.message) return
           UFLib.Game.sendMessage(TimeManager.addTask(parseInt(signal.message), {changeTime: 350, delayTick: 1}) ? "true": "false");
           break;
    
        default:
            UFLib.Game.sendMessage(`API事件 ${signal.id} 不存在`);
            break;
    }
});