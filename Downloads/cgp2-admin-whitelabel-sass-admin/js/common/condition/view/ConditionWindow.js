/**
 * Created by nan on 2021/3/31
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionFieldContainer'
])
Ext.define('CGP.common.condition.view.ConditionWindow', {
    extend: 'Ext.window.Window',
    constrain: true,
    modal: true,
    maximizable: true,
    title: i18n.getKey('condition'),
    extraParams: null,
    checkOnly: false,
    allowElse: false,
    valueType: 'valueEx',//valueEx,和expression两种类型的返回值
    contentAttributeStore: null,//自己按照指定格式生成的上下文store
    rtAttributeStore: null,//用户参数属性store
    contentData: null,//标准格式的上下文数据
    conditionFieldV3: null,//外围的conditionFieldV3组件
    conditionFieldContainerConfig: null,
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.conditionFieldV3.conditionDTO) {
                me.setValue(me.conditionFieldV3.conditionDTO);
            }
        }
    },
    layout: {
        type: 'fit',
    },
    contentTemplate: null,
    functionTemplate: null,
    initComponent: function () {
        var me = this;
        me.items = [Ext.Object.merge({
            xtype: 'conditionfieldcontainer',
            fieldLabel: null,
            allowElse: me.allowElse,
            valueType: me.valueType,//valueEx,和expression两种类型的返回值
            contentData: me.contentData,
            contentTemplate: me.contentTemplate,
            functionTemplate: me.functionTemplate,
            contentAttributeStore: me.contentAttributeStore,
        }, me.conditionFieldContainerConfig)];
        me.bbar = {
            disabled: me.checkOnly,
            items: [
                {
                    xtype: 'button',
                    text: '<font color="red">' + i18n.getKey('测试运行') + '</font>',
                    iconCls: 'icon_test',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        if (win.isValid()) {
                            var conditionDTO = win.getValue();
                            if (conditionDTO) {
                                var expressionData = null;
                                var controller = Ext.create('CGP.common.condition.controller.Controller',{
                                    contentAttributeStore: me.contentAttributeStore,
                                });
                                var valueEx = controller.conditionDTOToDomain('expression', conditionDTO);
                                if (valueEx.clazz == 'com.qpp.cgp.expression.Expression') {
                                    expressionData = valueEx;
                                } else {
                                    expressionData = valueEx.expression;
                                }
                                JSValidValueEx(expressionData, {});
                            }
                        }
                    }
                },
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        if (win.isValid()) {
                            console.log(win.getValue());
                            win.conditionFieldV3.conditionDTO = win.getValue();
                            win.close();
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }
            ]
        };
        me.callParent();
    },
    getValue: function () {
        var me = this;
        return me.items.items[0].getValue();
    },
    setValue: function (data) {
        var me = this;
        return me.items.items[0].setValue(data);
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
        return me.items.items[0].isValid();
    }
})
