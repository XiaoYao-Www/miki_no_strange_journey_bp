/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/
import { world } from "@minecraft/server";
/**
 * 通用函式庫
 */
export class UFLib_Game {
    /**
     * 錯誤輸出
     */
    static FunError = class extends Error {
        constructor(message, options) {
            super(message, options);
            this.name = 'UFLib-Game';
        }
    };
    /**
     * 傳送訊息
     * @param message 訊息
     * @param target 目標
     */
    static sendMessage(message, target) {
        try {
            if (target) {
                target.sendMessage(message);
            }
            else {
                world.sendMessage(message);
            }
        }
        catch (error) {
            throw new UFLib_Game.FunError("error", { cause: error });
        }
    }
}
