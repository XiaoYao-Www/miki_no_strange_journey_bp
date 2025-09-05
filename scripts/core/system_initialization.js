import { DimensionTypes, system, world } from "@minecraft/server";
system.beforeEvents.startup.subscribe(signal => {
    // 註冊自訂組件
    // signal.blockComponentRegistry.registerCustomComponent("miki:inlay_workbench_place", {
    //     onPlace(e){
    //         let entity = e.dimension.spawnEntity("miki:inlay_workbench_table", UFLib.Vector3.sum(e.block.location, {x: 0.5, y: 1.1, z: 0.5}));
    //         entity.nameTag = "miki:inlay_workbench_table";
    //     }
    // });
});
world.afterEvents.worldLoad.subscribe(signal => {
    // 清除錯誤滯留實體
    system.runTimeout(() => {
        DimensionTypes.getAll().forEach(dimensionType => {
            // 飾品容器
            world.getDimension(dimensionType.typeId).getEntities({ type: "miki:accessory_settings_table" }).forEach(accessorySettingsTable => {
                accessorySettingsTable.remove();
            });
        });
    }, 100);
});
