import { system, world } from "@minecraft/server";
/**
 * 玩家遍歷訂閱（不同間隔共用同一個 runInterval，使用 Map 管理）
 */
export class PlayerInterval {
    static groups = new Map();
    /**
     * 訂閱
     * @param callBack 回調函式
     * @param interval 間隔 tick（預設 1）
     */
    static subscribe(callBack, interval = 1) {
        let group = this.groups.get(interval);
        if (group === undefined) {
            const callbacks = [];
            const handle = system.runInterval(() => {
                for (const fn of callbacks) {
                    for (const player of world.getAllPlayers()) {
                        fn(player);
                    }
                }
            }, interval);
            group = { handle, callbacks };
            this.groups.set(interval, group);
        }
        // 避免重複註冊
        if (!group.callbacks.includes(callBack)) {
            group.callbacks.push(callBack);
        }
    }
    /**
     * 取消訂閱
     * @param callBack 回調函式
     */
    static unsubscribe(callBack) {
        for (const [interval, group] of this.groups.entries()) {
            const index = group.callbacks.indexOf(callBack);
            if (index !== -1) {
                group.callbacks.splice(index, 1);
                // 如果這個 group 沒人用了，就清掉
                if (group.callbacks.length === 0) {
                    system.clearRun(group.handle);
                    this.groups.delete(interval);
                }
                return;
            }
        }
    }
}
