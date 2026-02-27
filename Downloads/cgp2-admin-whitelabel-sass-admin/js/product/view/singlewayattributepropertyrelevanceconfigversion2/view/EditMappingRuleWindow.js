/**
 * Created by nan on 2019/10/31.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.EditMappingRuleWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    requires: ['CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.AttributeMappingRuleConditionFieldSet',
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ConstraintOfAttributePropertyArrayFieldSet'],
    constrain: true,
    layout: 'fit',
    itemId: 'editMappingRuleWindow',
    rightAttributes: null,//输出属性
    leftAttributes: null,//输入属性
    grid: null,
    createOrEdit: null,
    isCanAddOrDelete: true,//是否可以对被影响属性中属性的property进行编辑和添加
    record: null,
    title: i18n.getKey('被影响属性变化规则'),
    bbar: [
        '->',
        {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_save',
            handler: function (btn) {
                var form = btn.ownerCt.ownerCt.getComponent('form');
                var win = form.ownerCt;
                var attributeMappingRuleFieldSet = form.getComponent('attributeMappingRuleFieldSet');
                if (form.isValid() && attributeMappingRuleFieldSet.isValid()) {//两个都运行
                    var attr = win.getValue();
                    var conditionType;
                    if (attr.input) {
                        conditionType = attr.input.conditionType;
                    } else {
                        conditionType = null;
                    }
                    if (win.createOrEdit == 'create') {
                        if (conditionType == 'else' && win.grid.elseConditionRuleRecord) {
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('已经存在一条其他条件都不成立时执行的规则了,是否覆盖旧的规则？'), function (selector) {
                                if (selector == 'yes') {
                                    win.grid.store.proxy.data[win.grid.elseConditionRuleRecord.index] = attr;
                                    win.grid.store.load();
                                    win.close();
                                }
                            })
                        } else {
                            win.grid.store.proxy.data.push(attr);
                            win.grid.store.load();
                            win.close();
                        }
                    } else {
                        if (conditionType == 'else' && win.grid.elseConditionRuleRecord && win.grid.elseConditionRuleRecord.index != win.record.index) {
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('已经存在一条其他条件都不成立时执行的规则了,是否覆盖旧的规则？'), function (selector) {
                                if (selector == 'yes') {
                                    win.grid.store.proxy.data[win.grid.elseConditionRuleRecord.index] = attr;
                                    win.grid.store.proxy.data.splice(win.record.index, 1);
                                    win.grid.store.load();
                                    win.close();
                                }
                            })
                        } else {
                            win.grid.store.proxy.data[win.record.index] = attr;
                            win.grid.store.load();
                            win.close();
                        }
                    }
                }
            }
        },
        {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function (btn) {
                btn.ownerCt.ownerCt.close();
            }
        }
    ],
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                width: 1120,
                height: 700,
                autoScroll: true,
                items: [
                    {
                        xtype: 'textfield',
                        itemId: 'description',
                        name: 'description',
                        fieldLabel: i18n.getKey('description'),
                        margin: '10 50 10 50',
                        width: 450
                    },

                    Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.AttributeMappingRuleConditionFieldSet', {
                        title: i18n.getKey('执行规则的前提条件'),
                        itemId: 'attributeMappingRuleFieldSet',
                        name: 'input',
                        productId: me.productId,
                        leftAttributes: me.leftAttributes,
                        width: 1000
                    }),
                    Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ConstraintOfAttributePropertyArrayFieldSet', {
                        title: i18n.getKey('被影响属性'),
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        width: 1000,
                        productId: me.productId,
                        isCanAddOrDelete: me.isCanAddOrDelete,
                        itemId: 'effectedAttributesFieldSet',
                        name: 'outputs',
                        rightAttributes: me.rightAttributes
                    })
                ]
            }
        ];
        me.callParent();
        if (me.record) {
            me.setValue(me.record.data);
        }
    },
    setValue: function (data) {
        var me = this;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        me.data = data;
        var items = me.down('form').items.items;
        for (var item of items) {
            item.setValue(data[item.name]);
        }
    }
    ,
    getValue: function () {
        var me = this;
        var data = me.data || {};
        var items = me.down('form').items.items;
        for (var item of items) {
            data[item.name] = item.getValue();
        }
        return data;
    }
})
