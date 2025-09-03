import { DimensionTypes, EntityComponentTypes, ItemStack, system, world } from "@minecraft/server";
import { UFLib } from "../lib/uflib/uflib_core.js";
import { CanInlayItem, SocketableItem } from "../config.js";
/**
 * 待優化
 */
// 前次物品緩存
const lastItemMap = new Map();
function dropSlot(slot, dimension, location) {
    if (slot.hasItem()) {
        world.getDimension(dimension).spawnItem(slot.getItem(), location);
        slot.setItem();
    }
}
function checkSame(item0, item1) {
    if (item0 === undefined || item1 === undefined)
        return (item0 === undefined && item1 == undefined);
    else
        return UFLib.UnityBasic.deepEqual(UFLib.Item.getItemStackData(item0), UFLib.Item.getItemStackData(item1));
}
system.runInterval(() => {
    DimensionTypes.getAll().forEach(dimensionType => {
        // 鑲嵌工作台
        world.getDimension(dimensionType.typeId).getEntities({ type: "miki:inlay_workbench_table" }).forEach(inlayWorkbenchTable => {
            if (!inlayWorkbenchTable.isValid)
                return;
            // 確保工作台存在
            const locationBlock = world.getDimension(dimensionType.typeId).getBlock(UFLib.Vector3.sum(inlayWorkbenchTable.location, { x: 0, y: -0.5, z: 0 }));
            const inventoryContainer = inlayWorkbenchTable.getComponent(EntityComponentTypes.Inventory)?.container;
            if (locationBlock?.typeId != "miki:inlay_workbench") {
                if (inventoryContainer !== undefined) {
                    dropSlot(inventoryContainer.getSlot(0), inlayWorkbenchTable.dimension.id, inlayWorkbenchTable.location);
                }
                inlayWorkbenchTable.remove();
                lastItemMap.delete(inlayWorkbenchTable.id);
                return;
            }
            // 容器組件檢查
            if (inventoryContainer === undefined) {
                inlayWorkbenchTable.setDynamicProperty("using");
                return;
            }
            // 欄位抓取
            const weaponSlot = inventoryContainer.getSlot(0);
            const socketHole0 = inventoryContainer.getSlot(1);
            const socketHole1 = inventoryContainer.getSlot(2);
            const socketHole2 = inventoryContainer.getSlot(3);
            // 切換檢查
            const weapon = weaponSlot.getItem();
            if (!checkSame(lastItemMap.get(inlayWorkbenchTable.id), weapon)) {
                if (weapon === undefined || !(CanInlayItem.includes(weapon.typeId))) {
                    // 不可鑲嵌
                    for (let j = 1; j < 4; j++)
                        inventoryContainer.setItem(j);
                    inlayWorkbenchTable.setDynamicProperty("using");
                }
                else {
                    // 可鑲嵌
                    if (weapon.getDynamicProperty("socket_hole_0") !== undefined)
                        socketHole0.setItem(new ItemStack(weapon.getDynamicProperty("socket_hole_0")));
                    else
                        socketHole0.setItem();
                    if (weapon.getDynamicProperty("socket_hole_1") !== undefined)
                        socketHole1.setItem(new ItemStack(weapon.getDynamicProperty("socket_hole_1")));
                    else
                        socketHole1.setItem();
                    if (weapon.getDynamicProperty("socket_hole_2") !== undefined)
                        socketHole2.setItem(new ItemStack(weapon.getDynamicProperty("socket_hole_2")));
                    else
                        socketHole2.setItem();
                    inlayWorkbenchTable.setDynamicProperty("using", true);
                }
                lastItemMap.set(inlayWorkbenchTable.id, weapon);
                return;
            }
            // 行為處理
            if (inlayWorkbenchTable.getDynamicProperty("using") !== undefined) {
                if (weapon === undefined)
                    return inlayWorkbenchTable.setDynamicProperty("using");
                // 使用中
                let holeItem0 = socketHole0.getItem();
                let holeItem1 = socketHole1.getItem();
                let holeItem2 = socketHole2.getItem();
                // 物品檢查
                if (holeItem0 !== undefined && !(SocketableItem.includes(holeItem0.typeId))) {
                    dropSlot(socketHole0, inlayWorkbenchTable.dimension.id, inlayWorkbenchTable.location);
                    holeItem0 = undefined;
                }
                if (holeItem1 !== undefined && !(SocketableItem.includes(holeItem1.typeId))) {
                    dropSlot(socketHole1, inlayWorkbenchTable.dimension.id, inlayWorkbenchTable.location);
                    holeItem1 = undefined;
                }
                if (holeItem2 !== undefined && !(SocketableItem.includes(holeItem2.typeId))) {
                    dropSlot(socketHole2, inlayWorkbenchTable.dimension.id, inlayWorkbenchTable.location);
                    holeItem2 = undefined;
                }
                // 寫入
                if ((weapon.getDynamicProperty("socket_hole_0") != holeItem0?.typeId) ||
                    (weapon.getDynamicProperty("socket_hole_1") != holeItem1?.typeId) ||
                    (weapon.getDynamicProperty("socket_hole_2") != holeItem2?.typeId)) {
                    weapon.setDynamicProperty("socket_hole_0", holeItem0?.typeId);
                    weapon.setDynamicProperty("socket_hole_1", holeItem1?.typeId);
                    weapon.setDynamicProperty("socket_hole_2", holeItem2?.typeId);
                    weaponSlot.setItem(weapon);
                    lastItemMap.set(inlayWorkbenchTable.id, weapon);
                }
            }
            else {
                // 非使用中
                dropSlot(socketHole0, inlayWorkbenchTable.dimension.id, inlayWorkbenchTable.location);
                dropSlot(socketHole1, inlayWorkbenchTable.dimension.id, inlayWorkbenchTable.location);
                dropSlot(socketHole2, inlayWorkbenchTable.dimension.id, inlayWorkbenchTable.location);
            }
        });
    });
});
