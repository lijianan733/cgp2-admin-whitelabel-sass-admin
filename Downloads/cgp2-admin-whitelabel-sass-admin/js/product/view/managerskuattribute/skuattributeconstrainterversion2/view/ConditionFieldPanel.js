/**
 * Created by nan on 2019/10/21.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.ConditionFieldPanel', {
    extend: 'Ext.panel.Panel',
    bodyStyle: {
        'borderWidth': '0px'
    },
    layout: 'vbox',
    productId: null,
    maxHeight: 350,
    autoScroll: true,
    conditionType: 'simple',//simple,complex
    operator: 'AND',//
    items: [],
    productAttributeStore: null,
    tbar: {
        border: false,
        items: [
            {
                xtype: 'button',
                iconCls: 'icon_add',
                itemId: 'addBtn',
                text: i18n.getKey('添加条件'),
                handler: function (btn) {
                    btn.ownerCt.ownerCt.addNewConditon(btn);
                }
            },
            {
                xtype: 'radiogroup',
                width: 500,
                itemId: 'typeRadioGroup',
                hidden: true,
                items: [
                    {boxLabel: '满足以下所有条件', name: 'type', inputValue: 'AND', checked: true},
                    {boxLabel: '满足以下任一条件', name: 'type', inputValue: 'OR'}
                ],
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var panel = field.ownerCt.ownerCt;
                        panel.operator = newValue.type;
                        console.log(panel.operator)
                    }
                }
            }
        ]
    },
    initComponent: function () {
        var me = this;
        me.productAttributeStore = me.productAttributeStore || Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.ProductAttributeStore', {
            productId: me.productId
        });
        me.callParent();
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {
            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
            conditionType: 'simple'
        };
        var logicalOperation = {
            operations: [],
            clazz: 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation',
            operator: me.operator
        };
        if (me.items.items.length == 0) {
            //没有写条件
            return null;
        } else {
            //有判断条件
            for (var i = 0; i < me.items.items.length; i++) {
                logicalOperation.operations.push(me.items.items[i].getValue());
            }
            result.operation = logicalOperation;
            return result;
        }
    },
    setValue: function (data) {
        var me = this;
        me.removeAll();
        if (Ext.Object.isEmpty(data)) {
            return;
        } else {
            //最外层为确定AND或者Or
            var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
            var typeRadioGroup = toolBar.getComponent('typeRadioGroup');
            typeRadioGroup.setValue({type: data.operation.operator});//设置是AND 或OR
            var createContainer = function (operations, productAttributeStore, panel) {
                for (var i = 0; i < operations.length; i++) {
                    var item = operations[i];
                    var skuAttributeId = item.operations[0].skuAttributeId;
                    if (item.clazz == "com.qpp.cgp.domain.executecondition.operation.BetweenOperation") {
                        skuAttributeId = item.midValue.skuAttributeId;
                    }
                    var skuAttributeRecord = null;
                    var operator = item.operator;
                    for (var j = 0; j < productAttributeStore.data.length; j++) {
                        //找出对应的属性
                        if (skuAttributeId == productAttributeStore.data.items[j].getId()) {
                            skuAttributeRecord = productAttributeStore.data.items[j];
                        }
                    }
                    var value = {
                        value: null,
                        min: null,
                        max: null
                    };
                    if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], operator)) {
                        value.min = item.operations[0].value;
                        value.max = item.operations[1].value;
                    } else {
                        value.value = item.operations[1].value || item.operations[1].OptionId;
                    }
                    var container = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.ConditionFieldContainer', {
                        selectedRecord: skuAttributeRecord,
                        productAttributeStore: productAttributeStore,
                        conditionFieldPanel: panel,
                        value: value,
                        operator: operator
                    });
                    panel.add(container);
                }
            };
            if (me.productAttributeStore.data.items.length == 0) {//store未加载
                me.productAttributeStore.on('load',
                    function () {
                        createContainer(data.operation.operations, me.productAttributeStore, me);
                    },
                    this, {
                        single: true
                    })
            } else {
                createContainer(data.operation.operations, me.productAttributeStore, me);
            }
            if (data.operation.operations.length > 1) {
                typeRadioGroup.show();
                typeRadioGroup.setDisabled(false);
            }
        }
    },
    addNewConditon: function (btn) {
        var me = this;
        var window = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.SelectAttributeWindow', {
            productId: me.productId,
            fieldPanel: me,
            productAttributeStore: me.productAttributeStore,
            saveHandler: function (btn) {
                var window = btn.ownerCt.ownerCt;
                var attributeGrid = window.getComponent('attributeGrid');
                var selectRecord = attributeGrid.getSelectionModel().getSelection();
                if (selectRecord.length > 0) {
                    for (var i = 0; i < selectRecord.length; i++) {
                        var selectedRecord = selectRecord[i];
                        var container = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.ConditionFieldContainer', {
                            selectedRecord: selectedRecord,
                            conditionFieldPanel: window.fieldPanel
                        });
                        window.fieldPanel.add(container);
                    }
                }
                if (window.fieldPanel.items.items.length > 1) {
                    me.getDockedItems('toolbar[dock="top"]')[0].getComponent('typeRadioGroup').show();
                    me.getDockedItems('toolbar[dock="top"]')[0].getComponent('typeRadioGroup').setDisabled(false);
                }
                window.close();
            }
        });
        window.show();
    }
})
