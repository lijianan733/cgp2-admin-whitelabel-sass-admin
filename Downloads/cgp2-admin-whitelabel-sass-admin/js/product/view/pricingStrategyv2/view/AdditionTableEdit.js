Ext.Loader.syncRequire(['Ext.ux.form.GridField']);
Ext.define("CGP.product.view.pricingStrategyv2.view.AdditionTableEdit", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 100,
        msgTarget: 'side'
    },
    autoScroll: true,
    scroll: 'vertical',
    isValidForItems: true,
    strategyId: null,
    strategyModel: null,
    tabPanel: null,
    initComponent: function () {
        var me = this;
        var strategyStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'displayName'],
            data: [
//                {"value": "com.qpp.cgp.domain.pricing.configuration.SimpleQtyTablePricingSetting", "displayName": i18n.getKey('simple') + i18n.getKey('pricingStrategy')},
                {
                    "value": "com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting",
                    "displayName": i18n.getKey('addition') + i18n.getKey('pricingStrategy')
                }
                //{"value": "com.qpp.cgp.domain.pricing.configuration.DynamicCostTablePricingSetting", "displayName": i18n.getKey('dynamic') + i18n.getKey('pricingStrategy')}
            ]
        });
        var controller = Ext.create("CGP.product.view.pricingStrategyv2.controller.PricingStrategy");
        var mainPricingTable = Ext.create("CGP.product.view.pricingStrategyv2.view.PricingTable", {
            id: 'mainPricingTable',
            store: Ext.create("CGP.product.view.pricingStrategyv2.store.LocalPricingTable"),
            //fieldLabel: i18n.getKey('main')+i18n.getKey('price')+i18n.getKey('table'),
            itemId: 'mainPricingTable',
            name: 'table',
            allowBlank: false,
            gridContainer: 'mainPricingTableGrid'
        });
        var additionTables = Ext.create("CGP.product.view.pricingStrategyv2.view.additionTable.AdditionTablePanel", {
            id: 'additionTables',
            itemId: 'additionTables',
            name: 'additionTable',
            productId: me.productId,
            allowBlank: false,
            gridContainer: 'additionTableGrid',
            width: 1100
        });

        if (Ext.isEmpty(me.strategyModel)) {
            me.strategyModel = Ext.create('CGP.product.view.pricingStrategyv2.model.PricingStrategy', {
                clazz: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingConfig'
            });
        }
        me.tbar = Ext.create('Ext.ux.toolbar.Edit', Ext.Object.merge({
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
                disabled: me.readOnly,
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var translateData = function (data) {
                            if (Ext.isEmpty(data.setting)) {
                                data.setting = {
                                    _id: JSGetCommonKey(),
                                    clazz: null,
                                    mainTable: null,
                                    additionTable: null
                                };
                            }
                            data.setting.clazz = data.strategyType;
                            data.setting.mainTable = data.table;
                            data.setting.additionTable = data.additionTable;
                            if (Ext.isEmpty(data.formula)) {
                                data.formula = {
                                    _id: JSGetCommonKey(),
                                    index: 0,
                                    description: 'additionTable',
                                    clazz: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingFormula',
                                    formula: {
                                        "expression": 'function expression(args) { var value=0; for(i in args){ value+=Number(args[i]);} return value==0?1000:value.toFixed(' + (me.tabPanel.configType == 'costPrice' ? 4 : 2) + ');}',
                                        "type": "Javascript"
                                    },
                                    factorGenerators: []
                                }
                            }
                            data.formula.factorGenerators = controller.translateAdditionSetting(data.setting);
                            delete data.table;
                            delete data.additionTable;
                            delete data.strategyType;
                            return data;
                        };
                        var jsonData = translateData(me.getValue());
                        console.log(jsonData);
                        var resp = controller.save(jsonData, me.tabPanel, me.tabPanel.url);
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
        }, me.tbarConfig));
        me.items = [
            {
                xtype: 'numberfield',
                name: '_id',
                fieldLabel: i18n.getKey('_id'),
                itemId: '_id',
                hidden: true
            },
            {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                allowBlank: false
//                disabled:Ext.isEmpty(me.strategyId)?false:true
            },
            {
                xtype: 'combo',
                itemId: 'strategyType',
                name: 'strategyType',
                fieldLabel: i18n.getKey('type'),
                store: strategyStore,
                queryMode: 'local',
                hidden: true,
                displayField: 'displayName',
                valueField: 'value',
                allowBlank: false,
                readOnly: true,
                readOnlyCls: 'x-item-disabled',
                value: 'com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting'
            },
            {
                xtype: 'combo',
                itemId: 'currency',
                name: 'currency',
                fieldLabel: i18n.getKey('currency'),
                store: Ext.create('CGP.currency.store.Currency', {
                    params: {
                        filter: Ext.JSON.encode([{
                            name: 'website.id',
                            type: 'number',
                            value: 11
                        }])
                    }
                }),
                displayField: 'title',
                valueField: 'code',
                allowBlank: false,
                value: 'HKD'
            },
            Ext.create('CGP.product.view.pricingStrategyv2.view.FieldSetForm', {
                title: i18n.getKey('main') + i18n.getKey('price') + i18n.getKey('table'),
                width: 1000,
                padding: '20',
                defaultType: 'displayfield',
                items: [
                    mainPricingTable
                ]
            }),
            additionTables
        ];

        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var productId = JSGetQueryString('productId');
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });

    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.strategyId)) {
                comp.refreshData(comp.strategyModel.data);
            }
        }
    },
    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        JSSetLoading(true);
        setTimeout(function () {
            Ext.Array.each(items, function (item) {
                if (item.itemId == 'additionTables') {
                    item.setSubmitValue(data[item.name])
                } else {
                    item.setValue(item.name ? data[item.name] : data);
                }
            });
            JSSetLoading(false);
        })

    },
    getValue: function () {
        var me = this, data = {clazz: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingConfig'};
        var items = me.items.items;

        Ext.Array.each(items, function (item) {
            if (Ext.isEmpty(item.name)) {
                item.getValue(data);
            } else {
                data[item.name] = item.getValue();
            }
        });
        return data;
    }

})
