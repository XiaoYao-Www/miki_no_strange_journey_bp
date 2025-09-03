import { system } from "@minecraft/server";
import { UFLib } from "../lib/uflib/uflib_core.js";


system.beforeEvents.startup.subscribe(signal => {
    // 註冊自訂組件
    signal.blockComponentRegistry.registerCustomComponent("miki:inlay_workbench_place", {
        onPlace(e){
            let entity = e.dimension.spawnEntity("miki:inlay_workbench_table", UFLib.Vector3.sum(e.block.location, {x: 0.5, y: 1.1, z: 0.5}));
            entity.nameTag = "miki:inlay_workbench_table";
        }
    })
});