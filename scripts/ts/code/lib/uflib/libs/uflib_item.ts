/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/

import { ItemStack, ItemComponentTypes, ItemDurabilityComponent, ItemEnchantableComponent, ItemLockMode, Enchantment, EnchantmentType, ItemDyeableComponent } from "@minecraft/server";
import { DynamicPropertyData, EnchantmentData } from "../classes/uflib_unity_class.js";
import { ItemStackData } from "../classes/uflib_item_class.js";

/**
 * 物品函式庫
 */
export class UFLib_Item {
    /**
     * 錯誤輸出
     */
    protected static FunError = class extends Error {
        constructor(message?: string, options?: { cause?: unknown }) {
            super(message, options);
            this.name = 'GFLib-Item';
        }
    };

    /**
     * 將 MC 物品堆資料
     * 轉換成可儲存的純資料類型
     * 
     * @param itemStack 物品堆
     * @returns 
     */
    static getItemStackData(itemStack: ItemStack): ItemStackData {
        try {
            // 取得基本必須資料
            let data: ItemStackData = {
                amount: itemStack.amount,
                keepOnDeath: itemStack.keepOnDeath,
                lockMode: itemStack.lockMode,
                typeId: itemStack.typeId,
                canDestroy: itemStack.getCanDestroy(),
                canPlaceOn: itemStack.getCanPlaceOn(),
                lore: itemStack.getLore(),
                // 可選資料
                nameTag: itemStack.nameTag,
            };
            // 取得耐久
            if (itemStack.hasComponent(ItemComponentTypes.Durability)) {
                const durabilityCom = itemStack.getComponent(ItemComponentTypes.Durability);
                data.durabilityDamage = durabilityCom?.damage;
            }
            // 取得附魔
            if (itemStack.hasComponent(ItemComponentTypes.Enchantable)) {
                const enchantableCom = itemStack.getComponent(ItemComponentTypes.Enchantable);
                data.enchantments = [];
                enchantableCom?.getEnchantments().forEach((ench: Enchantment) => {
                    data.enchantments?.push({
                        id: ench.type.id,
                        lvl: ench.level,
                    });
                });
            }
            // 取得動態資料
            const dpIdList = itemStack.getDynamicPropertyIds();
            if (dpIdList.length > 0) {
                data.dynamicPropertys = [];
                dpIdList.forEach((id) => {
                    data.dynamicPropertys?.push({
                        id: id,
                        value: itemStack.getDynamicProperty(id),
                    });
                });
            }
            // 取得顏色
            if(itemStack.hasComponent(ItemComponentTypes.Dyeable)){
                const dyeableCom = itemStack.getComponent(ItemComponentTypes.Dyeable);
                data.color = dyeableCom?.color;
            }
            
            // 回傳
            return data;
        } catch (error: any) {
            throw new UFLib_Item.FunError("error", { cause: error });
        }
    }

    /**
     * 將物品純資料轉成物品堆疊
     * @param itemStackData 物品純資料
     * @returns 物品堆疊
     */
    static data2ItemStack(itemStackData: ItemStackData): ItemStack {
        /*
            將物品純資料轉成物品堆疊
        */
        try {
            // 創建基本物品
            let itemStack = new ItemStack(itemStackData.typeId, itemStackData.amount);
            // 設定必須資料
            itemStack.keepOnDeath = itemStackData.keepOnDeath;
            itemStack.lockMode = itemStackData.lockMode;
            itemStack.setCanDestroy(itemStackData.canDestroy);
            itemStack.setCanPlaceOn(itemStackData.canPlaceOn);
            itemStack.setLore(itemStackData.lore);
            // 設定名稱
            if (itemStackData.nameTag) itemStack.nameTag = itemStackData.nameTag;
            // 設定耐久
            if (itemStackData.durabilityDamage && itemStack.hasComponent(ItemComponentTypes.Durability)) {
                const durabilityCom = itemStack.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent;
                durabilityCom.damage = itemStackData.durabilityDamage;
            }
            // 設定附魔
            if (itemStackData.enchantments?.length && itemStack.hasComponent(ItemComponentTypes.Enchantable)) {
                const enchantableCom = itemStack.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent;
                itemStackData.enchantments.forEach((enchData: EnchantmentData) => {
                    const ench: Enchantment = {
                        type: new EnchantmentType(enchData.id),
                        level: enchData.lvl
                    };
                    if (enchantableCom.canAddEnchantment(ench)) enchantableCom.addEnchantment(ench);
                });
            }
            // 設定動態屬性
            if (itemStackData.dynamicPropertys?.length) itemStackData.dynamicPropertys.forEach((DPD: DynamicPropertyData) => {
                itemStack.setDynamicProperty(DPD.id, DPD.value);
            });
            // 設定顏色
            if (itemStackData.color && itemStack.hasComponent(ItemComponentTypes.Dyeable)){
                const dyeableCom = itemStack.getComponent(ItemComponentTypes.Dyeable) as ItemDyeableComponent;
                dyeableCom.color = itemStackData.color;
            }
            // 回傳
            return itemStack;
        } catch (error: any) {
            throw new UFLib_Item.FunError("error", { cause: error });
        }
    }
}