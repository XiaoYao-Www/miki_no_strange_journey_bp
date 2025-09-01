/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/
/**
 * 向量3函式庫
 */
export class UFLib_Vector3 {
    /**
     * 錯誤輸出
     */
    static FunError = class extends Error {
        constructor(message, options) {
            super(message, options);
            this.name = 'UFLib-Vector3';
        }
    };
    /**
     * 創建一個3維向量
     * @param param0 向量3維值
     * @returns 3維向量
     */
    static new({ x = 0, y = 0, z = 0 }) {
        return { x: x, y: y, z: z };
    }
    /**
     * 陣列壘加
     * @param vector3s 向量陣列
     * @returns 累加結果
     */
    static sumAll(vector3s) {
        try {
            let newVector3 = { x: 0, y: 0, z: 0 };
            vector3s.forEach((vector3) => {
                newVector3.x += vector3.x;
                newVector3.y += vector3.y;
                newVector3.z += vector3.z;
            });
            return newVector3;
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
    /**
     * 相加
     * @param vector3fir 向量A
     * @param vector3sec 向量B
     * @returns 輸出
     */
    static sum(vector3fir, vector3sec) {
        try {
            return { x: vector3fir.x + vector3sec.x, y: vector3fir.y + vector3sec.y, z: vector3fir.z + vector3sec.z };
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
    /**
     * 相減
     * @param vector3fir 輸入向量A
     * @param vector3sec 輸入向量B
     * @returns 輸出
     */
    static reduce(vector3fir, vector3sec) {
        try {
            return { x: vector3fir.x - vector3sec.x, y: vector3fir.y - vector3sec.y, z: vector3fir.z - vector3sec.z };
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
    /**
     * 倍率乘法
     * @param vector3 輸入向量
     * @param mag 倍率
     * @returns 輸出
     */
    static mul(vector3, mag) {
        try {
            return { x: vector3.x * mag, y: vector3.y * mag, z: vector3.z * mag };
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
    /**
     * 倍率除法
     * @param vector3 輸入向量
     * @param divisor 除值
     * @returns 輸出
     */
    static div(vector3, divisor) {
        try {
            return { x: vector3.x / divisor, y: vector3.y / divisor, z: vector3.z / divisor };
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
    /**
     * 向量轉旋轉量
     * @param vector 輸入向量
     * @returns 旋轉量
    */
    static toRotation(vector) {
        try {
            const { x, y, z } = vector;
            // XZ 平面投影量
            let rotationYDegrees = Math.atan2(x, z) * (180 / Math.PI) * -1;
            // YZ 平面投影量
            const hypotenuse = Math.sqrt(x * x + z * z);
            let rotationXDegrees = Math.atan2(y, hypotenuse) * (180 / Math.PI) * -1;
            return { x: rotationXDegrees, y: rotationYDegrees };
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
    /**
     * 單位化
     * @param vector 輸入向量
     * @returns 單位化向量
     */
    static normalize(vector) {
        try {
            const { x, y, z } = vector;
            // 長度
            const length = Math.sqrt(x * x + y * y + z * z);
            // 長度為0
            if (length === 0) {
                return { x: 0, y: 0, z: 0 };
            }
            return {
                x: x / length,
                y: y / length,
                z: z / length
            };
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
    /**
     * 取得長度
     * @param vector 輸入向量
     * @returns 長度
     */
    static length(vector) {
        try {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
    /**
     * 計算兩個向量的距離
     * @param vectorA 向量A
     * @param vectorB 向量B
     * @returns 距離
     */
    static calculateDistance(vectorA, vectorB) {
        try {
            const reduce = UFLib_Vector3.reduce(vectorA, vectorB);
            return UFLib_Vector3.length(reduce);
        }
        catch (error) {
            throw new UFLib_Vector3.FunError("error", { cause: error });
        }
    }
}
