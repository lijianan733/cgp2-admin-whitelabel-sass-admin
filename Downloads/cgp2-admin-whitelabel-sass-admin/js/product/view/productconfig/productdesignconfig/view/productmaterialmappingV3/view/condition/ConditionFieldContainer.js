/**
 * Created by nan on 2020/4/7.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.ConditionFieldContainer", {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.conditionfieldcontainer',
    getName: function () {
        var me = this;
        return me.name;
    },
    onlySimplyCondition: false,
    allowElseCondition: true,
    extraParams: null,
    checkOnly: false,

    initComponent: function () {
        var me = this;
        var multiConditionFieldPanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.ConditionMultiAttributeFieldPanel', {
            width: '100%',
            title: i18n.getKey('复杂条件'),
            extraParams: me.extraParams,
            itemId: 'multiAttributeConditionFieldPanel',
            productId: me.productId,
            checkOnly: me.checkOnly,
            hideConditionModel: true
        });
        var conditionGridPanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.ConditionGrid', {
            title: i18n.getKey('简单条件'),
            hideConditionModel: true,
            itemId: 'conditionGrid',
            checkOnly: me.checkOnly,
        });

        var customConditionPanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.CustomConditionPanel', {
            title: i18n.getKey('自定义执行条件'),
            hideConditionModel: true,
            checkOnly: me.checkOnly,
            hidden: me.inputModel != 'custom',
            itemId: 'customConditionPanel',
            productId: me.productId
        });
        me.items = [
            {
                xtype: 'radiogroup',
                width: 750,
                fieldLabel: i18n.getKey('执行机制'),
                itemId: 'radioGroup',
                labelWidth: 60,
                allowBlank: true,
                items: [
                    {
                        boxLabel: '满足以下所有条件',
                        name: 'conditionType',
                        readOnly: me.checkOnly,
                        inputValue: 'AND',
                        checked: true
                    },
                    {boxLabel: '满足以下任一条件', name: 'conditionType', readOnly: me.checkOnly, inputValue: 'OR'},
                    {boxLabel: '其他条件都不成立时执行', name: 'conditionType', readOnly: me.checkOnly, inputValue: 'else'},
                    {boxLabel: '自定义执行条件', name: 'conditionType', readOnly: me.checkOnly, inputValue: 'custom'},

                ],
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var conditionPanel = field.ownerCt.getComponent('conditionPanel');
                        var customConditionPanel = field.ownerCt.getComponent('customConditionPanel');
                        if (newValue.conditionType == 'else') {
                            conditionPanel.hide();
                            customConditionPanel.hide();
                            customConditionPanel.setDisabled(true);
                        } else if (newValue.conditionType == 'custom') {
                            conditionPanel.hide();
                            customConditionPanel.show();
                            customConditionPanel.setDisabled(false);
                        } else {
                            conditionPanel.show();
                            customConditionPanel.hide();
                            customConditionPanel.setDisabled(true);
                        }

                    }
                }
            },
            {
                xtype: 'panel',
                bodyStyle: {
                    borderColor: 'silver'
                },
                itemId: 'conditionPanel',
                isValid: function () {
                    var me = this;
                    var isValid = true;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.isValid() == false) {
                            isValid = false;
                        }
                    }
                    return isValid;
                },
                layout: {
                    type: 'accordion',
                    titleCollapse: true,
                    animate: true,
                    multi: true,
                    activeOnTop: false
                },
                items: [
                    conditionGridPanel,
                    multiConditionFieldPanel
                ]
            },
            customConditionPanel
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var result = {};
        var radioGroup = me.getComponent('radioGroup');
        var conditionPanel = me.getComponent('conditionPanel');
        var conditionType = radioGroup.getValue().conditionType;
        var customConditionPanel = me.getComponent('customConditionPanel');
        var conditionGridPanel = conditionPanel.getComponent('conditionGrid');
        var multiAttributeConditionFieldPanel = conditionPanel.getComponent('multiAttributeConditionFieldPanel');
        result = {
            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
            conditionType: conditionType == 'AND' || conditionType == "OR" ? 'normal' : conditionType
        };
        if (conditionType == 'AND' || conditionType == 'OR') {
            result['operation'] = {
                clazz: "com.qpp.cgp.domain.executecondition.operation.LogicalOperation",
                operations: [],
                operator: conditionType
            };
            var conditionGridPanelValue = conditionGridPanel.getValue();
            var multiAttributeConditionFieldPanelValue = multiAttributeConditionFieldPanel.getValue();
            if (conditionGridPanelValue) {
                result.operation.operations = result.operation.operations.concat(conditionGridPanelValue.operation.operations);
            }
            if (multiAttributeConditionFieldPanelValue) {
                result.operation.operations = result.operation.operations.concat(multiAttributeConditionFieldPanelValue.operation.operations);
            }
        } else if (conditionType == 'custom') {
            result = customConditionPanel.getValue();
        } else {
            result = {
                clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
                conditionType: 'else'
            };
        }
        return result;

    },
    setValue: function (data) {
        var me = this;
        var conditionPanel = me.getComponent('conditionPanel');
        var conditionGridPanel = conditionPanel.getComponent('conditionGrid');
        var multiAttributeConditionFieldPanel = conditionPanel.getComponent('multiAttributeConditionFieldPanel');
        var customConditionPanel = me.getComponent('customConditionPanel');
        if (data) {
            var radioGroup = me.getComponent('radioGroup');
            if (data.conditionType == 'else') {
                radioGroup.setValue({conditionType: 'else'});
                conditionGridPanel.setValue(data);
                multiAttributeConditionFieldPanel.setValue(data);
            } else if (data.conditionType == 'custom') {
                radioGroup.setValue({conditionType: 'custom'});
                customConditionPanel.setValue(data);
            } else {
                radioGroup.setValue({conditionType: data.operation.operator});
                conditionGridPanel.setValue(data);
                multiAttributeConditionFieldPanel.setValue(data);
            }
        }
    },
    isValid: function () {
        var me = this;
        var valid = true;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.hidden != true) {
                if (item.isValid && item.isValid() == false) {
                    valid = false;
                }
            }
        }
        return valid;
    }
})
