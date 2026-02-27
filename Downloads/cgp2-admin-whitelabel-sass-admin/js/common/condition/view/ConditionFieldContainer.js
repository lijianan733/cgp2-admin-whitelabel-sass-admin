/**
 * Created by nan on 2021/10/16
 * 单独组件,没和其他组件有关联，优先使用
 *  layout: 'vbox',外围组件必须指明为vbox，使用auto会导致自定义显示失败
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionGrid',
    'CGP.common.condition.view.ConditionQtyGrid',
    'CGP.common.condition.view.ConditionMultiAttributeFieldPanel',
    'CGP.common.condition.view.CustomConditionPanel'
])
Ext.define('CGP.common.condition.view.ConditionFieldContainer', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.conditionfieldcontainer',
    fieldLabel: i18n.getKey('condition'),
    extraParams: null,
    flex: 1,
    width: '100%',
    height: '100%',
    allowBlank: true,
    valueType: 'valueEx',//valueEx,和expression两种类型的返回值
    contentAttributeStore: null,//自己按照指定格式生成的上下文store
    contentData: null,//标准格式的上下文数据
    rawData: null,
    contentTemplate: null,
    functionTemplate: null,
    leftValue: null,
    layout: 'vbox',
    allowElse: false,//默认不使用else选项
    defaults: {
        labelAlign: 'left',
        labelWidth: 100,
        msgTarget: 'side',
        width: '100%',
        validateOnChange: false,
        allowBlank: false
    },
    customConditionPanelConfig: null,//自定义条件的配置
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.rawData) {
                me.setValue(me.rawData);
            }
        }
    },
    /**
     * @property {object} conditionPanelItems
     * {
     *     simpleConditionGrid:{},
     *     multiAttributeConditionGridPanel:{},
     *     qtyConditionGridPanel:{}
     * }
     * itemId不要改变，有使用该itemId获取组件的代码
     * 如果没专门配置单独的contentAttributeStore，就使用全局的contentAttributeStore,
     * 默认不显示数量条件
     */
    conditionPanelItems: null,
    initComponent: function () {
        var me = this;
        me.contentAttributeStore = me.contentAttributeStore ||
            Ext.StoreManager.get('contentAttributeStore') ||
            Ext.create('CGP.common.condition.store.ContentAttributeStore', {
                storeId: 'contentAttributeStore',
                data: me.contentData
            });
        me.conditionPanelItems = me.conditionPanelItems || {};
        me.conditionPanelItems.simpleConditionGrid = Ext.Object.merge({
            xtype: 'conditiongrid',
            title: i18n.getKey('简单条件'),
            hideConditionModel: true,
            collapsed: false,
            contentAttributeStore: me.contentAttributeStore,
            itemId: 'simpleConditionGrid',
            checkOnly: me.checkOnly,
            leftValue: me.leftValue,
        }, me.conditionPanelItems.simpleConditionGrid);
        me.conditionPanelItems.multiAttributeConditionGridPanel = Ext.Object.merge({
            xtype: 'multiattributeconditiongridpanel',
            width: '100%',
            title: i18n.getKey('复杂条件'),
            extraParams: me.extraParams,
            itemId: 'multiAttributeConditionGridPanel',
            contentAttributeStore: me.contentAttributeStore,
            checkOnly: me.checkOnly,
            hideConditionModel: true
        }, me.conditionPanelItems.multiAttributeConditionGridPanel);
        me.conditionPanelItems.qtyConditionGridPanel = Ext.Object.merge({
            xtype: 'conditionqtygrid',
            title: i18n.getKey('数量条件'),
            hideConditionModel: true,
            height: '100%',
            hidden: true,
            contentAttributeStore: me.contentAttributeStore,
            itemId: 'qtyConditionGridPanel',
            checkOnly: me.checkOnly,
        }, me.conditionPanelItems.qtyConditionGridPanel);
        var customConditionPanel = Ext.Object.merge(
            {
                xtype: 'customconditionpanel',
                title: i18n.getKey('自定义执行条件'),
                hideConditionModel: true,
                checkOnly: me.checkOnly,
                width: '100%',
                height: '100%',
                flex: 2,
                contentTemplate: me.contentTemplate,
                functionTemplate: me.functionTemplate,
                contentAttributeStore: me.contentAttributeStore,
                hidden: me.inputModel != 'custom',
                itemId: 'customConditionPanel',
            }, me.customConditionPanelConfig);
        var conditionPanelItems = [];
        for (var i in me.conditionPanelItems) {
            conditionPanelItems.push(me.conditionPanelItems[i]);
        }
        me.items = [
            {
                xtype: 'radiogroup',
                fieldLabel: i18n.getKey('执行机制'),
                itemId: 'radioGroup',
                margin: '0 25 0 15',
                defaults: {
                    flex: 1,
                },
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
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
                        boxLabel: 'Else(其他情况)',
                        name: 'conditionType',
                        readOnly: me.checkOnly,
                        inputValue: 'else',
                        hidden: !me.allowElse
                    },
                    {boxLabel: '自定义执行条件', name: 'conditionType', readOnly: me.checkOnly, inputValue: 'custom'},

                ],
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var conditionPanel = field.ownerCt.getComponent('conditionPanel');
                        conditionPanel.suspendLayouts();
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
                        conditionPanel.resumeLayouts();
                        conditionPanel.doLayout();
                    }
                }
            },
            {
                xtype: 'panel',
                itemId: 'conditionPanel',
                width: '100%',
                flex: 2,
                bodyStyle: {
                    borderColor: '#ffffff'
                },
                style: {
                    borderColor: 'silver',
                    borderStyle: 'solid',
                    borderWidth: '1px'
                },
                layout: {
                    type: 'accordion',
                    titleCollapse: true,
                    animate: true,
                    multi: false,
                    activeOnTop: false
                },
                defaults: {
                    collapsed: true,
                },
                items: conditionPanelItems,
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
                }
            },
            customConditionPanel
        ];
        me.controller = me.controller || Ext.create('CGP.common.condition.controller.Controller');
        me.controller.contentAttributeStore = me.contentAttributeStore;
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        var result = {};
        var radioGroup = me.getComponent('radioGroup');
        var conditionPanel = me.getComponent('conditionPanel');
        var conditionType = radioGroup.getValue().conditionType;
        var customConditionPanel = me.getComponent('customConditionPanel');
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
            conditionPanel.items.items.forEach(function (item) {
                var itemValue = item.getValue();
                if (itemValue) {
                    result.operation.operations = result.operation.operations.concat(itemValue.operation.operations);
                }
            })
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
        if (result) {
            result.type = result.conditionType;
        }
        return result;
    },
    setValue: function (data) {
        var me = this;
        var conditionPanel = me.getComponent('conditionPanel');
        var customConditionPanel = me.getComponent('customConditionPanel');
        if (data) {
            //给conditionPanel赋值
            var conditionSetValue = function (data) {
                conditionPanel.items.items.forEach(function (item) {
                    item.setValue(data);
                });
            }
            var radioGroup = me.getComponent('radioGroup');
            if (data.conditionType == 'else') {
                radioGroup.setValue({conditionType: 'else'});
                conditionSetValue(data);
            } else if (data.conditionType == 'custom') {
                radioGroup.setValue({conditionType: 'custom'});
                customConditionPanel.setValue(data);
            } else {
                radioGroup.setValue({conditionType: data.operation.operator});
                conditionSetValue(data);
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
                        me.Errors = '配置必须完备';
                    }
                }
            }
            return valid;
        }
    },
    getExpression: function () {
        var me = this;
        var conditionDTO = me.getValue();
        //空的条件
        if (Ext.isEmpty(conditionDTO)) {
            return null;
        } else {
            return me.controller.conditionDTOToDomain(me.valueType, conditionDTO);
        }
    },
    renderActiveError: function (valid) {
        var me = this;
        if (me.items.items[1].hidden == false) {
            me.items.items[1].el.dom.style.borderColor = (valid ? 'silver' : 'red');
        }
        if (me.items.items[2].hidden == false) {
            me.items.items[2].el.dom.style.borderColor = (valid ? 'silver' : 'red');
        }
    },
})
