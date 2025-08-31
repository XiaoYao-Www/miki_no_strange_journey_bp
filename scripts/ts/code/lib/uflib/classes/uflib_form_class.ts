/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/

import { Player, RawMessage } from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";

/**
 * 所有表單類型
 */
export type FormStructure =
    ActionFormStructure |
    ModalFormStructure |
    MessageFormStructure |
    FormStructureGenerate<any>;

/**
 * 表單類型
 */
export enum FormStructureType {
    action = 'action',
    modal = 'modal',
    message = 'message',
    generate = 'generate',
}

/**
 * 表單互動類型
 */
export enum FormWidgetType {
    button = 'button', // 按鈕
    dropdown = 'dropdown', // 下拉選項
    slider = 'slider', // 滑條
    textField = 'textField', // 文字輸入框
    toggle = 'toggle', // 切換按鈕
    divider = 'divider', // 分隔線
    header = 'header', // 標題
    label = 'label', // 內文
}

///// 表單互動選項
/**
 * 按鈕
 */
export interface ButtonStructure {
    type?: FormWidgetType.button;
    text: string | RawMessage;
    icon?: string;
    action?: (user: Player) => void;
}

/**
 * 下拉選單
 */
export interface DropdownStructure {
    type: FormWidgetType.dropdown;
    label: string | RawMessage;
    options: (string | RawMessage)[];
    defaultValueIndex?: number;
    tooltip?: string | RawMessage;
    action?: (user: Player, index: number) => void;
}

/**
 * 滑桿
 */
export interface SliderStructure {
    type: FormWidgetType.slider;
    label: string | RawMessage;
    minimumValue: number;
    maximumValue: number;
    valueStep?: number;
    defaultValue?: number;
    tooltip?: string | RawMessage;
    action?: (user: Player, value: number) => void;
}

/**
 * 文本框
 */
export interface TextFieldStructure {
    type: FormWidgetType.textField;
    label: string | RawMessage;
    placeholderText?: string | RawMessage;
    defaultValue?: string;
    tooltip?: string | RawMessage;
    action?: (user: Player, value: string) => void;
}

/**
 * 切換按鈕
 */
export interface ToggleStructure {
    type: FormWidgetType.toggle;
    label: string | RawMessage;
    defaultValue?: boolean;
    tooltip?: string | RawMessage;
    action?: (user: Player, value: boolean) => void;
}

/**
 * 分隔線
 */
export interface DividerStructure {
    type: FormWidgetType.divider;
}

/**
 * 標題
 */
export interface HeaderStructure {
    type: FormWidgetType.header;
    text: string | RawMessage;
}

/**
 * 內文
 */
export interface LabelStructure {
    type: FormWidgetType.label;
    text: string | RawMessage;
}

/**
 * 互動表單結構
 */
export interface ActionFormStructure {
    type: FormStructureType.action;
    title: string | RawMessage;
    body: string | RawMessage;
    buttons: ButtonStructure[];
    canceledAction?: (user: Player, cancelationReason?: FormCancelationReason) => void;
    action?: (user: Player, selection: number) => void;
}

/**
 * 功能表單結構
 */
export interface ModalFormStructure {
    type: FormStructureType.modal;
    title: string | RawMessage;
    widgets: (
        DividerStructure |
        DropdownStructure |
        HeaderStructure |
        LabelStructure |
        SliderStructure |
        TextFieldStructure |
        ToggleStructure
    )[];
    submitButtonText?: string | RawMessage;
    canceledAction?: (user: Player, cancelationReason?: FormCancelationReason) => void;
    action?: (user: Player, response: (string | number | boolean | undefined)[]) => void;
}

/**
 * 訊息表單結構
 */
export interface MessageFormStructure {
    type: FormStructureType.message;
    title: string | RawMessage;
    body: string | RawMessage;
    button1: ButtonStructure;
    button2: ButtonStructure;
    canceledAction?: (user: Player, cancelationReason?: FormCancelationReason) => void;
    action?: (user: Player, selection: number) => void;
}

/**
 * 表單生成器
 */
export interface FormStructureGenerate<T> {
    type: FormStructureType.generate;
    parameter: T;
    generateFunction: (parameter: T) => (ActionFormStructure | ModalFormStructure | MessageFormStructure);
}