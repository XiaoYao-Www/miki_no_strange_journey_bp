/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/
import { world } from "@minecraft/server";
/**
 * 計分板函式庫
 */
export class UFLib_Scoreboard {
    /**
     * 錯誤輸出
     */
    static FunError = class extends Error {
        constructor(message, options) {
            super(message, options);
            this.name = 'GFLib-Scoreboard';
        }
    };
    /**
     * 取得分數
     * @param target 目標
     * @param scoreboard 計分板
     * @returns 分數
     */
    static getScore(target, scoreboard) {
        try {
            const _scoreboatd = world.scoreboard.getObjective(scoreboard);
            if (_scoreboatd !== undefined) {
                return _scoreboatd.getScore(target);
            }
            else
                return undefined;
        }
        catch (error) {
            throw new UFLib_Scoreboard.FunError("error", { cause: error });
        }
    }
    /**
     * 設定分數
     * @param target 目標
     * @param score 分數
     * @param scoreboard 計分板
     * @returns 是否成功設定分數
     */
    static setScore(target, score, scoreboard) {
        try {
            const _scoreboatd = world.scoreboard.getObjective(scoreboard);
            if (_scoreboatd !== undefined) {
                _scoreboatd.setScore(target, score);
                return true;
            }
            else
                return false;
        }
        catch (error) {
            throw new UFLib_Scoreboard.FunError("error", { cause: error });
        }
    }
    /**
     * 改變分數
     * @param target 目標
     * @param score 分數
     * @param scoreboard 計分板
     * @returns 變更後的分數
     */
    static changeScore(target, score, scoreboard) {
        try {
            const _scoreboatd = world.scoreboard.getObjective(scoreboard);
            if (_scoreboatd !== undefined) {
                return _scoreboatd.addScore(target, score);
            }
            else
                return undefined;
        }
        catch (error) {
            throw new UFLib_Scoreboard.FunError("error", { cause: error });
        }
    }
    /**
     * 創建計分板
     * @param id ID
     * @param displayName 顯示名稱
     * @returns 計分板物件
     */
    static createScoreborad(id, displayName) {
        try {
            return world.scoreboard.addObjective(id, displayName);
        }
        catch (error) {
            throw new UFLib_Scoreboard.FunError("error", { cause: error });
        }
    }
}
