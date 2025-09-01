/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/
/**
 * 基本型通用函式庫
 */
export class UFLib_UnityBasic {
    /**
     * 錯誤輸出
     */
    static FunError = class extends Error {
        constructor(message, options) {
            super(message, options);
            this.name = 'UFLib-UnityBasic';
        }
    };
    /**
     * 物件深度比較
     * ( 由 ChatGPT 生成 )
     * @param obj1 物件1
     * @param obj2 物件2
     * @returns 是否一致
     */
    static deepEqual(obj1, obj2) {
        try {
            // 檢查類型是否相同
            if (typeof obj1 !== typeof obj2) {
                return false;
            }
            // 如果是基本類型，直接比較值
            if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
                return obj1 === obj2;
            }
            // 獲取兩個物件的鍵值
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);
            // 比較屬性數量
            if (keys1.length !== keys2.length) {
                return false;
            }
            // 遞歸比較每個屬性的值
            for (const key of keys1) {
                if (!this.deepEqual(obj1[key], obj2[key])) {
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            throw new UFLib_UnityBasic.FunError("error", { cause: error });
        }
    }
    /**
     * 物件打印
     * ( 由 ChatGPT 生成 )
     * @param objOrArray 物件
     * @param indent 縮排深度
     * @param printFunction 打印函式
     */
    static printItem(objOrArray, indent = 0, printFunction = console.log) {
        try {
            // 檢查輸入是否為物件或數組
            if (typeof objOrArray === 'object' && objOrArray !== null) {
                // 遍歷鍵或索引
                for (const key in objOrArray) {
                    let text = '|';
                    // 根據深度打印縮進
                    for (let i = 0; i < indent; i++) {
                        text += '  ';
                    }
                    // 打印鍵或索引
                    printFunction(`${text}${key}: `);
                    // 遞歸調用函數處理嵌套的物件或數組
                    this.printItem(objOrArray[key], indent + 1, printFunction);
                }
            }
            else {
                let text = '|';
                // 根據深度打印縮進
                for (let i = 0; i < indent; i++) {
                    text += '  ';
                }
                // 如果不是物件或數組，直接打印值
                printFunction(`${text}${objOrArray}`);
            }
        }
        catch (error) {
            throw new UFLib_UnityBasic.FunError("error", { cause: error });
        }
    }
    /**
     * 數值限制
     * @param value 輸入值
     * @param min 最小值
     * @param max 最大值
     * @returns 限縮後的值
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}
