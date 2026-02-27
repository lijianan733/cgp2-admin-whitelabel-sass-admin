/**
 * Created by nan on 2019/10/30.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateContinuousAttributeValueConstraintWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 1000,
    constrain: true,
    record: null,
    productId: null,
    createOrEdit: 'create',
    grid: null,
    skuAttribute: null,
    skuAttributeId: null,
    controller: Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.controller.Controller'),
    requires: [
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.ConditionFieldSet',
        'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.UseOtherAttributeConfigFieldSet'
    ],
    isLock: false,
    refreshData: function (data) {
        if (Ext.isEmpty(data)) {
            return;
        }
        var me = this;
        if (me.rendered) {
            var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
            var configfieldsetwithotherattribute = me.items.items[0].getComponent('configfieldsetwithotherattribute');
            conditionFieldSet.setValue(data.executeCondition);
            configfieldsetwithotherattribute.setValue(data)
        } else {
            me.on('afterrender', function () {
                    var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
                    var configfieldsetwithotherattribute = me.items.items[0].getComponent('configfieldsetwithotherattribute');
                    conditionFieldSet.setValue(data.executeCondition);
                    configfieldsetwithotherattribute.setValue(data)
                },
                me,
                {
                    single: true
                })
        }
    },
    initComponent: function () {
        var me = this;
        me.title = 'sku属性(' + me.skuAttributeId + ')' + i18n.getKey('范围约束(受其他属性影响)');
        me.items = [
            {
                xtype: 'form',
                border: false,
                items: [
                    {
                        xtype: 'conditionfieldset',
                        title: i18n.getKey('condition'),
                        itemId: 'conditionFieldSet',
                        productId: me.productId
                    },
                    {
                        xtype: 'configfieldsetwithotherattribute',
                        title: '配置信息',
                        itemId: 'configfieldsetwithotherattribute',
                        productId: me.productId,
                        createOrEdit: me.createOrEdit,
                        skuAttributeId: me.skuAttributeId
                    }
                ]
            }
        ];
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_save',
                disabled: me.isLock,
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var form = win.items.items[0];
                    if (form.isValid() & form.items.items[0].isValid()) {
                        var executeCondition = form.items.items[0].getValue();
                        var singleAttributeConstraint = form.items.items[1].getValue();
                        singleAttributeConstraint.executeCondition = executeCondition;
                        var data = singleAttributeConstraint;
                        console.log(data);
                        win.controller.createOrEditCalculateContinuousConstraint(singleAttributeConstraint, win.createOrEdit, win.record, win.grid, win);
                        if (data.isCreateA) {//同时创建a属性的约束,当前只出来不包含[]，（],类型的情况
                            var old = data.skuAttributeId;
                            data.skuAttributeId = data.minSkuAttributeId;
                            data.minSkuAttributeId = old;
                            data.minSkuAttribute = null;
                            if (data.operator == '>') {
                                data.operator = '<'
                            } else if (data.operator == '>=') {
                                data.operator = '<='

                            } else if (data.operator == '<') {
                                data.operator = '>'

                            } else if (data.operator == '<=') {
                                data.operator = '>='
                            }
                            win.controller.createOrEditCalculateContinuousConstraint(singleAttributeConstraint, win.createOrEdit, null, win.grid, win);
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
        ];
        me.callParent();
    },
})
