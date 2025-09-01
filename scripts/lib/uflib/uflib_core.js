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
export var UFLib;
(function (UFLib) {
    UFLib.Version = "0.1.0";
    // 函式
    UFLib.UnityBasic = UFLib_UnityBasic;
    UFLib.Entity = UFLib_Entity;
    UFLib.Player = UFLib_Player;
    UFLib.Game = UFLib_Game;
    UFLib.Vector3 = UFLib_Vector3;
    UFLib.Scoreboard = UFLib_Scoreboard;
    UFLib.Item = UFLib_Item;
    UFLib.Form = UFLib_Form;
    // 事件
    let Event;
    (function (Event) {
        Event.HandChange = UFLib_HandChangeEvent;
    })(Event = UFLib.Event || (UFLib.Event = {}));
    ;
    // 類型
    let Type;
    (function (Type) {
        let Form;
        (function (Form) {
            Form.FormStructureType = uflib_form_class.FormStructureType;
            Form.FormWidgetType = uflib_form_class.FormWidgetType;
            ;
            ;
            ;
            ;
            ;
            ;
            ;
            ;
            ;
            ;
            ;
            ;
        })(Form = Type.Form || (Type.Form = {}));
        ;
        let Item;
        (function (Item) {
            ;
        })(Item = Type.Item || (Type.Item = {}));
        ;
        let Unity;
        (function (Unity) {
            ;
            ;
        })(Unity = Type.Unity || (Type.Unity = {}));
        ;
    })(Type = UFLib.Type || (UFLib.Type = {}));
    ;
})(UFLib || (UFLib = {}));
