/**
 * Created by admin on 2020/2/27.
 */
Ext.Loader.syncRequire(['Ext.ux.form.GridField']);
Ext.define("CGP.product.view.pricingStrategyv2.view.PricingStrategy", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    bodyPadding: 5,
    layout: {
        layout: 'table',
        columns: 1,
        tdAttrs: {
            style: {
                'padding-right': '120px'
            }
        }
    },
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 100,
        msgTarget: 'side'
    },

    strategyId: null,
    strategyModel: null,
    tabPanel: null,
    initComponent: function () {
        var me = this;
        var strategyStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'displayName'],
            data: [
                {"value": "AL", "displayName": i18n.getKey('simple') + i18n.getKey('pricingStrategy')},
                {"value": "AK", "displayName": i18n.getKey('addition') + i18n.getKey('pricingStrategy')},
                {"value": "AZ", "displayName": i18n.getKey('dynamic') + i18n.getKey('pricingStrategy')}
            ]
        });
        var mainPricingTable = Ext.create("CGP.product.view.pricingStrategyv2.view.PricingTable", {
            id: 'mainPricingTable',
            store: Ext.create("CGP.product.view.pricingStrategyv2.store.LocalPricingTable"),
            fieldLabel: i18n.getKey('main') + i18n.getKey('price') + i18n.getKey('table'),
            itemId: 'mainPricingTable',
            name: 'mainTable'
        });

        me.tbar = Ext.create('Ext.ux.toolbar.Edit', {
            btnCreate: {
                hidden: true,
                handler: function () {

                }
            },
            btnCopy: {
                hidden: true
            },
            btnReset: {
                disabled: true
            },
            btnSave: {
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    if (form.getForm().isValid()) {
                        var data = me.getValue().data;
                        controller.save(data);
                    }
                }
            },
            btnGrid: {
                disabled: true
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        });
        me.items = [
            {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                allowBlank: false
            },
            {
                xtype: 'combo',
                itemId: 'strategyType',
                name: 'clazz',
                fieldLabel: i18n.getKey('type'),
                store: strategyStore,
                queryMode: 'local',
                displayField: 'displayName',
                valueField: 'value',
                allowBlank: false,
                listeners: {
                    'change': function (cob, newValue, oldValue, eOpts) {
                        if (newValue == '') {

                        }
                    }
                }
            },
            mainPricingTable,
            Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet', {
                title: i18n.getKey('price') + i18n.getKey('table'),
                width: 600,
                padding: '20',
                defaultType: 'displayfield',
                items: []
            })
        ];

        me.callParent(arguments);
//        if (!Ext.isEmpty(me.strategyId)) {
//            me.strategyModel= Ext.ModelManager.getModel('CGP.product.view.pricingStrategyv2.model.PricingStrategy');
//            me.strategyModel.load(Number(me.strategyId), {
//                success: function (record, operation) {
//                    me.refreshData(record.data);
//                }
//            });
//        }
    },
    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'fieldset') {
//                        var pricetable = item.items.items[0];
//                        pricetable.setSubmitValue(data[pricetable.name])
            } else {
                item.setValue(data[item.name]);
            }
        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'fieldset') {
                var pricetable = item.items.items[0];
                me.strategyModel.set(pricetable.name, pricetable.getSubmitValue());
            } else {
                me.strategyModel.set(item.name, item.getValue());
            }
        })
        return me.strategyModel.data;
    }
})