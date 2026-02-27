/**
 * Created by nan on 2020/4/28.
 * 根据输入的属性，有一固定值，和表达式计算值
 */
Ext.define('CGP.common.commoncomp.AttributeJSExpressionInputField', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.attributejsexpressioninputfield',
    layout: {
        type: 'hbox',
        align: 'middle',
    },
    defaults: {},
    JSExpressionInputFieldConfig: {
        contextData: [],
        templateInfo: null,
        width: 500,
        height: 150,
    },
    allowBlank: false,
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    attribute: null,
    readOnly: false,
    initWidth: null,//初始的大小
    fixValueClazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
    calculationTemplateValueClazz: 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue',
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
            var switchBtnAEl = switchBtn.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
            if (data.clazz == me.fixValueClazz) {
                switchBtnAEl.title = '切换为表达式输入';
                me.setWidth(fixValueField.ownerCt.initWidth);
                fixValueField.show();
                fixValueField.setValue(data.value);
                expressionField.hide();
                expressionField.setDisabled(true);
                fixValueField.setDisabled(false);
            } else {
                switchBtnAEl.title = '切换为固定值输入';
                fixValueField.hide();
                me.setWidth(800);
                expressionField.setValue(data.calculationExpression);
                expressionField.show();
                expressionField.setDisabled(false);
                fixValueField.setDisabled(true);
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
    /**
     * 创建BomIitemMapping的fieldSet
     * @param data attribute
     * @param defaultMulti
     * @param value
     * @param type
     */
    creatFieldByProductAttribute: function (attribute, defaults, defaultMulti) {
        var me = this;
        var inputType = attribute['inputType'];
        var selectType = attribute['selectType'];
        var options = Ext.clone(attribute['options']);
        var valueType = attribute['valueType'];
        var item = {};
        item.name = attribute.id;
        /*
                item.fieldLabel = attribute.name;
        */
        item = Ext.Object.merge(item, defaults || {});
        if (options.length > 0) {//选项类型
            item.xtype = 'combo';
            item.haveReset = true;
            item.displayField = 'value';
            item.valueField = 'id';//不需要id
            item.editable = false;
            item.store = Ext.create('Ext.data.Store', {
                fields: ['value', 'name', 'displayValue', 'id'],
                data: options
            });
            item.multiSelect = defaultMulti ? defaultMulti : (selectType == 'MULTI' ? true : false);
            if (item.multiSelect) {
                item.xtype = 'multicombobox';
                if (item.value) {
                    if (Ext.isArray(item.value)) {

                    } else {
                        item.value = item.value.split(',');
                    }
                }
            } else {
                if (item.value) {
                    if (Ext.isNumber(item.value)) {
                        item.value = item.value;
                    } else if (Ext.isString(item.value)) {
                        item.value = Ext.Number.from(item.value);
                    }
                }
            }
        } else if (inputType == 'Date') {//输入类型
            item.xtype = 'datetimefield';
            item.editable = false;
            item.format = "Y-m-d H:i:s";
            if (item.value) {
                item.value = new Date(parseInt(item.value));
            }
        } else if (inputType == 'YesOrNo') {
            item.xtype = 'radiogroup';
            var yesItem = {
                name: item.name,
                inputValue: 'YES',
                boxLabel: 'YES'
            }
            var noItem = {
                name: item.name,
                inputValue: 'NO',
                boxLabel: 'NO'
            }
            if (item.value) {
                if (item.value == 'YES') {
                    yesItem.checked = true;
                } else if (item.value == 'NO') {
                    noItem.checked = true;
                }
            }
            item.items = [yesItem, noItem];
            item.columns = 2;
        } else if (valueType == 'Number' || valueType == 'int') {
            var stripCharsRe = null;
            var allowDecimals = true;
            var allowExponential = true;
            if (valueType == 'Number') {
                stripCharsRe = /\+|\/|-|\*/;
            }
            if (valueType == 'int') {
                stripCharsRe = '';
                stripCharsRe = /\+|\/|-|\*|\./;
                allowDecimals = false;
                allowExponential = false;
            }
            item.xtype = 'numberfield';
            item.decimalPrecision = 8;
            item.allowDecimals = allowDecimals;
            item.allowExponential = allowExponential;
            item.value = item.value ? Number(item.value) : '';
        } else {
            item.xtype = 'textfield';
            item.value = item.value ? item.value : '';
        }
        return item;
    },
    initComponent: function () {
        var me = this;
        var attributeDefault = {
            itemId: 'fixValueField',
            readOnly: me.readOnly,
            flex: 1,
            allowBlank: me.allowBlank

        };
        me.name = me.name || me.attribute.name;
        var type = me.fixValueClazz;
        me.items = [
            me.creatFieldByProductAttribute(me.attribute, attributeDefault),
            Ext.Object.merge({
                xtype: 'jsexpressioninputfield',
                name: 'JSExpressionInputField',
                itemId: 'expressionField',
                hidden: true,
                width: 500,
                height: 150,
                disabled: true,
                readOnly: me.readOnly,
                allowBlank: me.allowBlank,
                /*
                                fieldLabel: me.attribute.name,
                */
            }, me.JSExpressionInputFieldConfig),
            {
                xtype: 'displayfield',
                itemId: 'switch',
                columnWidth: 0.2,
                height: 24,
                hidden: me.valueExSwitch,
                value: '<img class="tag" title="切换为表达式输入" style="margin-left: 0px;margin-top:-4px;height:24px;width: 24px;cursor: pointer" src="' + me.switchUrl + '">',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        if (type == me.fixValueClazz || Ext.isEmpty(type)) {
                            a.title = '切换为表达式输入';
                        } else {
                            a.title = '切换为固定值输入';
                        }
                        ela.on("click", function () {
                            var fixValueField = display.ownerCt.getComponent('fixValueField');
                            var expressionField = display.ownerCt.getComponent('expressionField');
                            if (fixValueField.hidden == true) {
                                a.title = '切换为表达式输入';
                                display.ownerCt.setWidth(fixValueField.ownerCt.initWidth);
                                fixValueField.show();
                                expressionField.hide();
                                expressionField.setDisabled(true);
                                fixValueField.setDisabled(false);
                            } else {
                                a.title = '切换为固定值输入';
                                display.ownerCt.setWidth(800);
                                fixValueField.hide();
                                expressionField.show();
                                expressionField.setDisabled(false);
                                fixValueField.setDisabled(true);
                            }
                        });
                    }
                }
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            me.initWidth = me.width;
        })
    },
    /**
     *
     * @param readOnly
     */
    setReadOnly: function (readOnly) {
        var me = this;
        me.readOnly = readOnly;
        var fixValueField = me.getComponent('fixValueField');
        var expressionField = me.getComponent('expressionField');
        var switchField = me.getComponent('switch');
        expressionField.setReadOnly(readOnly);
        fixValueField.setReadOnly(readOnly);
        if (readOnly) {
            switchField.hide();
        } else {
            switchField.show();
        }
    }
})
