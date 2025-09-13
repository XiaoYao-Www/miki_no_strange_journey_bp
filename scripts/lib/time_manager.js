import { world } from "@minecraft/server";
export class TimeManager {
    static taskList = [];
    /**
     * 運行更新
     */
    static update() {
        if (this.taskList.length < 1)
            return;
        const task = this.taskList[0];
        // delay處理
        task.tickCounter--;
        if (task.tickCounter > 0)
            return;
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
            if ((task.currentTicks < task.target && task.target <= next) ||
                (task.currentTicks > next &&
                    (task.target > task.currentTicks || task.target <= next)) // 跨越0點情況
            ) {
                task.currentTicks = task.target;
                world.setTimeOfDay(task.currentTicks);
                this.taskList.shift();
                return;
            }
        }
        else {
            // 反向推進，若 current > target >= next，則到達
            if ((task.currentTicks > task.target && task.target >= next) ||
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
     */
    static addTask(targetTime, timeChange) {
        // 目標時間校正
        if (targetTime >= 24000)
            targetTime -= 24000;
        else if (targetTime < 0)
            targetTime += 24000;
        // 參數檢查
        if (timeChange.changeTime === 0 || timeChange.delayTick < 0)
            return false;
        this.taskList.push({
            target: targetTime,
            timeChange: timeChange,
            currentTicks: world.getTimeOfDay(),
            tickCounter: 0,
        });
        return true;
    }
}
