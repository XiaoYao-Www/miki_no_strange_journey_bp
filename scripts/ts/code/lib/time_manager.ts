import { world } from "@minecraft/server";

export interface TimeTaskChange {
    delayTick: number;
    changeTime: number;
}
export interface TimeTask {
    target: number;
    timeChange: TimeTaskChange;
    currentTicks: number;
    tickCounter: number; // 用於delay計數
}

export class TimeManager {
    private static readonly taskList: TimeTask[] = [];

    /**
     * 運行更新
     */
    static update(): void {
        if (this.taskList.length < 1) return;

        const task: TimeTask = this.taskList[0];

        // delay處理
        task.tickCounter--;
        if (task.tickCounter > 0) return;

        const step = task.timeChange.changeTime;
        let next = task.currentTicks + step;

        // 繞回校正（保持 0~23999）
        next = ((next % 24000) + 24000) % 24000;

        // 判斷是否到達目標
        if (next === task.target) {
            task.currentTicks = task.target;
            world.setTimeOfDay(task.currentTicks);
            this.taskList.shift(); // 任務完成
            return;
        }

        // 判斷是否「跨過目標」
        if (step > 0) {
            // 正向推進，若 current < target <= next，則到達
            if (
                (task.currentTicks < task.target && task.target <= next) ||
                (task.currentTicks > next &&
                    (task.target > task.currentTicks || task.target <= next)) // 跨越0點情況
            ) {
                task.currentTicks = task.target;
                world.setTimeOfDay(task.currentTicks);
                this.taskList.shift();
                return;
            }
        } else {
            // 反向推進，若 current > target >= next，則到達
            if (
                (task.currentTicks > task.target && task.target >= next) ||
                (task.currentTicks < next &&
                    (task.target < task.currentTicks || task.target >= next)) // 跨越0點情況
            ) {
                task.currentTicks = task.target;
                world.setTimeOfDay(task.currentTicks);
                this.taskList.shift();
                return;
            }
        }

        // 還沒到 → 繼續推進
        task.currentTicks = next;
        world.setTimeOfDay(task.currentTicks);
        task.tickCounter = task.timeChange.delayTick;
    }

    /**
     * 添加任務
     * @param targetTime 目標時間 
     * @param timeChange 時間變化參數
     * @returns 添加結果
     */
    static addTask(targetTime: number, timeChange: TimeTaskChange): boolean {
        // 目標時間校正
        if (targetTime >= 24000) targetTime -= 24000;
        else if (targetTime < 0) targetTime += 24000;

        // 參數檢查
        if (timeChange.changeTime === 0 || timeChange.delayTick < 0) return false;

        this.taskList.push({
            target: targetTime,
            timeChange: timeChange,
            currentTicks: world.getTimeOfDay(),
            tickCounter: 0,
        });
        return true;
    }

    /**
     * 清除所有任務
     */
    static clearTaskList(): void{
        this.taskList.length = 0;
    }

    /**
     * 強制設定任務(清空任務列表)
     * @param targetTime 目標時間
     * @param timeChange 時間變化
     * @returns 添加結果
     */
    static setTask(targetTime: number, timeChange: TimeTaskChange): boolean{
        // 目標時間校正
        if (targetTime >= 24000) targetTime -= 24000;
        else if (targetTime < 0) targetTime += 24000;
        // 參數檢查
        if (timeChange.changeTime === 0 || timeChange.delayTick < 0) return false;
        // 任務設定
        this.clearTaskList();
        this.taskList.push({
            target: targetTime,
            timeChange: timeChange,
            currentTicks: world.getTimeOfDay(),
            tickCounter: 0,
        });
        return true;
    }
}
