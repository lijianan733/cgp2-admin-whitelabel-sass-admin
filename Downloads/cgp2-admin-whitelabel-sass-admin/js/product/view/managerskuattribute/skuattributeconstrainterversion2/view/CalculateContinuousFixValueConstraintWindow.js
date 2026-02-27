/**
 * Created by nan on 2019/10/30.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateContinuousFixValueConstraintWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 1000,
    constrain: true,
    record: null,
    productId: null,
    skuAttribute: null,
    skuAttributeId: null,
    grid: null,
    createOrEdit: 'create',
    requires: [
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.ConditionFieldSet',
        'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.OnlyCurrentAttributeConfigFieldSet'
    ],
    isLock: false,
    controller: Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.controller.Controller'),
    refreshData: function (data) {
        if (Ext.isEmpty(data)) {
            return;
        }
        var me = this;
        if (me.rendered) {
            var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
            var configFieldSetOnlyCurrentAttribute = me.items.items[0].getComponent('configFieldSetOnlyCurrentAttribute');
            conditionFieldSet.setValue(data.executeCondition);
            configFieldSetOnlyCurrentAttribute.setValue(data)
        } else {
            me.on('afterrender', function () {
                    var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
                    var configFieldSetOnlyCurrentAttribute = me.items.items[0].getComponent('configFieldSetOnlyCurrentAttribute');
                    conditionFieldSet.setValue(data.executeCondition);
                    configFieldSetOnlyCurrentAttribute.setValue(data)
                },
                me,
                {
                    single: true
                })
        }
    },
    initComponent: function () {
        var me = this;
        me.title = 'sku属性(' + me.skuAttributeId + ')' + i18n.getKey('范围约束(固定值)');
        me.items = [
            {
                xtype: 'form',
                border: false,
                items: [
                    {
                        xtype: 'conditionfieldset',
                        title: i18n.getKey('condition'),
                        itemId: 'conditionFieldSet',
                        productId: me.productId,
                        tipText: '提示信息aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nasdfasdfas',
                    },
                    {
                        xtype: 'configfieldsetonlycurrentattribute',
                        title: '配置信息',
                        itemId: 'configFieldSetOnlyCurrentAttribute',
                        productId: me.productId,
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
                        console.log(singleAttributeConstraint);
                        var data = singleAttributeConstraint;
                        win.controller.createOrEditCalculateContinuousConstraint(singleAttributeConstraint, win.createOrEdit, win.record, win.grid, win);
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
