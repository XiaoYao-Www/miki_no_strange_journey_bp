/**
 * 飾品資料類型定義
 */
import { Entity, EntityDamageCause, ItemStack, Player } from "@minecraft/server";

export interface AccessoryFeaturesPassiveEffect { // 常駐效果
    type: "vanilla" | "custom"; // 效果類型
    name: string; // 效果名稱
    amplifier?: number; // 效果強度
}

export interface AccessoryFeaturesPeriodicEffect { // 定期效果
    type: "vanilla" | "custom"; // 效果類型
    name: string; // 效果名稱
    amplifier?: number; // 效果強度
    duration: number; // 效果持續時間，單位原版為秒，自定義為tick
    interval: number; // 效果觸發間隔，單位為tick
}

export interface AccessoryFeatures{
    // 基本属性
    health?: number; // 生命值
    speed?: number; // 移動速度
    strength?: number; // 攻擊力
    passiveEffects?: AccessoryFeaturesPassiveEffect[]; // 常駐效果
    periodicEffects?: AccessoryFeaturesPeriodicEffect[]; // 定期效果
    // 事件觸發
    afterHitEntity?: (player: Player, target: Entity, damageValue: number, cause: EntityDamageCause) => void; // 攻擊實體後觸發
    afterHurt?: (player: Player, damageValue: number, cause: EntityDamageCause, attacker?: Entity) => void; // 受傷後觸發
    afterKillEntity?: (player: Player, target: Entity, cause: EntityDamageCause) => void; // 殺死實體後觸發
    afterUseItemSkill?: (player: Player, item: ItemStack) => void; // 使用物品技能後觸發
    beforeUseItemSkill?: (player: Player, item: ItemStack) => void; // 使用物品技能前觸發
}