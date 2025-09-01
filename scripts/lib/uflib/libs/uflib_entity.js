/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/
import { EntityComponentTypes } from "@minecraft/server";
/**
 * 實體函式庫
 */
export class UFLib_Entity {
    /**
     * 錯誤輸出
     */
    static FunError = class extends Error {
        constructor(message, options) {
            super(message, options);
            this.name = 'UFLib-Entity';
        }
    };
    /**
     * 改變實體的血量
     * @param entity 實體目標
     * @param value 數值
     * @returns 實際血量變化量
     */
    static changeHealth(entity, value) {
        try {
            // 0 處理
            if (value == 0)
                return 0;
            // 一般處理
            const healthCom = entity.getComponent(EntityComponentTypes.Health);
            if (healthCom === undefined)
                return 0;
            let target_value = healthCom.currentValue + value;
            let actual_change_value;
            if (target_value > healthCom.effectiveMax) {
                // 超出有效最大值
                actual_change_value = healthCom.effectiveMax - healthCom.currentValue;
                healthCom.resetToMaxValue();
            }
            else if (target_value < healthCom.effectiveMin) {
                // 低於有效最小值
                actual_change_value = healthCom.effectiveMin - healthCom.currentValue;
                healthCom.resetToMinValue();
            }
            else {
                // 普通情況
                actual_change_value = value;
                healthCom.setCurrentValue(target_value);
            }
            return actual_change_value;
        }
        catch (error) {
            throw new UFLib_Entity.FunError("error", { cause: error });
        }
    }
    /**
     * 取得實體的血量
     * @param entity 實體目標
     * @returns 血量
     */
    static getHealth(entity) {
        try {
            const healthCom = entity.getComponent(EntityComponentTypes.Health);
            if (healthCom === undefined)
                return undefined;
            return healthCom.currentValue;
        }
        catch (error) {
            throw new UFLib_Entity.FunError("error", { cause: error });
        }
    }
    /**
     * 取得實體的血量比例
     * @param entity 實體目標
     * @returns 血量比例
     */
    static getHealthProportion(entity) {
        try {
            const healthCom = entity.getComponent(EntityComponentTypes.Health);
            if (healthCom === undefined)
                return undefined;
            return healthCom.currentValue / healthCom.effectiveMax;
        }
        catch (error) {
            throw new UFLib_Entity.FunError("error", { cause: error });
        }
    }
    /**
     * 取得實體的最大有效血量
     * @param entity 實體目標
     * @returns 血量
     */
    static getMaxHealth(entity) {
        try {
            const healthCom = entity.getComponent(EntityComponentTypes.Health);
            if (healthCom === undefined)
                return undefined;
            return healthCom.effectiveMax;
        }
        catch (error) {
            throw new UFLib_Entity.FunError("error", { cause: error });
        }
    }
    /**
     * 取得實體的最小有效血量
     * @param entity 實體目標
     * @returns 血量
     */
    static getMinHealth(entity) {
        try {
            const healthCom = entity.getComponent(EntityComponentTypes.Health);
            if (healthCom === undefined)
                return undefined;
            return healthCom.currentValue;
        }
        catch (error) {
            throw new UFLib_Entity.FunError("error", { cause: error });
        }
    }
}
