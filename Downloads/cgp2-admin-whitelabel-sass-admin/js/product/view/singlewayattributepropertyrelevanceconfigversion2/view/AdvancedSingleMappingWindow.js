/**
 * Created by nan on 2019/10/28.
 * 单向属性映射的高级配置的弹窗
 *
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AdvancedSingleMappingWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('条件单向属性映射'),
    productId: null,
    modal: true,
    constrain: true,
    createOrEdit: null,
    grid: null,
    layout: 'fit',
    record: null,
    skuAttributeStore: null,
    controller: Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller'),
    requires: [
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.ConditionFieldSet',
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.BaseConfigOfAttributeMappingFieldSet',
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.MappingRuleGridFieldSet'
    ],
    refreshData: function (data) {
        var me = this;
        if (Ext.isEmpty(data)) {
            return;
        }
        var form = me.getComponent('form');
        var conditionFieldSet = form.getComponent('conditionFieldSet');
        var baseConfigOfAttributeMappingFieldSet = form.getComponent('baseConfigOfAttributeMappingFieldSet');
        var mappingRuleGridFieldSet = form.getComponent('mappingRuleGridFieldSet');
        me.setLoading(true);
        me.suspendLayouts();
        var setValue = function () {
            conditionFieldSet.setValue(data.executeCondition);
            baseConfigOfAttributeMappingFieldSet.setValue(data);
            mappingRuleGridFieldSet.setValue(data.mappingRules);
            me.resumeLayouts();
            me.doLayout();
            setTimeout(function () {
                me.setLoading(false);
            }, 2000);
        };
        if (me.rendered) {
            setValue();

        } else {
            me.on('afterrender', setValue,
                me,
                {
                    single: true
                })
        }
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                border: false,
                scroll: 'vertical',
                bodyStyle: 'overflow-x:hidden;overflow-y:auto',
                maxHeight: 600,
                items: [
                    {
                        xtype: 'conditionfieldset',
                        title: i18n.getKey('映射运行条件'),
                        width: 900,
                        itemId: 'conditionFieldSet',
                        margin: '20 50 20 50',
                        productId: me.productId,
                        tipText: '提示信息',
                    },
                    Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.BaseConfigOfAttributeMappingFieldSet', {
                        title: i18n.getKey('映射基本配置'),
                        width: 900,
                        margin: '20 50 25 50',
                        height: 245,
                        record: me.record,
                        skuAttributeStore: me.skuAttributeStore,
                        itemId: 'baseConfigOfAttributeMappingFieldSet',
                        productId: me.productId,
                        listeners: {
                            afterrender: function () {
                                var me = this;
                                var mappingRuleGridFieldSet = me.ownerCt.getComponent('mappingRuleGridFieldSet');
                                var outSkuAttributes = me.getComponent('outSkuAttributeIds');
                                outSkuAttributes.on('change', function (field, newValue, oldValue) {
                                    if (!Ext.Object.isEmpty(newValue)) {
                                        mappingRuleGridFieldSet.show();
                                        mappingRuleGridFieldSet.setDisabled(false);
                                    }
                                })
                            }
                        }
                    }),
                    Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.MappingRuleGridFieldSet', {
                        title: i18n.getKey('规则列表'),
                        width: 900,
                        margin: '0 50 25 50',
                        hidden: true,
                        disabled: true,
                        itemId: 'mappingRuleGridFieldSet',
                        skuAttributeStore: me.skuAttributeStore,
                        productId: me.productId,
                        tipText: '提示信息',
                        listeners: {
                            afterrender: function () {
                                var me = this;
                                var baseConfigOfAttributeMappingFieldSet = me.ownerCt.getComponent('baseConfigOfAttributeMappingFieldSet');
                                var outSkuAttributes = baseConfigOfAttributeMappingFieldSet.getComponent('outSkuAttributeIds');
                                var inSkuAttributes = baseConfigOfAttributeMappingFieldSet.getComponent('inSkuAttributeIds');
                                var mappingRuleGrid = me.items.items[0];
                                var mappingRuleGridStore = me.items.items[0].store;
                                mappingRuleGridStore.on('datachanged', function (field) {
                                    if (mappingRuleGridStore.getCount() > 0) {
                                        mappingRuleGrid.elseConditionRuleRecord = null;
                                        for (var i = 0; i < mappingRuleGridStore.getCount(); i++) {
                                            var record = mappingRuleGridStore.getAt(i);
                                            if (record.raw.input && record.raw.input.conditionType == 'else') {
                                                mappingRuleGrid.elseConditionRuleRecord = record;
                                                break;
                                            }
                                        }
                                        inSkuAttributes.setReadOnly(true);
                                        inSkuAttributes.setFieldStyle('background-color:silver');
                                        outSkuAttributes.setReadOnly(true);
                                        outSkuAttributes.setFieldStyle('background-color:silver');
                                    } else {
                                        mappingRuleGrid.elseConditionRuleRecord = null;
                                        inSkuAttributes.setReadOnly(false);
                                        inSkuAttributes.setFieldStyle('background-color:white');
                                        outSkuAttributes.setReadOnly(false);
                                        outSkuAttributes.setFieldStyle('background-color:white');
                                    }
                                })
                            }

                        }
                    })
                ]
            }
        ];
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                itemId: 'saveBtn',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var form = win.getComponent('form');
                    var conditionFieldSet = form.getComponent('conditionFieldSet');
                    var baseConfigOfAttributeMappingFieldSet = form.getComponent('baseConfigOfAttributeMappingFieldSet');
                    var mappingRuleGridFieldSet = form.getComponent('mappingRuleGridFieldSet');
                    if (form.isValid() & conditionFieldSet.isValid()) {
                        if (mappingRuleGridFieldSet.isValid()) {
                            var baseInfo = baseConfigOfAttributeMappingFieldSet.getValue();
                            var result = Ext.Object.merge({
                                executeCondition: conditionFieldSet.getValue(),
                                mappingRules: mappingRuleGridFieldSet.getValue(),
                                inSkuAttributes: [],
                                inSkuAttributeIds: [],
                                outSkuAttributes: [],
                                outSkuAttributeIds: [],
                                description: '',
                                clazz: 'com.qpp.cgp.domain.attributemapping.oneway.ConditionOneWayValueMapping',
                                productId: win.productId
                            }, baseInfo);
                            for (var i = 0; i < result.inSkuAttributes.length; i++) {
                                result.inSkuAttributeIds.push(result.inSkuAttributes[i].id)
                            }
                            for (var i = 0; i < result.outSkuAttributes.length; i++) {
                                result.outSkuAttributeIds.push(result.outSkuAttributes[i].id)
                            }
                            console.log(result);
                            win.controller.createOrEditConditionOneWayValueMapping(result, win.createOrEdit, win.record, win.grid, win)

                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('规则列表不允许为空'));
                        }
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
        ];
        me.callParent();
    }
})
