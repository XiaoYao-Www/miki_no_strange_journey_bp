import { Player, system, world } from "@minecraft/server";

/**
 * 玩家遍歷訂閱（靜態單例）
 */
export class PlayerInterval {
    private static readonly callBackList: ((player: Player) => void)[] = [];
    private static intervalNumber: number | undefined;

    /**
     * 訂閱
     * @param callBack 回調函式
     */
    static subscribe(callBack: (player: Player) => void): void {
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
    static unsubscribe(callBack: (player: Player) => void): void {
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
