/**
 * Created by nan on 2019/10/24.
 * 使用多个属性组成表达式的运行条件
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.ConditionMultiAttributeFieldPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'vbox',
    productId: null,
    maxHeight: 350,
    minHeight: 150,
    autoScroll: true,
    conditionType: 'simple',//simple,complex
    operator: 'AND',//
    fieldPanel: null,
    hideConditionModel: false,//隐藏条件执行模式
    extraParams: null,
    checkOnly: false,
    deleteSrc: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
    bodyStyle: {
        borderColor: '#bec4c9'
    },
    items: [],
    initComponent: function () {
        var me = this;
        me.tbar = {
            items: [
                {
                    xtype: 'button',
                    iconCls: 'icon_add',
                    disabled: me.checkOnly,
                    text: i18n.getKey('添加多属性表达式条件'),
                    handler: function (btn) {
                        var panel = btn.ownerCt.ownerCt;
                        var field = panel.createMultiAttributeConstraint();
                        panel.add(field);
                    }
                },
                {
                    xtype: 'radiogroup',
                    width: 350,
                    disabled: me.checkOnly,
                    hidden: me.hideConditionModel,//隐藏条件执行模式
                    itemId: 'typeRadioGroup',
                    items: [
                        {boxLabel: '满足以下所有条件', name: 'operator', inputValue: 'AND', checked: true},
                        {boxLabel: '满足以下任一条件', name: 'operator', inputValue: 'OR'},
                    ],
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var panel = field.ownerCt.ownerCt;
                            panel.operator = newValue.operator;
                            console.log(panel.operator)
                        }
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_check',
                    hidden: true,
                    text: i18n.getKey('查看可用属性'),
                    handler: function (btn) {
                        var expressionField = btn.ownerCt.ownerCt;
                        var win = Ext.getCmp('contextWindow');
                        var contextData = [];
                        var extraParams = expressionField.ownerCt.extraParams;
                        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
                        for (var i = 0; i < skuAttributeStore.getCount(); i++) {
                            var data = skuAttributeStore.getAt(i).getData();
                            contextData.push({
                                id: data.attribute.id,
                                name: data.attribute.name,
                                value: "Attr_" + data.attribute.id
                            })
                        }
                        if (extraParams && extraParams.length > 0) {
                            contextData = contextData.concat(extraParams);
                        }
                        if (Ext.isEmpty(win)) {
                            win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.ContextWindow', {
                                expressionTextarea: null,
                                templateInfo: 'Attr_属性Id+Attr_属性Id2',
                                id: 'contextWindow',
                                contextData: contextData,
                            });
                        }
                        win.show();
                        console.log(this);
                    }
                }
            ]
        };
        Ext.apply(Ext.form.field.VTypes, {
            minAndMax: function (val, field) {
                if (field.itemId == 'min') {
                    var max = field.ownerCt.getComponent('max');
                    if (Ext.isEmpty(max.getValue())) {
                        return true;
                    }
                    if (val < max.getValue()) {
                        max.clearInvalid()
                        return true;
                    } else {
                        return false
                    }

                } else {
                    var min = field.ownerCt.getComponent('min');
                    if (Ext.isEmpty(min.getValue())) {
                        return true;
                    }
                    if (val > min.getValue()) {
                        min.clearInvalid()
                        return true;
                    } else {
                        return false
                    }
                }
            },
            minAndMaxText: '请输入正确数值'
        });
        me.callParent();
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        for (var i = 0; i < me.items.items.length; i++) {
            var container = me.items.items[i];
            for (var j = 0; j < container.items.items.length; j++) {
                var item = container.items.items[j];
                if (item.isValid && item.isValid() == false) {
                    isValid = false;
                }
            }
        }
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {
            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
            conditionType: 'complex'
        };
        var logicalOperation = {
            operations: [],
            clazz: 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation',
            operator: me.operator
        };
        if (me.items.items.length == 0) {
            return null;
        } else {
            for (var i = 0; i < me.items.items.length; i++) {
                logicalOperation.operations.push(me.items.items[i].getValue());
            }
            result.operation = logicalOperation;
            return result;
        }
    },
    setValue: function (data) {
        var me = this;
        var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
        var typeRadioGroup = toolBar.getComponent('typeRadioGroup');
        if (data.conditionType == 'else') {
            typeRadioGroup.setValue({operator: 'else'});//设置是AND 或OR

        } else {
            typeRadioGroup.setValue({operator: data.operation.operator});//设置是AND 或OR
            me.removeAll();
            for (var i = 0; i < data.operation.operations.length; i++) {
                var item = data.operation.operations[i];
                if (item.operationType == 'complex') {
                    var field = me.createMultiAttributeConstraint(item);
                    me.add(field);
                }
            }
        }
    },
    createMultiAttributeConstraint: function (value) {
        var me = this;
        var min = null;
        var attributeField = null;
        var max = null;
        var operatorValue = null;
        if (value) {
            operatorValue = value.operator;
            if (value.clazz == 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation') {
                attributeField = value.midValue.calculationExpression;
                min = value.operations[0].value;
                max = value.operations[1].value;
            } else {
                attributeField = value.operations[0].calculationExpression;
                min = value.operations[1].value;
            }

        }
        var item = {
            xtype: 'fieldcontainer',
            width: '100%',
            padding: '5 25 5 10',
            layout: {
                type: 'hbox'
            },
            getValue: function () {
                var me = this;
                var result = {};
                result.operations = [];
                var attributeField = me.getComponent('attributeField');
                var operator = me.getComponent('operator');
                var simpleInput = me.getComponent('simpleInput');
                var complexInput = me.getComponent('complexInput');
                if (simpleInput.hidden == false) {
                    result.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
                    result.operator = operator.getValue();
                    result.operations.push({
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue',
                        calculationExpression: attributeField.getValue()
                    });
                    result.operations.push({
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                        value: simpleInput.getValue()
                    });
                } else {
                    result.clazz = 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation';
                    result.operator = operator.getValue();
                    result.midValue = {
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue',
                        calculationExpression: attributeField.getValue()
                    };
                    result.operations.push({
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                        value: complexInput.getComponent('min').getValue()
                    });
                    result.operations.push({
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                        value: complexInput.getComponent('max').getValue()
                    });
                }
                result.operationType = 'complex';
                return result;
            },
        };
        var attributeField = {
            xtype: 'textfield',
            flex: 1,
            itemId: 'attributeField',
            margin: '0 10 0 0',
            allowBlank: false,
            tipInfo: '点击显示上下文',
            value: attributeField,
            clickHandler: function () {
                var me = this;
                var expressionField = me;
                var extraParams = expressionField.ownerCt.ownerCt.extraParams;
                var win = Ext.getCmp('contextWindow');
                var contextData = [];
                var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
                for (var i = 0; i < skuAttributeStore.getCount(); i++) {
                    var data = skuAttributeStore.getAt(i).getData();
                    contextData.push({
                        id: '',
                        name: data.attribute.name,
                        value: "Attr_" + data.attribute.id
                    })
                }
                if (extraParams && extraParams.length > 0) {
                    contextData = contextData.concat(extraParams);
                }
                if (Ext.isEmpty(win)) {
                    win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.ContextWindow', {
                        expressionTextarea: expressionField,
                        id: 'contextWindow',
                        templateInfo: 'Attr_属性Id + Attr_属性Id',
                        x: me.getBox().x + 250,
                        y: me.getBox().y - 120,
                        contextData: contextData,
                    });
                }
                win.show();
            },
            listeners: {
                afterrender: function (display) {
                    var iconTipInfo = display.el.dom.getElementsByClassName('iconTipInfo')[0]; //获取到该html元素下的a元素
                    var ela = Ext.fly(iconTipInfo); //获取到a元素的element封装对象
                    ela.on("click", function () {
                        display.clickHandler();
                    });
                }
            }
        };
        var operator = {
            xtype: 'combo',
            displayField: 'display',
            valueField: 'value',
            editable: false,
            width: 100,
            itemId: 'operator',
            margin: '0 5 0 0',
            matchFieldWidth: false,
            value: '==',
            allowBlank: false,
            listConfig: {
                itemTpl: Ext.create('Ext.XTemplate',
                    '<div title="{title}" ext:qtitle="title" ext:qtip="{display} : {display} tip" >{display}</div>'),
            },
            store: Ext.create('Ext.data.Store', {
                fields: [
                    'display',
                    'value',
                    'title'
                ],
                data: [
                    {
                        display: '=',
                        value: '=='
                    },
                    {
                        display: '!=',
                        value: '!='
                    },
                    {
                        display: '<',
                        value: '<'
                    },
                    {
                        display: '>',
                        value: '>'
                    },
                    {
                        display: '<=',
                        value: '<='
                    },
                    {
                        display: '>=',
                        value: '>='
                    },

                    {
                        display: '[min,max]',
                        value: '[min,max]',
                        title: 'min<=选择属性运算值<=max'
                    }, {
                        display: '[min,max)',
                        value: '[min,max)',
                        title: 'min<=选择属性运算值<max'
                    }, {
                        display: '(min,max)',
                        value: '(min,max)',
                        title: 'min<选择属性运算值<max'
                    }, {
                        display: '(min,max]',
                        value: '(min,max]',
                        title: 'min<选择属性运算值<=max'
                    }
                ]
            }),
            listeners: {
                change: function (field, newValue, oldValue) {
                    var simpleInput = field.ownerCt.getComponent('simpleInput');
                    var complexInput = field.ownerCt.getComponent('complexInput');
                    if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], newValue)) {
                        simpleInput.hide();
                        simpleInput.setDisabled(true);
                        complexInput.show();
                        complexInput.setDisabled(false);
                    } else {
                        complexInput.hide();
                        complexInput.setDisabled(true);
                        simpleInput.show();
                        simpleInput.setDisabled(false);
                    }
                },
                afterrender: function (field) {
                    if (operatorValue) {
                        field.setValue(operatorValue);
                    }
                }
            }
        };
        var simpleInput = {
            xtype: 'numberfield',
            itemId: 'simpleInput',
            flex: 1,
            name: 'min',
            value: min,
            allowBlank: false
        }
        var complexInput = {
            xtype: 'fieldcontainer',
            hidden: true,
            disabled: true,
            itemId: 'complexInput',
            layout: 'hbox',
            items: [
                {
                    xtype: 'numberfield',
                    width: 150,
                    allowBlank: false,
                    labelWidth: 50,
                    margin: '0 5 0 0',
                    itemId: 'min',
                    name: 'min',
                    value: min,
                    vtype: 'minAndMax',
                    fieldLabel: i18n.getKey('min')
                },
                {
                    xtype: 'numberfield',
                    width: 150,
                    allowBlank: false,
                    labelWidth: 50,
                    itemId: 'max',
                    name: 'max',
                    value: max,
                    vtype: 'minAndMax',
                    fieldLabel: i18n.getKey('max')
                }
            ]
        }
        var deleteField = {
            xtype: 'displayfield',
            width: 16,
            padding: '0 10 0 10 ',
            height: 16,
            disabled: me.checkOnly,
            hidden: me.checkOnly,
            itemId: 'delete',
            value: '<img class="tag" title="点击进行清除数据" style="height: 100%;width: 100%;cursor: pointer" src="' + me.deleteSrc + '">',
            listeners: {
                render: function (display) {
                    var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                    ela.on("click", function () {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清除已填写的数据'), function (selector) {
                            if (selector === 'yes') {
                                var container = display.ownerCt;
                                var panel = container.ownerCt;
                                panel.remove(container);
                            }
                        })
                    });
                }
            }
        };
        item.items = [deleteField, attributeField, operator, simpleInput, complexInput];
        return item;
    }
})
