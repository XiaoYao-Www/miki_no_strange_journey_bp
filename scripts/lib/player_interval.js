import { system, world } from "@minecraft/server";
/**
 * 玩家遍歷訂閱（靜態單例）
 */
export class PlayerInterval {
    static callBackList = [];
    static intervalNumber;
    /**
     * 訂閱
     * @param callBack 回調函式
     */
    static subscribe(callBack) {
        if (!this.callBackList.includes(callBack)) {
            this.callBackList.push(callBack);
        }
        if (this.intervalNumber === undefined) {
            this.intervalNumber = system.runInterval(() => {
                for (const callBackFunction of this.callBackList) {
                    for (const player of world.getAllPlayers()) {
                        callBackFunction(player);
                    }
                }
            });
        }
    }
    /**
     * 取消訂閱
     * @param callBack 回調函式
     */
    static unsubscribe(callBack) {
        const index = this.callBackList.indexOf(callBack);
        if (index !== -1) {
            this.callBackList.splice(index, 1);
            if (this.callBackList.length < 1 && this.intervalNumber !== undefined) {
                system.clearRun(this.intervalNumber);
                this.intervalNumber = undefined;
            }
        }
    }
}
