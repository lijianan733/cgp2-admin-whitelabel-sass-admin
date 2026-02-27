/**
 * Created by nan on 2019/11/22.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.CreateOrEditConstraintRuleDecisionTreeDataWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 1000,
    constrain: true,
    record: null,
    productId: null,
    skuAttributeId: null,
    grid: null,
    createOrEdit: 'create',
    selectedSkuAttributeIds: null,
    skuAttributeStore: null,
    requires: [
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.ConstraintRuleDecisionTreeDataFieldSet',
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.ConditionFieldSet'
    ],
    controller: Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.controller.Controller'),
    refreshData: function (data) {
        if (Ext.isEmpty(data)) {
            return;
        }
        var me = this;
        if (me.rendered) {
            var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
            var constraintRuleDecisionTreeDataFieldSet = me.items.items[0].getComponent('constraintRuleDecisionTreeDataFieldSet');
            conditionFieldSet.setValue(data.executeCondition);
            constraintRuleDecisionTreeDataFieldSet.setValue(data)
        } else {
            me.on('afterrender', function () {
                    var conditionFieldSet = me.items.items[0].getComponent('conditionFieldSet');
                    var constraintRuleDecisionTreeDataFieldSet = me.items.items[0].getComponent('constraintRuleDecisionTreeDataFieldSet');
                    conditionFieldSet.setValue(data.executeCondition);
                    constraintRuleDecisionTreeDataFieldSet.setValue(data)
                },
                me,
                {
                    single: true
                })
        }
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('决策树形式添加约束规则');
        var attributeArray = [];
        for (var i = 0; i < me.skuAttributeStore.data.items.length; i++) {
            var item = me.skuAttributeStore.data.items[i];
            if (Ext.Array.contains(me.selectedSkuAttributeIds, item.getId())) {
                attributeArray.push(item.getData());
            }
        }
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
                        xtype: 'constraintRuleDecisionTreeDataFieldSet',
                        title: '属性组合决策树',
                        itemId: 'constraintRuleDecisionTreeDataFieldSet',
                        attributeArray: attributeArray,
                    }
                ]
            }
        ];
        me.callParent();
    },
    bbar: [
        '->',
        {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var form = win.items.items[0];
                var constraintRuleDecisionTreeDataFieldSet = form.items.items[1];
                if (form.isValid() & form.items.items[0].isValid()) {
                    if (win.grid.store.getCount() && win.grid.model == 'grid') {
                        Ext.Msg.confirm(i18n.getKey('prompt'), '添加决策树模式的数据将覆盖所有列表模式数据', function (selector) {
                            if (selector == 'yes') {
                                win.grid.model = 'tree';
                                win.grid.store.removeAll();
                                var executeCondition = form.items.items[0].getValue();
                                var constrainRuleTreeData = constraintRuleDecisionTreeDataFieldSet.getValue();
                                constrainRuleTreeData.executeCondition = executeCondition;
                                constrainRuleTreeData.clazz='com.qpp.cgp.domain.attributemapping.enableoption.MultiDiscreteAttributeEnableOptionMappingItem';
                                if (win.createOrEdit == 'create') {
                                    win.grid.store.add(constrainRuleTreeData);
                                } else {
                                    for (var i in constrainRuleTreeData) {
                                        win.record.set(i, constrainRuleTreeData[i]);
                                    }
                                }
                                win.close();
                            }
                        })
                    } else {
                        win.grid.model = 'tree';
                        var executeCondition = form.items.items[0].getValue();
                        var constrainRuleTreeData = constraintRuleDecisionTreeDataFieldSet.getValue();
                        constrainRuleTreeData.executeCondition = executeCondition;
                        constrainRuleTreeData.clazz='com.qpp.cgp.domain.attributemapping.enableoption.MultiDiscreteAttributeEnableOptionMappingItem';
                        if (win.createOrEdit == 'create') {
                            win.grid.store.add(constrainRuleTreeData);
                        } else {
                            for (var i in constrainRuleTreeData) {
                                win.record.set(i, constrainRuleTreeData[i]);
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
    ]
})
