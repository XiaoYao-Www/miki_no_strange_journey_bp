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
        // 任務處理
        const task: TimeTask = this.taskList[0];
        // delay 處理
        task.tickCounter--;
        if (task.tickCounter > 0) return;
        // 時間運算處理
        task.currentTicks += task.timeChange.changeTime;
        //// 時間校正
        task.currentTicks = ((task.currentTicks % 24000) + 24000) % 24000;
        //// 時間超過校正
        if (
            (task.timeChange.changeTime > 0 &&
                task.currentTicks >= task.target) ||
            (task.timeChange.changeTime < 0 && task.currentTicks <= task.target)
        ) {
            task.currentTicks = task.target;
        }
        //// 時間書寫
        world.setTimeOfDay(task.currentTicks);
        //// 任務結束檢查
        if (task.currentTicks == task.target) this.taskList.shift();
        else task.tickCounter = task.timeChange.delayTick;
    }

    /**
     * 添加任務
     */
    static addTask(targetTime: number, timeChange: TimeTaskChange): boolean {
        // 目標時間校正
        if (targetTime >= 24000) targetTime -= 24000;
        else if (targetTime < 0) targetTime += 24000;
        // 變動參數檢查
        if (timeChange.changeTime == 0 || timeChange.delayTick < 0)
            return false;
        // 添加任務
        this.taskList.push({
            target: targetTime,
            timeChange: timeChange,
            currentTicks: world.getTimeOfDay(),
            tickCounter: 0
        });
        return true;
    }
}
