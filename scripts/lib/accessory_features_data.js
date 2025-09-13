/**
 * 飾品能力定義
 */
import { TicksPerSecond } from "@minecraft/server";
import { UFLib } from "./uflib/uflib_core.js";
export const AccessoryFeaturesData = {
    "miki:wind_feather": {
        afterHitEntity(player, target, damageValue, cause) {
            player.addEffect("minecraft:speed", TicksPerSecond * 1, { amplifier: 4, showParticles: false });
        },
    },
    "miki:ring_of_swiftness": {
        speed: 1,
    },
    "miki:guardian_bracelet": {
        health: 2,
        afterHurt(player, damageValue, cause, attacker) {
            player.addEffect("minecraft:resistance", TicksPerSecond, { amplifier: 0, showParticles: false });
        },
    },
    "miki:blood_necklace": {
        afterKillEntity(player, target, cause) {
            UFLib.Player.changeHealth(player, 2);
        },
    },
    "miki:warcry_belt": {
        strength: 1,
        health: 2,
    },
    "miki:gold_inlaid_nether_core": {
        periodicEffects: [
            {
                type: "vanilla",
                name: "minecraft:absorption",
                amplifier: 0,
                duration: TicksPerSecond * 5,
                interval: TicksPerSecond * 15
            }
        ]
    },
    "miki:relic_of_eternal_night": {}
};
