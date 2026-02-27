/**
 * Created by nan on 2019/11/22.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.CreateOrEditConstraintRuleListDataWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 1000,
    constrain: true,
    productId: null,
    grid: null,
    record: null,
    skuAttributeStore: null,
    selectedSkuAttributeIds: null,
    createOrEdit: 'create',
    requires: [
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.ConditionFieldSet',
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.ConstraintRuleListDataFieldSet',
    ],
    controller: Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.controller.Controller'),
    bbar: [
        '->',
        {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_save',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var form = win.items.items[0];
                var constrainRuleListDataField = form.items.items[1];
                if (form.isValid() & constrainRuleListDataField.isValid() & form.items.items[0].isValid()) {
                    if (win.grid.store.getCount() > 0 && win.grid.model == 'tree') {
                        Ext.Msg.confirm(i18n.getKey('prompt'), '添加列表模式的数据将覆盖所有决策树模式数据', function (selector) {
                            if (selector == 'yes') {
                                win.grid.model = 'grid';
                                win.grid.store.removeAll();
                                var executeCondition = form.items.items[0].getValue();
                                var constrainRuleListDataField = form.items.items[1].getValue();
                                constrainRuleListDataField.executeCondition = executeCondition;
                                constrainRuleListDataField.clazz='com.qpp.cgp.domain.attributemapping.enableoption.MultiDiscreteAttributeEnableOptionMappingItem';
                                if (win.createOrEdit == 'create') {
                                    win.grid.store.add(constrainRuleListDataField);
                                } else {
                                    for (var i in constrainRuleListDataField) {
                                        win.record.set(i, constrainRuleListDataField[i]);
                                    }
                                }
                                win.close();
                            }
                        })
                    } else {
                        win.grid.model = 'grid';
                        var executeCondition = form.items.items[0].getValue();
                        var constrainRuleListDataField = form.items.items[1].getValue();
                        constrainRuleListDataField.executeCondition = executeCondition;
                        constrainRuleListDataField.clazz='com.qpp.cgp.domain.attributemapping.enableoption.MultiDiscreteAttributeEnableOptionMappingItem';
                        if (win.createOrEdit == 'create') {
                            win.grid.store.add(constrainRuleListDataField);
                        } else {
                            for (var i in constrainRuleListDataField) {
                                win.record.set(i, constrainRuleListDataField[i]);
                            }
                        }
                        win.close();
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
    refreshData: function (data) {
        if (Ext.isEmpty(data)) {
            return;
        }
        var me = this;
        if (me.rendered) {
            var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
            var constraintRuleListDataFieldSet = me.items.items[0].getComponent('constraintRuleListDataFieldSet');
            conditionFieldSet.setValue(data.executeCondition);
            constraintRuleListDataFieldSet.setValue(data)
        } else {
            me.on('afterrender', function () {
                    var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
                    var constraintRuleListDataFieldSet = me.items.items[0].getComponent('constraintRuleListDataFieldSet');
                    conditionFieldSet.setValue(data.executeCondition);
                    constraintRuleListDataFieldSet.setValue(data)
                },
                me,
                {
                    single: true
                })
        }
    },
    initComponent: function () {
        var me = this;
        me.title = '列表形式添加约束规则';
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
                    }, {
                        xtype: 'constraintRuleListDataFieldSet',
                        title: i18n.getKey('属性组合列表'),
                        itemId: 'constraintRuleListDataFieldSet',
                        productId: me.productId,
                        selectedSkuAttributeIds: me.selectedSkuAttributeIds,
                        skuAttributeStore: me.skuAttributeStore
                    }
                ]
            }
        ];
        me.callParent();
    },
})
