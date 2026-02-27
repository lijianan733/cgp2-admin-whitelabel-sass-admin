/**
 * Created by nan on 2021/3/31，
 * 已废弃，不再维护，新的请使用ConditionFieldContainer,
 */
Ext.define('CGP.common.condition.view.ConditionContainer', {
    extend: 'Ext.form.Panel',
    title: i18n.getKey('condition'),
    constrain: true,
    modal: true,
    checkOnly: false,
    defaults: {
        labelAlign: 'left',
        labelWidth: 100,
        margin: '5',
        msgTarget: 'side',
        validateOnChange: false,
        allowBlank: false
    },
    extraParams: null,
    valueType: 'valueEx',//valueEx,和expression两种类型的返回值
    contentAttributeStore: null,//自己按照指定格式生成的上下文store
    contentData: null,//标准格式的上下文数据
    conditionFieldV3: null,
    contentTemplate: null,
    functionTemplate: null,
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.conditionFieldV3?.conditionDTO) {
                me.setValue(me.conditionFieldV3?.conditionDTO);
            }
        }
    },
    layout: {
        type: 'vbox',
    },

    initComponent: function () {
        var me = this;
        var multiConditionFieldPanel = Ext.create('CGP.common.condition.view.ConditionMultiAttributeFieldPanel', {
            width: '100%',
            title: i18n.getKey('复杂条件'),
            extraParams: me.extraParams,
            itemId: 'multiAttributeConditionGridPanel',
            contentAttributeStore: me.contentAttributeStore,
            checkOnly: me.checkOnly,
            hideConditionModel: true
        });
        var conditionGridPanel = Ext.create('CGP.common.condition.view.ConditionGrid', {
            title: i18n.getKey('简单条件'),
            hideConditionModel: true,
            contentAttributeStore: me.contentAttributeStore,
            itemId: 'conditionGrid',
            checkOnly: me.checkOnly,
        });
        var customConditionPanel = Ext.create('CGP.common.condition.view.CustomConditionPanel', {
            title: i18n.getKey('自定义执行条件'),
            hideConditionModel: true,
            checkOnly: me.checkOnly,
            hidden: me.inputModel != 'custom',
            itemId: 'customConditionPanel',
            width: '100%',
            flex: 1,
        });
        me.items = [
            {
                xtype: 'radiogroup',
                width: 750,
                fieldLabel: i18n.getKey('执行机制'),
                itemId: 'radioGroup',
                labelWidth: 100,
                items: [
                    {
                        boxLabel: '满足以下所有条件',
                        name: 'conditionType',
                        readOnly: me.checkOnly,
                        inputValue: 'AND',
                        checked: true
                    },
                    {boxLabel: '满足以下任一条件', name: 'conditionType', readOnly: me.checkOnly, inputValue: 'OR'},
                    /*
                                        {boxLabel: '其他条件都不成立时执行', name: 'conditionType', readOnly: me.checkOnly, inputValue: 'else'},
                    */
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
                    borderColor: 'silver',
                },
                width: '100%',
                flex: 2,
                border: 0,
                itemId: 'conditionPanel',
                isValid: function () {
                    var me = this;
                    var isValid = true;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.isValid() == false) {
                            isValid = false;
                            item.expand();
                            break;
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
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        var result = {};
        var radioGroup = me.getComponent('radioGroup');
        var conditionPanel = me.getComponent('conditionPanel');
        var conditionType = radioGroup.getValue().conditionType;
        var customConditionPanel = me.getComponent('customConditionPanel');
        var conditionGridPanel = conditionPanel.getComponent('conditionGrid');
        var multiAttributeConditionGridPanel = conditionPanel.getComponent('multiAttributeConditionGridPanel');
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
            var multiAttributeConditionFieldPanelValue = multiAttributeConditionGridPanel.getValue();
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
        if (result.operation) {
            if (result.operation.clazz == "com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation") {
                if (Ext.isEmpty(result.operation.expression)) {
                    return null;
                }

            } else {
                if (result.operation.operations.length == 0) {
                    return null;
                }
            }
        }
        return result;

    },
    setValue: function (data) {
        var me = this;
        var conditionPanel = me.getComponent('conditionPanel');
        var conditionGridPanel = conditionPanel.getComponent('conditionGrid');
        var multiAttributeConditionGridPanel = conditionPanel.getComponent('multiAttributeConditionGridPanel');
        var customConditionPanel = me.getComponent('customConditionPanel');
        if (data) {
            var radioGroup = me.getComponent('radioGroup');
            if (data.conditionType == 'else') {
                radioGroup.setValue({conditionType: 'else'});
                conditionGridPanel.setValue(data);
                multiAttributeConditionGridPanel.setValue(data);
            } else if (data.conditionType == 'custom') {
                radioGroup.setValue({conditionType: 'custom'});
                customConditionPanel.setValue(data);
            } else {
                radioGroup.setValue({conditionType: data.operation.operator});
                conditionGridPanel.setValue(data);
                multiAttributeConditionGridPanel.setValue(data);
            }
        }
    },
    getErrors: function () {
        var me = this;
        return me.Errors;
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        var me = this;
        var valid = true;
        if (me.disabled == true) {
            return true;
        } else {
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
    },

})
