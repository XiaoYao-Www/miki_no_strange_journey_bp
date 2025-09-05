import { BlockPermutation, ItemStack, system, world } from "@minecraft/server";
import { UFLib } from "../lib/uflib/uflib_core.js";
/**
 * 砧板系統
 */
world.beforeEvents.playerInteractWithBlock.subscribe(signal => {
    if (signal.isFirstEvent) {
        if (signal.block.typeId == "miki:chopping_board") {
            // 取得方塊狀態與物品
            if (signal.itemStack === undefined)
                return;
            const allStates = signal.block.permutation.getAllStates();
            // 依物品判斷執行動作
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
                case "miki:raw_bison_meat":
                    // 生野牛肉
                    if (allStates["chopping_board:item"] == 0) {
                        allStates["chopping_board:item"] = 2;
                        system.run(() => {
                            signal.block.setPermutation(BlockPermutation.resolve("miki:chopping_board", allStates));
                            signal.player.runCommand("clear @s miki:raw_bison_meat -1 1");
                        });
                    }
                    break;
                case "miki:cooked_bison_meat":
                    // 烤野牛肉
                    if (allStates["chopping_board:item"] == 0) {
                        allStates["chopping_board:item"] = 3;
                        system.run(() => {
                            signal.block.setPermutation(BlockPermutation.resolve("miki:chopping_board", allStates));
                            signal.player.runCommand("clear @s miki:cooked_bison_meat -1 1");
                        });
                    }
                    break;
                case "miki:kitchen_knife":
                    // 菜刀
                    let used = false;
                    // 依砧板狀態切換行為
                    switch (allStates["chopping_board:item"]) {
                        case 1:
                            // 有河豚
                            system.run(() => {
                                world.getDimension(signal.player.dimension.id).spawnItem(new ItemStack("miki:clean_pufferfish"), signal.block.location);
                            });
                            used = true;
                            break;
                        case 2:
                            // 有生野牛肉
                            system.run(() => {
                                world.getDimension(signal.player.dimension.id).spawnItem(new ItemStack("miki:raw_bison_slice", 2), signal.block.location);
                            });
                            used = true;
                            break;
                        case 3:
                            // 有烤野牛肉
                            system.run(() => {
                                world.getDimension(signal.player.dimension.id).spawnItem(new ItemStack("miki:cooked_bison_slice", 3), signal.block.location);
                            });
                            used = true;
                            break;
                        default:
                            break;
                    }
                    // 有使用的話，扣耐久，恢復砧板狀態
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
