/**
 * Created by nan on 2019/10/24.
 * 映射属性规则有多属性表达式
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.AttributeMappingRuleConditionFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    productId: null,
    leftAttributes: null,//输入属性
    checkOnly: false,//是否只查看
    haveElse: true,
    inputModel: 'MULTI',//MULTI代表有复杂输入，SIMPLE代表仅有简单输入
    initComponent: function () {
        var me = this;
        var leftAttributes = [];
        for (var i in me.leftAttributes) {
            leftAttributes.push(me.leftAttributes[i]);
        }
        var conditionGridPanel = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.ConditionGridPanel', {
            title: i18n.getKey('简单条件'),
            itemId: 'conditionGridPanel',
            checkOnly: me.checkOnly,
            hideConditionModel: true,
            productId: me.productId,
            minHeight: 100,
        });
        var multiConditionFieldPanel = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.MultiAttributeConditionFieldPanel', {
            title: i18n.getKey('复杂条件'),
            hideConditionModel: true,
            checkOnly: me.checkOnly,
            hidden: me.inputModel != 'MULTI',
            itemId: 'multiAttributeConditionFieldPanel',
            productId: me.productId
        });
        var customConditionPanel = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.CustomConditionPanel', {
            title: i18n.getKey('自定义执行条件'),
            hideConditionModel: true,
            checkOnly: me.checkOnly,
            hidden: me.inputModel != 'custom',
            disabled: me.inputModel != 'custom',
            itemId: 'customConditionPanel',
            productId: me.productId
        });
        me.items = [
            {
                xtype: 'radiogroup',
                width: 600,
                padding: '5 5 5 20',
                fieldLabel: i18n.getKey('执行机制'),
                itemId: 'radioGroup',
                items: [
                    {
                        boxLabel: '满足以下所有条件',
                        name: 'conditionType',
                        readOnly: me.checkOnly,
                        inputValue: 'AND',
                        checked: true
                    },
                    {boxLabel: '满足以下任一条件', name: 'conditionType', readOnly: me.checkOnly, inputValue: 'OR'},
                    {
                        boxLabel: '其他条件都不成立时执行',
                        name: 'conditionType',
                        readOnly: me.checkOnly,
                        inputValue: 'else',
                        disabled: !me.haveElse
                    },
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
                padding: 15,
                itemId: 'conditionPanel',
                layout: {
                    type: 'accordion',
                    titleCollapse: true,
                    animate: true,
                    multi: true,
                    activeOnTop: false
                },
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
                items: [
                    conditionGridPanel,
                    multiConditionFieldPanel,
                ]
            },
            customConditionPanel
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var radioGroup = me.getComponent('radioGroup');
        var conditionType = radioGroup.getValue().conditionType;
        var result = {
            clazz: "com.qpp.cgp.domain.executecondition.InputCondition",
            conditionType: conditionType == 'else' ? 'else' : 'normal'
        };
        var conditionPanel = me.getComponent('conditionPanel');
        var customConditionPanel = me.getComponent('customConditionPanel');
        var conditionGridPanel = conditionPanel.getComponent('conditionGridPanel');
        var multiAttributeConditionFieldPanel = conditionPanel.getComponent('multiAttributeConditionFieldPanel');
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
        console.log(result);
        return result;

    },
    setValue: function (data) {
        var me = this;
        var conditionPanel = me.getComponent('conditionPanel');
        var customConditionPanel = me.getComponent('customConditionPanel');
        if (data) {
            var radioGroup = me.getComponent('radioGroup');
            var conditionGridPanel = conditionPanel.getComponent('conditionGridPanel');
            var multiAttributeConditionFieldPanel = conditionPanel.getComponent('multiAttributeConditionFieldPanel');
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
