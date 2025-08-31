/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/

import { Entity, ScoreboardIdentity, Vector3 } from "@minecraft/server";

/**
 * 動態資料類型定義
 */
export interface DynamicPropertyData {
    id: string;
    value: string | number | boolean | Vector3 | undefined;
}

/**
 * 附魔資料類型定義
 */
export interface EnchantmentData {
    id: string;
    lvl: number;
}

/**
 * 計分板目標類型定義
 */
export type ScoreboardTarget = string | Entity | ScoreboardIdentity;