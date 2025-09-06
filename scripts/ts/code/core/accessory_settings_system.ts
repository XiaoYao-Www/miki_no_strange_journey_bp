/**
 * 飾品系統
 */
import { Container, ContainerSlot, DimensionTypes, EntityComponentTypes, ItemStack, system, Vector3, world } from "@minecraft/server";
import { PlayerInterval } from "../lib/player_interval.js";
import { UFLib } from "../lib/uflib/uflib_core.js";
import { getPlayerDataStore } from "../lib/data_store.js";


/**
 * 設定
 */
const MaintainInterval_m = 10;

/**
 * 將物品欄物品丟出
 * @param slot 欄位
 * @param dimension 維度
 * @param location 位置
 */
function dropItem(slot: ContainerSlot, dimension: string, location: Vector3): void{
    if(slot.hasItem()){
        world.getDimension(dimension).spawnItem(slot.getItem() as ItemStack, location);
        slot.setItem();
    }
}

/**
 * 物品容器邏輯
 */
PlayerInterval.subscribe(player => {
    const playerData = getPlayerDataStore(player.id);
    // 不是鑲嵌設定物品
    if (!(UFLib.Player.getMainHand(player)?.typeId == "miki:accessory_settings")){
        if(playerData.accessory_settings_table !== undefined){
            // 移除容器
            world.getEntity(playerData.accessory_settings_table)?.remove();
            playerData.accessory_settings_table = undefined;
        }
        return;
    }
    // 鑲嵌設定物品
    if(playerData.accessory_settings_table === undefined){
        // 創建容器
        const table = player.dimension.spawnEntity("miki:accessory_settings_table", player.getHeadLocation());
        table.nameTag = "miki:accessory_settings_table";
        // 取得容器組件
        const inventoryContainer: Container | undefined = table.getComponent(EntityComponentTypes.Inventory)?.container;
        if(inventoryContainer === undefined){
            // 無容器組件時，移除容器
            table.remove();
            return;
        }
        // 欄位取得
        const necklaceSlot = inventoryContainer.getSlot(0);
        const ringSlot = inventoryContainer.getSlot(1);
        const beltSlot = inventoryContainer.getSlot(2);
        const braceletSlot = inventoryContainer.getSlot(3);
        const amuletSlot = inventoryContainer.getSlot(4);
        const specialSlot = inventoryContainer.getSlot(5);
        const relicSlot = inventoryContainer.getSlot(6);
        // 寫入物品
        necklaceSlot.setItem(player.getDynamicProperty("miki:necklace_slot") ? new ItemStack(player.getDynamicProperty("miki:necklace_slot") as string) : undefined);
        ringSlot.setItem(player.getDynamicProperty("miki:ring_slot") ? new ItemStack(player.getDynamicProperty("miki:ring_slot") as string) : undefined);
        beltSlot.setItem(player.getDynamicProperty("miki:belt_slot") ? new ItemStack(player.getDynamicProperty("miki:belt_slot") as string) : undefined);
        braceletSlot.setItem(player.getDynamicProperty("miki:bracelet_slot") ? new ItemStack(player.getDynamicProperty("miki:bracelet_slot") as string) : undefined);
        amuletSlot.setItem(player.getDynamicProperty("miki:amulet_slot") ? new ItemStack(player.getDynamicProperty("miki:amulet_slot") as string) : undefined);
        specialSlot.setItem(player.getDynamicProperty("miki:special_slot") ? new ItemStack(player.getDynamicProperty("miki:special_slot") as string) : undefined);
        relicSlot.setItem(player.getDynamicProperty("miki:relic_slot") ? new ItemStack(player.getDynamicProperty("miki:relic_slot") as string) : undefined);
        // 容器綁定
        playerData.accessory_settings_table = table.id;
    }else{
        const table = world.getEntity(playerData.accessory_settings_table);
        if((table === undefined) || !table.isValid){
            // 讀不到實體時，移除容器
            table?.remove(); // 確保移除
            playerData.accessory_settings_table = undefined;
            return;
        }
        // 常駐運作邏輯
        table.teleport(player.getHeadLocation());
        //// 容器組件檢查
        const inventoryContainer: Container | undefined = table.getComponent(EntityComponentTypes.Inventory)?.container;
        if(inventoryContainer === undefined){
            // 無容器組件時，移除容器
            table.remove();
            playerData.accessory_settings_table = undefined;
            return;
        }
        //// 欄位取得
        const necklaceSlot = inventoryContainer.getSlot(0);
        const ringSlot = inventoryContainer.getSlot(1);
        const beltSlot = inventoryContainer.getSlot(2);
        const braceletSlot = inventoryContainer.getSlot(3);
        const amuletSlot = inventoryContainer.getSlot(4);
        const specialSlot = inventoryContainer.getSlot(5);
        const relicSlot = inventoryContainer.getSlot(6);
        //// 欄位檢查
        if (necklaceSlot.hasItem() && !necklaceSlot.hasTag("miki:accessory_necklace")) dropItem(necklaceSlot, player.dimension.id, player.location);
        if (ringSlot.hasItem() && !ringSlot.hasTag("miki:accessory_ring")) dropItem(ringSlot, player.dimension.id, player.location);
        if (beltSlot.hasItem() && !beltSlot.hasTag("miki:accessory_belt")) dropItem(beltSlot, player.dimension.id, player.location);
        if (braceletSlot.hasItem() && !braceletSlot.hasTag("miki:accessory_bracelet")) dropItem(braceletSlot, player.dimension.id, player.location);
        if (amuletSlot.hasItem() && !amuletSlot.hasTag("miki:accessory_amulet")) dropItem(amuletSlot, player.dimension.id, player.location);
        if (specialSlot.hasItem() && !specialSlot.hasTag("miki:accessory_special")) dropItem(specialSlot, player.dimension.id, player.location);
        if (relicSlot.hasItem() && !relicSlot.hasTag("miki:accessory_relic")) dropItem(relicSlot, player.dimension.id, player.location);
        //// 取得物品
        const necklaceItem = necklaceSlot.getItem();
        const ringItem = ringSlot.getItem();
        const beltItem = beltSlot.getItem();
        const braceletItem = braceletSlot.getItem();
        const amuletItem = amuletSlot.getItem();
        const specialItem = specialSlot.getItem();
        const relicItem = relicSlot.getItem();
        //// 寫入玩家資訊
        player.setDynamicProperty("miki:necklace_slot", necklaceItem?.typeId);
        player.setDynamicProperty("miki:ring_slot", ringItem?.typeId);
        player.setDynamicProperty("miki:belt_slot", beltItem?.typeId);
        player.setDynamicProperty("miki:bracelet_slot", braceletItem?.typeId);
        player.setDynamicProperty("miki:amulet_slot", amuletItem?.typeId);
        player.setDynamicProperty("miki:special_slot", specialItem?.typeId);
        player.setDynamicProperty("miki:relic_slot", relicItem?.typeId);
        //// 同步到玩家暫存資料
        playerData.accessory_slot.necklace_slot = necklaceItem?.typeId;
        playerData.accessory_slot.ring_slot = ringItem?.typeId;
        playerData.accessory_slot.belt_slot = beltItem?.typeId;
        playerData.accessory_slot.bracelet_slot = braceletItem?.typeId;
        playerData.accessory_slot.amulet_slot = amuletItem?.typeId;
        playerData.accessory_slot.special_slot = specialItem?.typeId;
        playerData.accessory_slot.relic_slot = relicItem?.typeId;
    }
});

