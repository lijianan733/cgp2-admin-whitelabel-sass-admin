/**
 * Created by nan on 2019/11/6.
 * 单属性离散值约束，即选项约束
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.SingleAttributeDiscreteValueConstraintWindow', {
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
        'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.AttributeOptionsConfigFieldSet'
    ],
    isLock: false,
    refreshData: function (data) {
        var me = this;
        if (Ext.isEmpty(data)) {
            return;
        }
        me.setLoading(true);
        me.suspendLayouts();
        var setValue = function () {
            var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
            var attributeOptionsConfigFieldSet = me.items.items[0].getComponent('attributeOptionsConfigFieldSet');
            conditionFieldSet.setValue(data.executeCondition);
            attributeOptionsConfigFieldSet.setValue(data);
            me.resumeLayouts();
            me.doLayout();
            setTimeout(function () {
                me.setLoading(false);
            }, 2000);
        };
        if (me.rendered) {
            setValue();
        } else {
            me.on('afterrender', setValue, me, {
                single: true
            })
        }
    },
    initComponent: function () {
        var me = this;
        me.title = 'sku属性(' + me.skuAttributeId + ')' + i18n.getKey('选项约束');
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
                        xtype: 'attributeoptionsconfigfieldset',
                        title: '配置信息',
                        itemId: 'attributeOptionsConfigFieldSet',
                        productId: me.productId,
                        skuAttribute: me.skuAttribute,
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
