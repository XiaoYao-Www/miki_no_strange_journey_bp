import { BlockPermutation, ItemStack, system, world } from "@minecraft/server";
import { UFLib } from "../lib/uflib/uflib_core.js";
world.beforeEvents.playerInteractWithBlock.subscribe(signal => {
    if (signal.isFirstEvent) {
        if (signal.block.typeId == "miki:chopping_board") {
            // 砧板
            if (signal.itemStack === undefined)
                return;
            const allStates = signal.block.permutation.getAllStates();
            switch (signal.itemStack.typeId) {
                case "minecraft:pufferfish":
                    // 河豚
                    if (allStates["chopping_board:item"] == 0) {
                        allStates["chopping_board:item"] = 1;
                        system.run(() => {
                            signal.block.setPermutation(BlockPermutation.resolve("miki:chopping_board", allStates));
                            signal.player.runCommand("clear @s minecraft:pufferfish -1 1");
                        });
                    }
                    break;
                case "miki:kitchen_knife":
                    // 菜刀
                    let used = false;
                    switch (allStates["chopping_board:item"]) {
                        case 1:
                            system.run(() => {
                                world.getDimension(signal.player.dimension.id).spawnItem(new ItemStack("miki:clean_pufferfish"), signal.block.location);
                            });
                            used = true;
                            break;
                        default:
                            break;
                    }
                    if (used) {
                        allStates["chopping_board:item"] = 0;
                        system.run(() => {
                            signal.block.setPermutation(BlockPermutation.resolve("miki:chopping_board", allStates));
                            UFLib.Player.setMainHand(signal.player, UFLib.Item.changeDurability(signal.itemStack, -1));
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }
});
