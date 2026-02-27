/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'CGP.currency.store.Currency',
    'CGP.currencyconfig.view.CreateDiyQueryGrid'
]);
Ext.define('CGP.currencyconfig.view.CreateExchangeRateHedgeConfigWindow', {
    extend: 'CGP.currencyconfig.view.CreateDiyQueryGrid',
    alias: 'widget.createExchangeRateHedgeConfigWindow',
    isStageWebsite: true,
    initComponent: function () {
        var me = this,
            {isStageWebsite} = me,
            controller = Ext.create('CGP.currencyconfig.controller.Controller'),
            url = adminPath + `api/currencies?page=1&limit=1000&filter=[{"name":"website.id","value":11,"type":"number"}]`,
            exchangeRateConfigController = Ext.create('CGP.exchangerateconfig.controller.Controller'),
            currenciesData = controller.getQuery(url),
            store = Ext.create("CGP.exchangerateconfig.store.ExchangeRateConfig", {
                params: {
                    filter: Ext.JSON.encode(isStageWebsite ? [] : [
                        {
                            name: 'status',
                            type: 'string',
                            value: 'RELEASE'
                        }
                    ])
                }
            })

        me.gridCfg = {
            store: store,
            frame: false,
            selType: 'simple',
            selModel: {
                selType: 'checkboxmodel',
                mode: 'SIMPLE',
            },
            deleteAction: false,
            editAction: false,
            tbar: [
                {
                    xtype: 'button',
                    iconCls: 'icon_create',
                    text: i18n.getKey('新增汇率套'),
                    handler: function () {
                        JSOpen({
                            id: 'edit_exchangerateconfig',
                            url: path + `partials/exchangerateconfig/edit.html?type=create`,
                            refresh: true,
                            title: i18n.getKey('创建_汇率配置')
                        });
                    }
                },
                {
                    xtype: 'displayfield',
                    hidden: isStageWebsite,
                    value: JSCreateFont('red', true, '非Stage网站仅可选择上线状态汇率套'),
                }
            ],
            columns: [
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('id'),
                    align: 'center',
                    sortable: false,
                    width: 150,
                    dataIndex: 'id',
                    getDisplayName: function (value, metaData, record) {
                        return JSCreateHyperLink(value);
                    },
                    clickHandler: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="查看_汇率配置"';
                        JSOpen({
                            id: 'exchangerateconfigpage',
                            url: path + `partials/exchangerateconfig/main.html?_id=${value}`,
                            refresh: true,
                            title: i18n.getKey('汇率配置')
                        });
                    },
                },
                {
                    text: i18n.getKey('汇率套'),
                    dataIndex: 'version',
                    itemId: 'version',
                    align: 'center',
                    width: 100,
                    sortable: true,
                },
                {
                    text: i18n.getKey('状态'),
                    dataIndex: 'status',
                    itemId: 'status',
                    sortable: false,
                    align: 'center',
                    flex: 1,
                    renderer: function (value, metadata) {
                        var statusGather = {
                                'TEST': {
                                    color: 'red',
                                    text: '测试'
                                },
                                'RELEASE': {
                                    color: 'green',
                                    text: '上线'
                                },
                            },
                            {color, text} = statusGather[value];

                        return JSCreateFont(color, true, text)
                    }
                },
            ],
            listeners: {
                select: function (rowModel, records) {
                    var recordId = records.get('id'),
                        rightGrid = me.getComponent('rightGridCfg'),
                        url = adminPath + `api/exchangeRateSets/${recordId}`,
                        queryData = controller.getQuery(url);

                    rightGrid.diySetValue(queryData);
                }
            }
        };

        me.rightGridCfg = {
            width: 600,
            tbar: {
                defaults: {
                    xtype: 'displayfield',
                    margin: '0 10 0 30',
                    labelWidth: 50,
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('汇率套'),
                        itemId: 'versionBtn',
                        diySetValue: function (data) {
                            var me = this;

                            me.setValue(JSCreateFont('blue', true, data, 16));
                        }
                    },
                    {
                        fieldLabel: i18n.getKey('状态'),
                        labelWidth: 40,
                        itemId: 'statusBtn',
                        diySetValue: function (data) {
                            if (data) {
                                var me = this,
                                    statusGather = {
                                        'TEST': {
                                            color: 'red',
                                            text: '测试'
                                        },
                                        'RELEASE': {
                                            color: 'green',
                                            text: '上线'
                                        },
                                    },
                                    {color, text} = statusGather[data];

                                me.setValue(JSCreateFont(color, true, text, 14));
                            }
                        }
                    }
                ]
            },
            store: {
                fields: [
                    {
                        name: '_id',
                        type: 'string',
                        useNull: true
                    },
                    {
                        name: 'clazz',
                        type: 'string',
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
                    xtype: 'rownumberer',
                    width: 45,
                    resizable: true,
                    align: 'center',
                },
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
            ],
            diySetValue: function (data) {
                var me = this,
                    {id, status, version, exchangeRates} = data,
                    tools = me.getDockedItems('toolbar[dock="top"]')[0],
                    statusBtn = tools.getComponent('statusBtn'),
                    versionBtn = tools.getComponent('versionBtn');

                statusBtn.diySetValue(status);
                versionBtn.diySetValue(version);
                me.store.proxy.data = controller.getSelectRecord(exchangeRates);
                me.store.load();
            }
        }

        me.filterCfg = {
            header: false,
            defaults: {
                isLike: false,
            },
            layout: {
                type: 'table',
                columns: 3
            },
            items: [
                {
                    xtype: 'textfield',
                    name: '_id',
                    itemId: '_id',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                },
                {
                    xtype: 'numberfield',
                    name: 'version',
                    itemId: 'version',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('汇率套'),
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    itemId: 'status',
                    fieldLabel: i18n.getKey('状态'),
                    editable: false,
                    haveReset: true,
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'TEST',
                                display: i18n.getKey('测试')
                            },
                            {
                                value: 'RELEASE',
                                display: i18n.getKey('上线')
                            }
                        ]
                    }
                },
            ]
        };

        me.callParent();
    },
})