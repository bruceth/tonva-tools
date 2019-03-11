import * as React from 'react';
import { TextWidget } from './textWidget';
import { TextAreaWidget } from './textareaWidget';
import { PasswordWidget, UrlWidget, EmailWidget } from './passwordWidget';
import { UpdownWidget } from './updownWidget';
import { NumberWidget } from './numberWidget';
import { DateWidget, DateTimeWidget, TimeWidget, MonthWidget } from './dateWidget';
import { CheckBoxWidget } from './checkBoxWidget';
import { SelectWidget } from './selectWidget';
import { RadioWidget } from './radioWidget';
import { RangeWidget } from './rangeWidget';
import { IdWidget } from './idWidget';
import { ButtonWidget } from './buttonWidget';
import { ArrComponent } from './arrComponent';
import { ImageWidget } from './imageWidget';
const widgetsFactory = {
    id: {
        dataTypes: ['id'],
        widget: IdWidget,
    },
    text: {
        dataTypes: ['integer', 'number', 'string'],
        widget: TextWidget
    },
    textarea: {
        dataTypes: ['string'],
        widget: TextAreaWidget
    },
    password: {
        dataTypes: ['string'],
        widget: PasswordWidget
    },
    date: {
        dataTypes: ['date'],
        widget: DateWidget
    },
    datetime: {
        dataTypes: ['date'],
        widget: DateTimeWidget
    },
    time: {
        dataTypes: ['date'],
        widget: TimeWidget
    },
    month: {
        dataTypes: ['date'],
        widget: MonthWidget
    },
    select: {
        dataTypes: ['integer', 'number', 'string', 'date', 'boolean'],
        widget: SelectWidget
    },
    url: {
        dataTypes: ['string'],
        widget: UrlWidget
    },
    email: {
        dataTypes: ['string'],
        widget: EmailWidget
    },
    number: {
        dataTypes: ['integer', 'number'],
        widget: NumberWidget
    },
    updown: {
        dataTypes: ['integer', 'number'],
        widget: UpdownWidget
    },
    color: {},
    checkbox: {
        dataTypes: ['boolean', 'integer', 'number'],
        widget: CheckBoxWidget
    },
    image: {
        dataTypes: ['string'],
        widget: ImageWidget,
    },
    checkboxes: {},
    radio: {
        dataTypes: ['integer', 'number', 'string', 'date', 'boolean'],
        widget: RadioWidget
    },
    range: {
        dataTypes: ['integer'],
        widget: RangeWidget,
    },
    button: {
        dataTypes: ['button', 'submit'],
        widget: ButtonWidget,
    }
};
export function factory(context, itemSchema, children, fieldProps) {
    if (context === undefined) {
        debugger;
        return null;
    }
    if (itemSchema === undefined)
        return undefined;
    let { name, type } = itemSchema;
    switch (type) {
        case 'arr':
            let arrSchema = context.getItemSchema(name);
            return React.createElement(ArrComponent, { parentContext: context, arrSchema: arrSchema, children: children });
        default:
            break;
    }
    let typeWidget;
    let ui = context.getUiItem(name);
    function getTypeWidget(t) {
        switch (t) {
            default: return TextWidget;
            case 'id': return IdWidget;
            case 'integer': return UpdownWidget;
            case 'number': return NumberWidget;
            case 'string': return TextWidget;
            case 'date': return DateWidget;
            case 'boolean': return CheckBoxWidget;
            case 'button':
            case 'submit': return ButtonWidget;
        }
    }
    if (ui === undefined) {
        typeWidget = getTypeWidget(type);
    }
    else {
        let { widget: widgetType } = ui;
        switch (widgetType) {
            default:
                if (widgetType !== undefined) {
                    let widgetFactory = widgetsFactory[widgetType];
                    typeWidget = widgetFactory.widget;
                }
                if (typeWidget === undefined)
                    typeWidget = getTypeWidget(type);
                break;
            case 'custom':
                typeWidget = ui.WidgetClass;
                break;
            case 'group':
                return React.createElement("span", null, "impletment group");
        }
        //label = uiLabel || name;
    }
    let { isRow, widgets } = context;
    let widget = new typeWidget(context, itemSchema, fieldProps, children);
    widgets[name] = widget;
    return React.createElement(widget.container, null);
    /*
    if (isRow === false) {
        let WidgetElement = observer(() => widget.container());
        return <WidgetElement />;
    }
    else {
        let widgetElement = widget.container();
        return widgetElement;
    }
    */
}
//# sourceMappingURL=factory.js.map