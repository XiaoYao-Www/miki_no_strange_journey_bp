/*
    最後修改根據
    MCBE 1.21.101
    @minecraft/server-ui 2.0.0
    @minecraft/server 2.1.0
    2025/08/22
*/
/**
 * 表單類型
 */
export var FormStructureType;
(function (FormStructureType) {
    FormStructureType["action"] = "action";
    FormStructureType["modal"] = "modal";
    FormStructureType["message"] = "message";
    FormStructureType["generate"] = "generate";
})(FormStructureType || (FormStructureType = {}));
/**
 * 表單互動類型
 */
export var FormWidgetType;
(function (FormWidgetType) {
    FormWidgetType["button"] = "button";
    FormWidgetType["dropdown"] = "dropdown";
    FormWidgetType["slider"] = "slider";
    FormWidgetType["textField"] = "textField";
    FormWidgetType["toggle"] = "toggle";
    FormWidgetType["divider"] = "divider";
    FormWidgetType["header"] = "header";
    FormWidgetType["label"] = "label";
})(FormWidgetType || (FormWidgetType = {}));
