/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.Loader.syncRequire([
    'CGP.currencyconfig.view.CreateCurrencyGridWindow',
    'CGP.currencyconfig.view.CreateExchangeRateHedgeConfigWindow',
]);
Ext.define('CGP.currencyconfig.view.CreateExchangeRateListComp', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.createExchangeRateListComp',
    defaults: {
        margin: '20 40 20 0'
    },
    layout: 'vbox',
    width: '100%',
    height: 800,
    autoScroll: true,
    readOnly: false,
    initComponent: function () {
        var me = this,
            type = JSGetQueryString('type'),
            isEdit = type === 'edit',
            {readOnly} = me,
            url = adminPath + 'api/currencies?page=1&limit=1000&filter=[{"name":"website.id","type":"number","value":11}]',
            controller = Ext.create('CGP.currencyconfig.controller.Controller'),
            exchangeRateConfigController = Ext.create('CGP.exchangerateconfig.controller.Controller'),
            currenciesData = controller.getQuery(url);

        me.items = [
            {
                xtype: 'gridfieldwithcrudv2',
                name: 'exchangeRateList',
                itemId: 'exchangeRateList',
                fieldLabel: i18n.getKey('汇率列表'),
                labelAlign: 'top',
                maxHeight: 600,
                minHeight: 220,
                width: 700,
                allowBlank: false,
                actionEditHidden: true,
                actionRemoveHidden: true,
                getExchangeRateSetId: function () {
                    var me = this;
                    return me.exchangeRateSetId;
                },
                setExchangeRateSetId: function (id) {
                    var me = this;
                    me.exchangeRateSetId = id;
                },
                diyGetValue: function () {
                    var me = this,
                        getValue = me.getSubmitValue(),
                        result = getValue.map(item => {
                            var {
                                    _id,
                                    clazz,
                                    outputCurrencyCode,
                                    inputCurrencyCode,
                                    exchangeRateSetId,
                                    exchangeRate,
                                } = item,
                                {min, max} = exchangeRate,
                                result = {
                                    _id,
                                    clazz,
                                    outputCurrencyCode,
                                    inputCurrencyCode,
                                    inputRate: min,
                                    outRate: max
                                }

                            exchangeRateSetId && (result['exchangeRateSetId'] = exchangeRateSetId);

                            return result;
                        })

                    return result;
                },
                diySetValue: function (data) {
                    if (data) {
                        var me = this,
                            store = me._grid.store,
                            result = data?.map(item => {
                                var {
                                    _id,
                                    clazz,
                                    outputCurrencyCode,
                                    inputCurrencyCode,
                                    exchangeRateSetId,
                                    inputRate,
                                    outRate
                                } = item;

                                return {
                                    _id,
                                    clazz,
                                    outputCurrencyCode,
                                    inputCurrencyCode,
                                    exchangeRateSetId,
                                    exchangeRate: {
                                        min: inputRate,
                                        max: outRate,
                                    }
                                }
                            });

                        store.proxy.data = result;
                        store.load();
                    }
                },
                setExchangeRateConfigTitle: function (data) {
                    var me = this,
                        tools = me._grid.getDockedItems('toolbar[dock="top"]')[0],
                        deleteExchangeRateConfig = tools.getComponent('deleteExchangeRateConfig');

                    deleteExchangeRateConfig.diySetValue(data);
                },
                gridConfig: {
                    tbar: {
                        hiddenButtons: ['read', 'clear', 'config', 'help', 'export', 'import'],
                        btnCreate: {
                            text: i18n.getKey('选择已有汇率套配置'),
                            width: 160,
                            hidden: readOnly,
                            handler: function (btn) {
                                var tools = btn.ownerCt,
                                    grid = tools.ownerCt,
                                    exchangeRateList = grid.ownerCt,
                                    store = grid.store,
                                    deleteExchangeRateConfig = tools.getComponent('deleteExchangeRateConfig');
                                controller.createExchangeRateHedgeConfigWindow(function (selectedData) {
                                    exchangeRateList.setExchangeRateSetId(selectedData['id']);
                                    controller.setExchangeRateHedgeConfigData(selectedData, store, deleteExchangeRateConfig);
                                });
                            }
                        },
                        btnDelete: {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('汇率套配置'),
                            margin: '0 0 0 10',
                            labelWidth: 70,
                            itemId: 'deleteExchangeRateConfig',
                            diySetValue: function (data) {
                                var me = this;

                                me.setValue(JSCreateFont('blue', true, data, 16));
                            }
                        }
                    },
                    store: {
                        fields: [
                            {
                                name: '_id',
                                type: 'number',
                                useNull: true
                            },
                            {
                                name: 'exchangeRateSetId',
                                type: 'string',
                            },
                            {
                                name: 'clazz',
                                type: 'string',
                                defaultValue: 'com.qpp.cgp.domain.common.rate.ExchangeRate'
                            },
                            {
                                name: 'inputCurrencyCode',
                                type: 'string',
                            },
                            {
                                name: 'inputCurrencyDisplayName',
                                type: 'string',
                                convert: function (value, record) {
                                    var code = record.get('inputCurrencyCode');
                                    return exchangeRateConfigController.getCurrenciesDisplayName(currenciesData, code);
                                }
                            },
                            {
                                name: 'outputCurrencyCode',
                                type: 'string',
                            },
                            {
                                name: 'outputCurrencyDisplayName',
                                type: 'string',
                                convert: function (value, record) {
                                    var code = record.get('outputCurrencyCode');
                                    return exchangeRateConfigController.getCurrenciesDisplayName(currenciesData, code);
                                }
                            },
                            {
                                name: 'exchangeRate',
                                type: 'object',
                            }
                        ],
                        data: []
                    },
                    autoScroll: true,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            width: 120,
                            align: 'center',
                            sortable: false
                        },
                        {
                            text: i18n.getKey('输入货币'),
                            dataIndex: 'inputCurrencyDisplayName',
                            width: 180,
                            align: 'center',
                            sortable: false
                        },
                        {
                            text: i18n.getKey('输出货币'),
                            dataIndex: 'outputCurrencyDisplayName',
                            width: 180,
                            align: 'center',
                            sortable: false
                        },
                        {
                            text: i18n.getKey('汇率'),
                            dataIndex: 'exchangeRate',
                            flex: 1,
                            align: 'center',
                            sortable: false,
                            renderer: function (value) {
                                var {min, max} = value,
                                    exchangeRate = exchangeRateConfigController.getRoundToFourDecimals(max / min);

                                return `${min} → ${max}`;
                            }
                        },
                    ]
                },
                winConfig: {
                    layout: 'fit',
                    formConfig: {
                        layout: 'vbox',
                        width: 400,
                        useForEach: true,
                        isValidForItems: true,
                        defaults: {
                            allowBlank: false,
                            labelWidth: 110,
                            width: '100%'
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: i18n.getKey('id'),
                                name: 'id',
                                itemId: 'id',
                                hidden: true,
                            },
                            {
                                xtype: 'combo',
                                name: 'inputCurrencyCode',
                                itemId: 'inputCurrencyCode',
                                fieldLabel: i18n.getKey('输入货币'),
                                editable: false,
                                allowBlank: false,
                                labelWidth: 100,
                                valueField: 'code',
                                displayField: 'displayNameV2',
                                store: Ext.create("CGP.currency.store.Currency", {
                                    params: {
                                        filter: '[{"name":"website.id","value":11,"type":"number"}]'
                                    },
                                })
                            },
                            {
                                xtype: 'combo',
                                name: 'outputCurrencyCode',
                                itemId: 'outputCurrencyCode',
                                fieldLabel: i18n.getKey('输出货币'),
                                editable: false,
                                allowBlank: false,
                                labelWidth: 100,
                                valueField: 'code',
                                displayField: 'displayNameV2',
                                store: Ext.create("CGP.currency.store.Currency", {
                                    params: {
                                        filter: '[{"name":"website.id","value":11,"type":"number"}]'
                                    },
                                })
                            },
                            {
                                xtype: 'minmaxfield',
                                name: 'exchangeRate',
                                itemId: 'exchangeRate',
                                fieldLabel: i18n.getKey('汇率'),
                                isEnable: false,
                                setInitConfig: function () {
                                    var me = this,
                                        configGather = [
                                            {
                                                compName: 'min',
                                                emptyText: '输入货币'
                                            },
                                            {
                                                compName: 'mediateText',
                                                value: ' → '
                                            },
                                            {
                                                compName: 'max',
                                                emptyText: '输出货币'
                                            },
                                        ];
                                    configGather.forEach(item => {
                                        var {compName, emptyText, value} = item,
                                            comp = me.getComponent(compName);

                                        emptyText && (comp.emptyText = emptyText);
                                        comp?.reset();
                                        value && comp?.setValue(value);
                                    })
                                },
                                listeners: {
                                    afterrender: function (comp) {
                                        comp.setInitConfig();
                                    }
                                }
                            },
                        ]
                    }
                },
            },
            {
                xtype: 'uxfieldcontainer',
                itemId: 'currencyUsageScopes',
                defaults: {
                    margin: '0 20 10 0',
                },
                layout: 'hbox',
                width: '100%',
                diySetValue: function (data) {
                    var me = this,
                        mainContainer = me.ownerCt,
                        FrontendComp = me.getComponent('Frontend'),
                        EShopComp = me.getComponent('EShop'),
                        BackendComp = me.getComponent('Backend');

                    if (data) {
                        var {Frontend, EShop, Backend} = mainContainer.getCurrencyUsageScopesData(data);
                        EShopComp.diySetValue(EShop);
                        FrontendComp.diySetValue(Frontend);
                        BackendComp.diySetValue(Backend);
                    }
                },
                diyGetValue: function (data) {
                    var me = this,
                        items = me.items.items,
                        result = [];

                    items.forEach(item => {
                        var getValue = item.diyGetValue ? item.diyGetValue() : item.getValue();
                        result.push(getValue);
                    })

                    return result
                },
                items: [
                    {
                        xtype: 'gridfieldwithcrudv2',
                        fieldLabel: i18n.getKey('平台支持货币列表'),
                        itemId: 'Frontend',
                        name: 'Frontend',
                        maxHeight: 300,
                        minHeight: 120,
                        width: 500,
                        labelAlign: 'top',
                        allowBlank: false,
                        actionEditHidden: true,
                        currencySetting: null,
                        currencyUsageScopeId: '',
                        actionRemoveHidden: readOnly,
                        diySetValue: function (data) {
                            var me = this;
                            if (data) {
                                var {_id, currencySetting, currencys} = data;
                                me.currencySetting = currencySetting;
                                me.currencyUsageScopeId = _id;
                                me._grid.getStore().proxy.data = currencys;
                                me._grid.getStore().load();
                            }
                        },
                        diyGetValue: function () {
                            var me = this,
                                storeData = me._grid.store.proxy.data,
                                result = storeData.map(item => {
                                    return item['code'];
                                })

                            return {
                                clazz: "com.qpp.cgp.domain.common.platform.CurrencyUsageScope",
                                currencyCodes: result,
                                scope: me.name,
                                // currencySetting: me.currencySetting,
                                _id: isEdit ? me.currencyUsageScopeId : '',
                            };
                        },
                        gridConfig: {
                            selModel: {
                                selType: readOnly ? 'rowmodel' : 'checkboxmodel',
                                mode: readOnly ? 'SINGLE' : 'MULTI'
                            },
                            tbar: {
                                hidden: readOnly,
                                btnCreate: {
                                    text: i18n.getKey('新增'),
                                    width: 80,
                                    hidden: readOnly,
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            store = grid.store;
                                        controller.createCurrencyWin(store);
                                    }
                                },
                                btnDelete: {
                                    text: i18n.getKey('删除'),
                                    width: 80,
                                    hidden: readOnly,
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            store = grid.store,
                                            selection = grid.getSelectionModel().getSelection();

                                        if (selection.length) {
                                            Ext.Msg.confirm('提示', i18n.getKey('是否确认删除所选数据!'), function (selector) {
                                                if (selector === 'yes') {
                                                    JSDeleteMemoryStoreSelectData(store, selection, 'id', function () {
                                                        console.log(1)
                                                    });
                                                }
                                            })

                                        } else {
                                            Ext.Msg.alert('提示', i18n.getKey('请选择需删除的数据!'));
                                        }
                                    }
                                }
                            },
                            store: Ext.create('Ext.data.Store', {
                                autoSync: true,
                                fields: [
                                    {
                                        name: 'id',
                                        type: 'number'
                                    },
                                    {
                                        name: 'title',
                                        type: 'string'
                                    },
                                    {
                                        name: 'code',
                                        type: 'string'
                                    },
                                ],
                                proxy: {
                                    type: 'memory',
                                    data: [],
                                },
                                data: []
                            }),
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    width: 45,
                                    resizable: true,
                                    menuDisabled: true,
                                    align: 'center',
                                },
                                {
                                    text: i18n.getKey('id'),
                                    width: 100,
                                    dataIndex: 'id',
                                    align: 'center',
                                    sortable: false
                                },
                                {
                                    text: i18n.getKey('货币名称'),
                                    align: 'center',
                                    dataIndex: 'title',
                                    width: 200,
                                    tdCls: 'vertical-middle'
                                },
                                {
                                    text: i18n.getKey('货币代码'),
                                    align: 'center',
                                    dataIndex: 'code',
                                    flex: 1,
                                    tdCls: 'vertical-middle'
                                },

                            ]
                        },
                    },
                    {
                        xtype: 'gridfieldwithcrudv2',
                        fieldLabel: i18n.getKey('Eshop支持货币列表'),
                        itemId: 'EShop',
                        name: 'EShop',
                        maxHeight: 300,
                        minHeight: 120,
                        width: 500,
                        labelAlign: 'top',
                        allowBlank: false,
                        actionEditHidden: true,
                        currencySetting: null,
                        currencyUsageScopeId: '',
                        actionRemoveHidden: readOnly,
                        diySetValue: function (data) {
                            var me = this;
                            if (data) {
                                var {_id, currencySetting, currencys} = data;
                                me.currencySetting = currencySetting;
                                me.currencyUsageScopeId = _id;
                                me._grid.getStore().proxy.data = currencys;
                                me._grid.getStore().load();
                            }
                        },
                        diyGetValue: function () {
                            var me = this,
                                storeData = me._grid.store.proxy.data,
                                result = storeData.map(item => {
                                    return item['code'];
                                })

                            return {
                                clazz: "com.qpp.cgp.domain.common.platform.CurrencyUsageScope",
                                currencyCodes: result,
                                scope: me.name,
                                // currencySetting: me.currencySetting,
                                _id: isEdit ? me.currencyUsageScopeId : '',
                            };
                        },
                        gridConfig: {
                            selModel: {
                                selType: readOnly ? 'rowmodel' : 'checkboxmodel',
                                mode: readOnly ? 'SINGLE' : 'MULTI'
                            },
                            tbar: {
                                hidden: readOnly,
                                btnCreate: {
                                    text: i18n.getKey('新增'),
                                    width: 80,
                                    hidden: readOnly,
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            store = grid.store;
                                        controller.createCurrencyWin(store);
                                    }
                                },
                                btnDelete: {
                                    text: i18n.getKey('删除'),
                                    width: 80,
                                    hidden: readOnly,
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            store = grid.store,
                                            selection = grid.getSelectionModel().getSelection();

                                        if (selection.length) {
                                            Ext.Msg.confirm('提示', i18n.getKey('是否确认删除所选数据!'), function (selector) {
                                                if (selector === 'yes') {
                                                    JSDeleteMemoryStoreSelectData(store, selection, 'id', function () {
                                                        console.log(1)
                                                    });
                                                }
                                            })
                                        } else {
                                            Ext.Msg.alert('提示', i18n.getKey('请选择需删除的数据!'));
                                        }
                                    }
                                }
                            },
                            store: Ext.create('Ext.data.Store', {
                                autoSync: true,
                                fields: [
                                    {
                                        name: 'id',
                                        type: 'number'
                                    },
                                    {
                                        name: 'title',
                                        type: 'string'
                                    },
                                    {
                                        name: 'code',
                                        type: 'string'
                                    },
                                ],
                                proxy: {
                                    type: 'memory',
                                    data: [],
                                },
                                data: []
                            }),
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    width: 45,
                                    resizable: true,
                                    menuDisabled: true,
                                    align: 'center',
                                },
                                {
                                    text: i18n.getKey('id'),
                                    width: 100,
                                    dataIndex: 'id',
                                    align: 'center',
                                    sortable: false
                                },
                                {
                                    text: i18n.getKey('货币名称'),
                                    align: 'center',
                                    dataIndex: 'title',
                                    width: 200,
                                    tdCls: 'vertical-middle'
                                },
                                {
                                    text: i18n.getKey('货币代码'),
                                    align: 'center',
                                    dataIndex: 'code',
                                    flex: 1,
                                    tdCls: 'vertical-middle'
                                },
                            ]
                        },
                    },
                    {
                        xtype: 'gridfieldwithcrudv2',
                        fieldLabel: i18n.getKey('后台支持货币列表'),
                        itemId: 'Backend',
                        name: 'Backend',
                        maxHeight: 300,
                        minHeight: 120,
                        width: 500,
                        labelAlign: 'top',
                        allowBlank: false,
                        actionEditHidden: true,
                        currencySetting: null,
                        currencyUsageScopeId: '',
                        actionRemoveHidden: readOnly,
                        diySetValue: function (data) {
                            var me = this;
                            if (data) {
                                var {_id, currencySetting, currencys} = data;
                                me.currencySetting = currencySetting;
                                me.currencyUsageScopeId = _id;
                                me._grid.getStore().proxy.data = currencys;
                                me._grid.getStore().load();
                            }
                        },
                        diyGetValue: function () {
                            var me = this,
                                storeData = me._grid.store.proxy.data,
                                result = storeData.map(item => {
                                    return item['code'];
                                })

                            return {
                                clazz: "com.qpp.cgp.domain.common.platform.CurrencyUsageScope",
                                currencyCodes: result,
                                scope: me.name,
                                // currencySetting: me.currencySetting,
                                _id: isEdit ? me.currencyUsageScopeId : '',
                            };
                        },
                        gridConfig: {
                            selModel: {
                                selType: readOnly ? 'rowmodel' : 'checkboxmodel',
                                mode: readOnly ? 'SINGLE' : 'MULTI'
                            },
                            tbar: {
                                hidden: readOnly,
                                btnCreate: {
                                    text: i18n.getKey('新增'),
                                    width: 80,
                                    hidden: readOnly,
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            store = grid.store;
                                        controller.createCurrencyWin(store);
                                    }
                                },
                                btnDelete: {
                                    text: i18n.getKey('删除'),
                                    width: 80,
                                    hidden: readOnly,
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            store = grid.store,
                                            selection = grid.getSelectionModel().getSelection();

                                        if (selection.length) {
                                            Ext.Msg.confirm('提示', i18n.getKey('是否确认删除所选数据!'), function (selector) {
                                                if (selector === 'yes') {
                                                    JSDeleteMemoryStoreSelectData(store, selection, 'id', function () {
                                                        console.log(1)
                                                    });
                                                }
                                            })
                                        } else {
                                            Ext.Msg.alert('提示', i18n.getKey('请选择需删除的数据!'));
                                        }
                                    }
                                }
                            },
                            store: Ext.create('Ext.data.Store', {
                                autoSync: true,
                                fields: [
                                    {
                                        name: 'id',
                                        type: 'number'
                                    },
                                    {
                                        name: 'title',
                                        type: 'string'
                                    },
                                    {
                                        name: 'code',
                                        type: 'string'
                                    },
                                ],
                                proxy: {
                                    type: 'memory',
                                    data: [],
                                },
                                data: []
                            }),
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    width: 45,
                                    resizable: true,
                                    menuDisabled: true,
                                    align: 'center',
                                },
                                {
                                    text: i18n.getKey('id'),
                                    width: 100,
                                    dataIndex: 'id',
                                    align: 'center',
                                    sortable: false
                                },
                                {
                                    text: i18n.getKey('货币名称'),
                                    align: 'center',
                                    dataIndex: 'title',
                                    width: 200,
                                    tdCls: 'vertical-middle'
                                },
                                {
                                    text: i18n.getKey('货币代码'),
                                    align: 'center',
                                    dataIndex: 'code',
                                    flex: 1,
                                    tdCls: 'vertical-middle'
                                },
                            ]
                        },
                    },
                ]
            }
        ]

        me.callParent();
    },
    getCurrencyUsageScopesData: function (data) {
        var result = {},
            controller = Ext.create('CGP.currencyconfig.controller.Controller'),
            url = adminPath + 'api/currencies?page=1&limit=1000&filter=[{"name":"website.id","type":"number","value":11}]';
        // queryData = controller.getQuery(url);

        if (data) {
            data.forEach((item) => {
                var {scope, platformCurrencySettingId, id, currencies} = item,
                    scopeTitleGather = {
                        Frontend: '平台支持货币列表',
                        EShop: 'Eshop支持货币列表',
                        Backend: '后台支持货币列表',
                        defaults: '支持货币列表',
                    };

                result[scope] = {
                    _id: id,
                    currencys: currencies,
                    title: scopeTitleGather[scope || 'defaults'],
                    currencySetting: platformCurrencySettingId,
                };
            })
        }
        return result;
    },
    diySetValue: function (data) {
        var me = this,
            {exchangeRateSet, currencyUsageScopes} = data,
            {exchangeRates, version, id} = exchangeRateSet,
            exchangeRateListComp = me.getComponent('exchangeRateList'),
            currencyUsageScopesComp = me.getComponent('currencyUsageScopes')

        exchangeRateListComp.setExchangeRateSetId(id);
        exchangeRateListComp.diySetValue(exchangeRates)
        exchangeRateListComp.setExchangeRateConfigTitle(version);
        currencyUsageScopesComp.diySetValue(currencyUsageScopes);
    },
    diyGetValue: function () {
        var me = this,
            exchangeRateListComp = me.getComponent('exchangeRateList'),
            currencyUsageScopesComp = me.getComponent('currencyUsageScopes');

        return {
            exchangeRateSetId: exchangeRateListComp.getExchangeRateSetId(),
            currencyUsageScopes: currencyUsageScopesComp.diyGetValue(),
        }
    },
})