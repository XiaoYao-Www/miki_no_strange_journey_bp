/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/23
*/

// 函式庫
import { UFLib_Entity } from "./libs/uflib_entity.js";
import { UFLib_Player } from "./libs/uflib_player.js";
import { UFLib_Game } from "./libs/uflib_game.js";
import { UFLib_UnityBasic } from "./libs/uflib_unity_basic.js";
import { UFLib_Vector3 } from "./libs/uflib_vector3.js";
import { UFLib_Scoreboard } from "./libs/uflib_scoreboard.js";
import { UFLib_Item } from "./libs/uflib_item.js";
import { UFLib_Form } from "./libs/uflib_form.js";
// 事件
import { UFLib_HandChangeEvent } from "./events/uflib_hand_change_event.js";
// 類型
import * as uflib_form_class from "./classes/uflib_form_class.js";
import * as uflib_item_class from "./classes/uflib_item_class.js";
import * as uflib_unity_class from "./classes/uflib_unity_class.js";

export namespace UFLib {
    export const Version = "0.1.0";
    // 函式
    export const UnityBasic = UFLib_UnityBasic;
    export const Entity = UFLib_Entity;
    export const Player = UFLib_Player;
    export const Game = UFLib_Game;
    export const Vector3 = UFLib_Vector3;
    export const Scoreboard = UFLib_Scoreboard;
    export const Item = UFLib_Item;
    export const Form = UFLib_Form;
    // 事件
    export namespace Event {
        export const HandChange = UFLib_HandChangeEvent;
    };
    // 類型
    export namespace Type {
        export namespace Form {
            export type FormStructure = uflib_form_class.FormStructure;
            export const FormStructureType = uflib_form_class.FormStructureType;
            export const FormWidgetType = uflib_form_class.FormWidgetType;
            export interface ButtonStructure extends uflib_form_class.ButtonStructure { };
            export interface DropdownStructure extends uflib_form_class.DropdownStructure { };
            export interface SliderStructure extends uflib_form_class.SliderStructure { };
            export interface TextFieldStructure extends uflib_form_class.TextFieldStructure { };
            export interface ToggleStructure extends uflib_form_class.ToggleStructure { };
            export interface DividerStructure extends uflib_form_class.DividerStructure { };
            export interface HeaderStructure extends uflib_form_class.HeaderStructure { };
            export interface LabelStructure extends uflib_form_class.LabelStructure { };
            export interface ActionFormStructure extends uflib_form_class.ActionFormStructure { };
            export interface ModalFormStructure extends uflib_form_class.ModalFormStructure { };
            export interface MessageFormStructure extends uflib_form_class.MessageFormStructure { };
            export interface FormStructureGenerate<T> extends uflib_form_class.FormStructureGenerate<T> { };
        };
        export namespace Item {
            export interface ItemStackData extends uflib_item_class.ItemStackData {};
        };
        export namespace Unity {
            export interface DynamicPropertyData extends uflib_unity_class.DynamicPropertyData {};
            export interface EnchantmentData extends uflib_unity_class.EnchantmentData {};
            export type ScoreboardTarget = uflib_unity_class.ScoreboardTarget;
        };
    };
}