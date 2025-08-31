/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/

import { Player, system, world } from "@minecraft/server";

export class UFLib_HandChangeEventSignal {
    /*
        訂閱回傳訊號
    */
    readonly player: Player;
    readonly lastSlot: number;
    readonly nowSlot: number;

    constructor(player: Player, lastSlot: number, nowSlot: number) {
        this.player = player;
        this.lastSlot = lastSlot;
        this.nowSlot = nowSlot;
    }
}

export class UFLib_HandChangeEvent {
    private static callBacks: Set<(arg: UFLib_HandChangeEventSignal) => void> = new Set();
    private static cache: Map<string, number> = new Map();
    private static running: number | undefined = undefined;

    private static handChangeEventRunning(): void {
        /*
            事件維護函式
        */
        world.getAllPlayers().forEach((player) => {
            const lastSlot = this.cache.get(player.id);
            if (lastSlot !== undefined && player.selectedSlotIndex !== lastSlot) {
                const signal = new UFLib_HandChangeEventSignal(player, lastSlot, player.selectedSlotIndex);
                this.callBacks.forEach((callback) => {
                    callback(signal);
                });
            }
            this.cache.set(player.id, player.selectedSlotIndex);
        });
    }

    static subscribe(callback: (arg: UFLib_HandChangeEventSignal) => void): (arg: UFLib_HandChangeEventSignal) => void {
        /**
         * 訂閱事件
         * @param callback 回調函式
         */
        if (!this.callBacks.has(callback)) {
            this.callBacks.add(callback);
            if (this.running === undefined) {
                // 啟動事件維護
                this.running = system.runInterval(this.handChangeEventRunning);
            }
        }
        return callback;
    }

    static unsubscribe(callback: (arg: UFLib_HandChangeEventSignal) => void): void {
        /**
         * 取消訂閱
         * @param callback 回調函式
         */
        if (this.callBacks.has(callback)) {
            this.callBacks.delete(callback);
            if (this.callBacks.size === 0 && this.running !== undefined) {
                // 停止事件維護
                system.clearRun(this.running);
                this.running = undefined;
            }
        }
    }
}
