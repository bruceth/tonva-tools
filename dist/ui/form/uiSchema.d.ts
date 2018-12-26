/// <reference types="react" />
import { Context } from './context';
import { FieldRule, ContextRule } from './rules';
export declare type UiType = 'form' | 'arr' | 'group' | 'button' | 'submit' | 'id' | 'text' | 'textarea' | 'password' | 'date' | 'datetime' | 'select' | 'url' | 'email' | 'updown' | 'color' | 'checkbox' | 'checkboxes' | 'radio' | 'range';
export declare type ChangingHandler = (context: Context, value: any, prev: any) => boolean;
export declare type ChangedHandler = (context: Context, value: any, prev: any) => void;
export interface UiItem {
    widget?: UiType;
    readOnly?: boolean;
    disabled?: boolean;
    visible?: boolean;
    label?: string;
    className?: string;
    onChanging?: ChangingHandler;
    onChanged?: ChangedHandler;
    rules?: (ContextRule | FieldRule) | (ContextRule | FieldRule)[];
    Templet?: TempletType;
}
export interface UiIdItem extends UiItem {
    widget: 'id';
    placeholder?: string | JSX.Element;
    pickId?: (context: Context, name: string, value: number) => Promise<number>;
}
export interface UiInputItem extends UiItem {
    placeholder?: string;
    rules?: FieldRule | FieldRule[];
}
export interface UiTextItem extends UiInputItem {
    widget: 'text';
}
export interface UiTextAreaItem extends UiInputItem {
    widget: 'textarea';
    rows?: number;
}
export interface UiPasswordItem extends UiInputItem {
    widget: 'password';
}
export interface UiRange extends UiInputItem {
    widget: 'range';
    min?: number;
    max?: number;
    step?: number;
}
export interface UiCheckItem extends UiItem {
    widget: 'checkbox';
    trueValue?: any;
    falseValue?: any;
}
export interface UiSelectBase extends UiItem {
    rules?: FieldRule | FieldRule[];
    defaultValue: any;
    list: {
        value: any;
        title: string;
    }[];
}
export interface UiSelect extends UiSelectBase {
    widget: 'select';
}
export interface UiRadio extends UiSelectBase {
    widget: 'radio';
}
export interface UiItemCollection {
    [field: string]: UiItem;
}
export declare type TempletType = ((context?: Context, name?: string, value?: number) => JSX.Element) | JSX.Element;
export interface UiSchema {
    items?: UiItemCollection;
    Templet?: TempletType;
    readonly?: boolean;
    disabled?: boolean;
    className?: string;
    selectable?: boolean;
    deletable?: boolean;
    restorable?: boolean;
    rules?: ContextRule | ContextRule[];
}
export interface UiArr extends UiSchema, UiItem {
    widget: 'arr';
    rules?: ContextRule | ContextRule[];
}
export interface UiGroup extends UiItem {
    widget: 'group';
    with: string[];
}
export interface UiButton extends UiItem {
    widget: 'button';
}
