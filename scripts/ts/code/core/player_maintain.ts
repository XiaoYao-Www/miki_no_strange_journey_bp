/**
 * 玩家基本維護
 */
import { system, TicksPerSecond, world } from "@minecraft/server";
import { AccessoryFeaturesData } from "../lib/accessory_features_data.js";
import { getPlayerDataStore } from "../lib/data_store.js";
import { PeriodicEffectManager } from "../lib/periodic_effect_manager.js";
import { PlayerInterval } from "../lib/player_interval.js";
import { UFLib } from "../lib/uflib/uflib_core.js";
import { TimeManager } from "../lib/time_manager.js";


function getDayTransitionValue(tick: number): number {
    // 確保 tick 在 0~23999 之間
    tick = ((tick % 24000) + 24000) % 24000;

    // 清晨漸進 (22300~22800) → 0 到 1
    if (tick >= 22300 && tick < 22800) {
        return ((tick - 22300) / (22800 - 22300));
    }

    // 白天 (22800~11600) → 1
    if (tick >= 22800 || tick < 11600) {
        return 1;
    }

    // 傍晚漸減 (11600~13800) → 1 到 0
    if (tick >= 11600 && tick < 13800) {
        return 1 - ((tick - 11600) / (13800 - 11600));
    }

    // 其他時候 (夜晚) → 0
    return 0;
}


PlayerInterval.subscribe(player => {
    const playerData = getPlayerDataStore(player.id);
    // 設定基本屬性值基底
    let speed = 10;
    let health = 20;
    let attack = 1;

    // 飾品處理
    for (const value of Object.values(playerData.accessory_slot)) {
        if (value === undefined) continue;
        const feature = AccessoryFeaturesData[value];
        if (feature === undefined) continue;
        // 飾品加成基本屬性質
        if (feature.speed !== undefined) speed += feature.speed;
        if (feature.health !== undefined) health += feature.health;
        if (feature.strength !== undefined) attack += feature.strength;
        // 常駐效果
        if (feature.passiveEffects !== undefined) {
            for (const effect of feature.passiveEffects) {
                if (effect.type === "vanilla") {
                    player.addEffect(effect.name, 3, { amplifier: effect.amplifier ?? 0, showParticles: false });
                } else {
                    // 自定義效果還沒完成系統
                }
            }
        }
        // 定期效果
        if (feature.periodicEffects !== undefined) {
            for (const effect of feature.periodicEffects) {
                PeriodicEffectManager.setEffect(player.id, effect);
            }
        }
        /*
            永夜權杖特殊效果
        */
        if (value == "miki:relic_of_eternal_night") {
            const time = world.getTimeOfDay();
            const transitionValue = getDayTransitionValue(time);
            health -= Math.round(transitionValue * 10);
            attack += Math.round((1 - transitionValue) * 3);
            if (time >= 22300 || time < 13800) {
                playerData.flag.relic_of_eternal_night_day = true; // 白天旗標
            } else {
                playerData.flag.relic_of_eternal_night_day = false;
                if (playerData.flag.relic_of_eternal_night_transform) playerData.flag.relic_of_eternal_night_transform = false;
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
    // 免死狀態處理
    let lethal_target = false;
    if ((playerData.accessory_slot.relic_slot == "miki:relic_of_eternal_night") && (playerData.flag.relic_of_eternal_night_day)) lethal_target = true;
    if (lethal_target && !player.hasTag("miki:lethal_immunity")) player.addTag("miki:lethal_immunity");
    else if (!lethal_target && player.hasTag("miki:lethal_immunity")) player.removeTag("miki:lethal_immunity");
});

system.afterEvents.scriptEventReceive.subscribe(signal => {
    switch (signal.id) {
        case "miki:lethal_target":
            /*
                玩家觸發免死
            */
            if (signal.sourceEntity === undefined || signal.sourceEntity.typeId != "minecraft:player") return;
            const playerData = getPlayerDataStore(signal.sourceEntity.id);
            // 永夜權杖效果
            if ((playerData.accessory_slot.relic_slot == "miki:relic_of_eternal_night") &&
                (playerData.flag.relic_of_eternal_night_day) &&
                !playerData.flag.relic_of_eternal_night_transform
            ) {
                // 特效
                signal.sourceEntity.dimension.playSound("miki.eternal_night_immortality_trigger", signal.sourceEntity.location, {volume: 16});
                signal.sourceEntity.dimension.spawnParticle("miki:eternal_night_immortality_trigger_1", signal.sourceEntity.location);
                signal.sourceEntity.dimension.spawnParticle("miki:eternal_night_immortality_trigger_2", signal.sourceEntity.location);
                // 能力
                signal.sourceEntity.addEffect("minecraft:absorption", 5 * TicksPerSecond, { amplifier: 2, showParticles: false });
                TimeManager.setTask(18000, { changeTime: 400, delayTick: 1 });
                playerData.flag.relic_of_eternal_night_transform = true;
                return;
            }
            break;

        case "miki:set_time":
            /*
                設定時間
            */
            if (!signal.message) return
            UFLib.Game.sendMessage(TimeManager.addTask(parseInt(signal.message), { changeTime: 350, delayTick: 1 }) ? "true" : "false");
            break;

        default:
            UFLib.Game.sendMessage(`API事件 ${signal.id} 不存在`);
            break;
    }
});