Ext.define('CGP.virtualcontainerobject.view.argumentbuilder.ValueContainer', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.valuecontainer',
    layout: {
        type: 'hbox',
        align: 'middle',
    },
    padding: '5 25 5 25',
    defaults: {
        allowBlank: false,
        width: 320,
        margin: '0 0 5 0'
    },
    JSExpressionInputFieldConfig: {
        contextData: [],
        templateInfo: null,
        width: 500,
    },
    allowBlank: false,
    width: 640,
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    fixValueClazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
    calculationTemplateValueClazz: 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        var fixValueField = me.getComponent('fixValueField');
        var expressionField = me.getComponent('expressionField');
        if (fixValueField.hidden == false) {
            var data = {};
            if (me.attribute.selectType == 'MULTI') {
                var multiValue = fixValueField.getValue();
                multiValue = multiValue.map(function (item) {
                    return '\'' + item + '\''
                });
                data = {
                    clazz: me.fixValueClazz,
                    value: '[' + multiValue + ']'
                }
            } else {
                data = {
                    clazz: me.fixValueClazz,
                    value: fixValueField.getValue()
                }
            }
            return data;
        } else {
            return {
                clazz: me.calculationTemplateValueClazz,
                calculationExpression: expressionField.getValue()
            }
        }
    },
    setValue: function (data) {
        var me = this;
        if (data) {
            var fixValueField = me.getComponent('fixValueField');
            var expressionField = me.getComponent('expressionField');
            var switchBtn = me.getComponent('switch');
            if (switchBtn) {
                var switchBtnAEl = switchBtn?.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                if (data.clazz == me.fixValueClazz) {
                    switchBtnAEl.title = '切换为表达式输入';
                    fixValueField.show();
                    fixValueField.setValue(data.value);
                    expressionField.hide();
                    expressionField.setDisabled(true);
                    fixValueField.setDisabled(false);
                } else {
                    switchBtnAEl.title = '切换为固定值输入';
                    fixValueField.hide();
                    expressionField.setValue(data.calculationExpression);
                    expressionField.show();
                    expressionField.setDisabled(false);
                    fixValueField.setDisabled(true);
                }
            }
            else{
                fixValueField.setValue(data.value);
            }
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.isValid() == false) {
                isValid = false;
                me.Errors[item.getFieldLabel()] = item.getErrors();
            }
        })
        return isValid;
    },
})