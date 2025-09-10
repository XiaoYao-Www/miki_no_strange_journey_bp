/**
 * 飾品能力定義
 */
import { TicksPerSecond } from "@minecraft/server";
import { AccessoryFeatures } from "../types/accessory_type.js";


export const AccessoryFeaturesData: {[key: string]: AccessoryFeatures} = {
    "miki:wind_feather": {
        afterHitEntity(player, target, damageValue, cause) {
            player.addEffect("minecraft:speed", TicksPerSecond * 1, {amplifier: 4, showParticles: false});
        },
    },
    "miki:ring_of_swiftness": {
        speed: 1,
    }
}