/**
 * 維護系統
 */
system.runInterval(() => {
    /*
        殘留容器清除
    */
    // 取得所有使用中容器列表
    const UseList: string[] = [];
    world.getAllPlayers().forEach(player => {
        const playerData = getPlayerDataStore(player.id);
        if(playerData.accessory_settings_table !== undefined) UseList.push(playerData.accessory_settings_table);
    });
    // 清除未使用容器
    DimensionTypes.getAll().forEach(dimensionType => {
        world.getDimension(dimensionType.typeId).getEntities({ type: "miki:accessory_settings_table" }).forEach(table => {
            if(!UseList.includes(table.id)) table.remove();
        });
    });
    /*
        玩家暫存資料校正
    */
    world.getAllPlayers().forEach(player => {
        const playerData = getPlayerDataStore(player.id);
        // 飾品欄位校正
        if(playerData.accessory_slot.necklace_slot !== player.getDynamicProperty("miki:necklace_slot")){
            playerData.accessory_slot.necklace_slot = player.getDynamicProperty("miki:necklace_slot") as string | undefined;
        }
        if(playerData.accessory_slot.ring_slot !== player.getDynamicProperty("miki:ring_slot")){
            playerData.accessory_slot.ring_slot = player.getDynamicProperty("miki:ring_slot") as string | undefined;
        }
        if(playerData.accessory_slot.belt_slot !== player.getDynamicProperty("miki:belt_slot")){
            playerData.accessory_slot.belt_slot = player.getDynamicProperty("miki:belt_slot") as string | undefined;
        }
        if(playerData.accessory_slot.bracelet_slot !== player.getDynamicProperty("miki:bracelet_slot")){
            playerData.accessory_slot.bracelet_slot = player.getDynamicProperty("miki:bracelet_slot") as string | undefined;
        }
        if(playerData.accessory_slot.amulet_slot !== player.getDynamicProperty("miki:amulet_slot")){
            playerData.accessory_slot.amulet_slot = player.getDynamicProperty("miki:amulet_slot") as string | undefined;
        }
        if(playerData.accessory_slot.special_slot !== player.getDynamicProperty("miki:special_slot")){
            playerData.accessory_slot.special_slot = player.getDynamicProperty("miki:special_slot") as string | undefined;
        }
        if(playerData.accessory_slot.relic_slot !== player.getDynamicProperty("miki:relic_slot")){
            playerData.accessory_slot.relic_slot = player.getDynamicProperty("miki:relic_slot") as string | undefined;
        }
    });
}, MaintainInterval_m * 1200);