/**
 * 定期效果管理
 */
import { world } from "@minecraft/server";
/**
 * 取得效果鍵值
 * @param player 玩家ID
 * @param effect 效果
 * @returns key
 */
function getEffectkey(player, effect) {
    return `${player}_${effect.type}_${effect.name}_${effect.amplifier ?? 0}_${effect.duration}_${effect.interval}`;
}
/**
 * 定期效果管理
 */
export class PeriodicEffectManager {
    static effects = new Map();
    /**
     * 設定定期效果
     * @param player 玩家ID
     * @param effect 效果
     */
    static setEffect(player, effect) {
        const key = getEffectkey(player, effect);
        if (this.effects.has(key)) {
            const data = this.effects.get(key);
            data.active = true;
        }
        else {
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
    static update() {
        for (const [key, effect] of this.effects) {
            if (!effect.active) {
                this.effects.delete(key);
                continue;
            }
            effect.active = false;
            effect.timer++;
            if (effect.timer >= effect.interval) {
                effect.timer = 0;
                // 觸發效果
                const player = world.getEntity(effect.playerId);
                if (player === undefined || !player.isValid)
                    continue;
                if (effect.type === "vanilla") {
                    player.addEffect(effect.name, effect.duration, { amplifier: effect.amplifier ?? 0, showParticles: false });
                }
                else {
                    // 自定義效果還沒完成系統
                }
            }
        }
    }
}
