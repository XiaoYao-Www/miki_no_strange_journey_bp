/**
 * 維護程式不一定都寫在這
 * 有些寫在對應系統文件裡
 */

import { system } from "@minecraft/server";
import { PeriodicEffectManager } from "../lib/periodic_effect_manager.js";
import { TimeManager } from "../lib/time_manager.js";


system.runInterval(() => {
    // 定期效果更新
    PeriodicEffectManager.update();
    // 時間系統運作
    TimeManager.update();
})