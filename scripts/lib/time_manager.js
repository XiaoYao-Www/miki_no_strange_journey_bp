import { world } from "@minecraft/server";
export class TimeManager {
    static taskList = [];
    /**
     * 運行更新
     */
    static update() {
        if (this.taskList.length < 1)
            return;
        // 任務處理
        const task = this.taskList[0];
        // delay 處理
        task.tickCounter--;
        if (task.tickCounter > 0)
            return;
        // 時間運算處理
        task.currentTicks += task.timeChange.changeTime;
        //// 時間校正
        if (task.currentTicks >= 24000)
            task.currentTicks -= 24000;
        else if (task.currentTicks < 0)
            task.currentTicks += 24000;
        //// 時間超過校正
        if (task.timeChange.changeTime > 0 && task.currentTicks > task.target)
            task.currentTicks = task.target;
        else if (task.timeChange.changeTime < 0 &&
            task.currentTicks < task.target)
            task.currentTicks = task.target;
        //// 時間書寫
        world.setTimeOfDay(task.currentTicks);
        //// 任務結束檢查
        if (task.currentTicks == task.target)
            this.taskList.shift();
        else
            task.tickCounter = task.timeChange.delayTick;
    }
    /**
     * 添加任務
     */
    static addTask(targetTime, timeChange) {
        // 目標時間校正
        if (targetTime >= 24000)
            targetTime -= 24000;
        else if (targetTime < 0)
            targetTime += 24000;
        // 變動參數檢查
        if (timeChange.changeTime == 0 || timeChange.delayTick < 0)
            return false;
        // 添加任務
        this.taskList.push({
            target: targetTime,
            timeChange: timeChange,
            currentTicks: world.getTimeOfDay(),
            tickCounter: 0,
        });
        return true;
    }
}
