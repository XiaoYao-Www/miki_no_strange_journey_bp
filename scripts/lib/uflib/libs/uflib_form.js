/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/
import { FormStructureType, FormWidgetType } from "../classes/uflib_form_class.js";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
/**
 * 表單函式庫
 */
export class UFLib_Form {
    /**
     * 錯誤輸出
     */
    static FunError = class extends Error {
        constructor(message, options) {
            super(message, options);
            this.name = 'UFLib-Form';
        }
    };
    /**
     * 玩家路徑紀錄
     */
    static _playerFormStacks = new Map();
    /**
     * 顯示表單
     * @param player 玩家
     * @param formStructure 表單結構
     */
    static show(player, formStructure) {
        try {
            // 處理生成器
            if (formStructure.type == FormStructureType.generate) {
                formStructure = formStructure.generateFunction(formStructure.parameter);
            }
            // 表單顯示
            switch (formStructure.type) {
                case FormStructureType.action:
                    this.showActionForm(player, formStructure);
                    break;
                case FormStructureType.modal:
                    this.showModalForm(player, formStructure);
                    break;
                case FormStructureType.message:
                    this.showMessageForm(player, formStructure);
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            throw new UFLib_Form.FunError("error", { cause: error });
        }
    }
    /**
     * 用路徑模式顯示表單
     * @param player 玩家
     * @param formStructure 表單結構
     */
    static open(player, formStructure) {
        try {
            const playerFormStack = this._playerFormStacks.get(player.id) ?? [];
            playerFormStack.push(formStructure);
            this._playerFormStacks.set(player.id, playerFormStack);
            this.show(player, formStructure);
        }
        catch (error) {
            throw new UFLib_Form.FunError("error", { cause: error });
        }
    }
    /**
     * 顯示表單，並取代當前路徑
     * @param player 玩家
     * @param formStructure 表單結構
     */
    static replace(player, formStructure) {
        try {
            const playerFormStack = this._playerFormStacks.get(player.id) ?? [];
            if (playerFormStack.length > 0)
                playerFormStack.pop();
            playerFormStack.push(formStructure);
            this._playerFormStacks.set(player.id, playerFormStack);
            this.show(player, formStructure);
        }
        catch (error) {
            throw new UFLib_Form.FunError("error", { cause: error });
        }
    }
    /**
     * 開啟上一路徑的表單
     * @param player 玩家
     * @param count 回退層數
     */
    static back(player, count = 1) {
        try {
            if (count < 1)
                return;
            const playerFormStack = this._playerFormStacks.get(player.id) ?? [];
            if (playerFormStack.length > count) {
                for (let i = 0; i < count; i++)
                    playerFormStack.pop();
                this._playerFormStacks.set(player.id, playerFormStack);
                this.show(player, playerFormStack[playerFormStack.length - 1]);
            }
            else {
                this.clearStack(player);
            }
        }
        catch (error) {
            throw new UFLib_Form.FunError("error", { cause: error });
        }
    }
    /**
     * 清除玩家路徑紀錄
     * @param player 玩家
     */
    static clearStack(player) {
        try {
            this._playerFormStacks.set(player.id, []);
        }
        catch (error) {
            throw new UFLib_Form.FunError("error", { cause: error });
        }
    }
    /**
     * 顯示互動表單
     * @param player 玩家
     * @param formStructure 表單結構
     */
    static showActionForm(player, formStructure) {
        try {
            // 創建表單
            const form = new ActionFormData();
            form.title(formStructure.title);
            form.body(formStructure.body);
            formStructure.buttons.forEach((button) => {
                form.button(button.text, button.icon);
            });
            // 顯示
            form.show(player).then((response) => {
                if (response.canceled && formStructure.canceledAction !== undefined) {
                    return formStructure.canceledAction(player, response.cancelationReason);
                }
                else if (response.selection !== undefined) {
                    // 選項定義回傳行為
                    const button = formStructure.buttons[response.selection];
                    if (button?.action !== undefined) {
                        button.action(player);
                    }
                    // 表單定義回傳行為
                    if (formStructure.action !== undefined)
                        formStructure.action(player, response.selection);
                }
            }).catch((error) => {
                throw new UFLib_Form.FunError("error", { cause: error });
            });
        }
        catch (error) {
            throw new UFLib_Form.FunError("error", { cause: error });
        }
    }
    /**
     * 顯示功能表單
     * @param player 玩家
     * @param formStructure 表單結構
     */
    static showModalForm(player, formStructure) {
        try {
            // 創建表單
            const form = new ModalFormData();
            form.title(formStructure.title);
            if (formStructure.submitButtonText !== undefined)
                form.submitButton(formStructure.submitButtonText);
            formStructure.widgets.forEach((widget) => {
                switch (widget.type) {
                    case FormWidgetType.dropdown:
                        form.dropdown(widget.label, widget.options, {
                            defaultValueIndex: widget.defaultValueIndex,
                            tooltip: widget.tooltip,
                        });
                        break;
                    case FormWidgetType.slider:
                        form.slider(widget.label, widget.minimumValue, widget.maximumValue, {
                            defaultValue: widget.defaultValue,
                            valueStep: widget.valueStep,
                            tooltip: widget.tooltip,
                        });
                        break;
                    case FormWidgetType.textField:
                        form.textField(widget.label, widget.placeholderText ?? '', {
                            defaultValue: widget.defaultValue,
                            tooltip: widget.tooltip,
                        });
                        break;
                    case FormWidgetType.toggle:
                        form.toggle(widget.label, {
                            defaultValue: widget.defaultValue,
                            tooltip: widget.tooltip,
                        });
                        break;
                    case FormWidgetType.divider:
                        form.divider();
                        break;
                    case FormWidgetType.header:
                        form.header(widget.text);
                        break;
                    case FormWidgetType.label:
                        form.label(widget.text);
                        break;
                    default:
                        break;
                }
            });
            // 顯示
            form.show(player).then((response) => {
                if (response.canceled && formStructure.canceledAction !== undefined) {
                    return formStructure.canceledAction(player, response.cancelationReason);
                }
                else if (response.formValues !== undefined) {
                    // 選項定義回傳行為
                    if (response.formValues.length == formStructure.widgets.length) {
                        for (let index = 0; index < response.formValues.length; index++) {
                            const widget = formStructure.widgets[index];
                            switch (widget.type) {
                                case FormWidgetType.dropdown:
                                    widget.action?.(player, response.formValues[index]);
                                    break;
                                case FormWidgetType.slider:
                                    widget.action?.(player, response.formValues[index]);
                                    break;
                                case FormWidgetType.textField:
                                    widget.action?.(player, response.formValues[index]);
                                    break;
                                case FormWidgetType.toggle:
                                    widget.action?.(player, response.formValues[index]);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    // 表單定義回傳行為
                    if (formStructure.action !== undefined)
                        formStructure.action(player, response.formValues);
                }
            }).catch((error) => {
                throw new UFLib_Form.FunError("error", { cause: error });
            });
        }
        catch (error) {
            throw new UFLib_Form.FunError("error", { cause: error });
        }
    }
    /**
     * 顯示訊息表單
     * @param player 玩家
     * @param formStructure 表單結構
     */
    static showMessageForm(player, formStructure) {
        try {
            // 創建表單
            const form = new MessageFormData();
            form.title(formStructure.title);
            form.body(formStructure.body);
            form.button1(formStructure.button1.text);
            form.button2(formStructure.button2.text);
            // 顯示
            form.show(player).then((response) => {
                if (response.canceled && formStructure.canceledAction !== undefined) {
                    return formStructure.canceledAction(player, response.cancelationReason);
                }
                else if (response.selection !== undefined) {
                    // 選項定義回傳行為
                    if (response.selection == 0) {
                        formStructure.button1.action?.(player);
                    }
                    else if (response.selection == 1) {
                        formStructure.button2.action?.(player);
                    }
                    // 表單定義回傳行為
                    if (formStructure.action !== undefined)
                        formStructure.action(player, response.selection);
                }
            }).catch((error) => {
                throw new UFLib_Form.FunError("error", { cause: error });
            });
        }
        catch (error) {
            throw new UFLib_Form.FunError("error", { cause: error });
        }
    }
}
