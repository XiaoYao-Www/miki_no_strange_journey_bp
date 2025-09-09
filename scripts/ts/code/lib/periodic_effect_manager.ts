/**
 * 定期效果管理
 */
import { Player, world } from "@minecraft/server";
import { AccessoryFeaturesPeriodicEffect } from "../types/accessory_type.js";


/**
 * 取得效果鍵值
 * @param player 玩家ID
 * @param effect 效果
 * @returns key
 */
function getEffectkey(player: string, effect: AccessoryFeaturesPeriodicEffect): string{
    return `${player}_${effect.type}_${effect.name}_${effect.amplifier ?? 0}_${effect.duration}_${effect.interval}`;
}

export interface PeriodicEffectData {
    type: "vanilla" | "custom"; // 效果類型
    name: string; // 效果名稱
    amplifier?: number; // 效果強度
    playerId: string; // 玩家ID
    duration: number; // 效果持續時間，原版為秒，自定義為tick
    interval: number; // 效果觸發間隔，單位為tick
    timer: number; // 計時器
    active: boolean; // 是否激活
}

/**
 * 定期效果管理
 */
export class PeriodicEffectManager{
    private static readonly effects = new Map<string, PeriodicEffectData>();

    /**
     * 設定定期效果
     * @param player 玩家ID
     * @param effect 效果
     */
    static setEffect(player: string, effect: AccessoryFeaturesPeriodicEffect): void{
        const key = getEffectkey(player, effect);
        if(this.effects.has(key)){
            const data = this.effects.get(key) as PeriodicEffectData;
            data.active = true;
        }else{
            this.effects.set(key, {
                type: effect.type,
                name: effect.name,
                amplifier: effect.amplifier,
                playerId: player,
                duration: effect.duration,
                interval: effect.interval,
                timer: 0,
                active: true
            });
        }
    }

    /**
     * 更新效果
     * 每tick執行一次
     */
    static update(): void{
        for(const [key, effect] of this.effects){
            if(!effect.active){
                this.effects.delete(key);
                continue;
            }
            effect.active = false;
            effect.timer++;
            if(effect.timer >= effect.interval){
                effect.timer = 0;
                // 觸發效果
                const player = world.getEntity(effect.playerId) as Player;
                if(player === undefined || !player.isValid) continue;
                if(effect.type === "vanilla"){
                    player.addEffect(effect.name, effect.duration, {amplifier: effect.amplifier ?? 0, showParticles: false});
                }else{
                    // 自定義效果還沒完成系統
                }
            }
        }
    }
}