Ext.Loader.syncRequire([
    'Ext.ux.grid.column.CurrencyColumn'
])
Ext.define('CGP.ordersummary.view.CreateCutOff', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createCutOff',
    store: null,
    i18nblock: null,
    isOriginal: null,
    exportExcelUrl: null,
    initComponent: function () {
        var me = this;
        var orderNumber = me.isOriginal ? 'orderNo' : 'orderNumber';
        me.config = {
            i18nblock: me.i18nblock,
            block: 'ordersummary',
            store: me.store,
            tbarCfg: {
                btnCreate: {
                    disabled: true,
                },
                btnDelete: {
                    disabled: true,
                },
                btnExport: {
                    disabled: false,
                    hidden: false,
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt.ownerCt;
                        var query = grid.filter.getQuery();
                        var filter = [];
                        filter = Ext.encode(query);
                        var url = adminPath + me.exportExcelUrl;
                        var x = new XMLHttpRequest();
                        x.open("POST", url, true);
                        x.setRequestHeader('Content-Type', 'application/json');
                        x.setRequestHeader('Access-Control-Allow-Origin', '*');
                        x.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
                        x.responseType = 'blob';
                        x.onload = function (e) {
                            if (x.status == 200) {
                                console.log(x.response.type);
                                const blob = new Blob([x.response], {type: x.response.type});
                                var url = window.URL.createObjectURL(blob)
                                var a = document.createElement('a');
                                a.href = url
                                a.download = 'Cut off'
                                a.click()
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), '网络请求错误')
                            }

                        }
                        x.send(Ext.encode({
                            "filter": filter,
                        }));

                    }
                }
            },
            gridCfg: {
                store: me.store,
                frame: false,
                deleteAction: false,
                editAction: false,
                columnDefaults: {
                    width: 150,
                    autoSizeColumn: true,
                    tdCls: 'vertical-middle',
                    renderer: function (value, metaData, record) {
                        return value;
                    }
                },
                columns: [
                    {
                        text: '订单信息',
                        width: 900,
                        defaults: {
                            width: 150,
                            autoSizeColumn: true,
                            tdCls: 'vertical-middle',
                        },
                        columns: [
                            {
                                dataIndex: 'orderNo',
                                text: '订单编号',
                            },
                            {
                                dataIndex: 'currencyCode',
                                text: '付款货币'
                            },
                            {
                                xtype: 'currencycolumn',
                                dataIndex: 'netReceiptQP',
                                text: 'netReceiptQP'
                            },
                            {
                                dataIndex: 'accountingExchangeRate',
                                text: '会计汇率'
                            },
                            {
                                xtype: 'currencycolumn',
                                dataIndex: 'netReceiptQPHKD',
                                text: 'NetReceipt(QP HKD)',
                                aimCurrencyCode: 'HKD',
                            },
                            {
                                xtype: 'currencycolumn',
                                dataIndex: 'totalCost',
                                text: '总成本'
                            }, {
                                dataIndex: 'shippingCountry',
                                text: '收货人国家/地区'
                            },
                            {
                                dataIndex: 'status',
                                text: '订单状态',
                                renderer: function (value, metaData, record) {
                                    return i18n.getKey(value.name);
                                }
                            },
                        ]
                    },
                    {
                        text: 'Cut Off信息',
                        width: 300,
                        defaults: {
                            width: 150,
                            autoSizeColumn: true,
                            tdCls: 'vertical-middle',
                        },
                        columns: [
                            {
                                dataIndex: 'accountingMonth',
                                text: '入账月份'
                            },
                            {
                                dataIndex: 'accountingDate',
                                text: '入账日期',
                                sortable: true,
                                renderer: function (value, metaData, record) {
                                    if (value) {
                                        return Ext.Date.format(new Date(value), 'Y/m/d H:i');
                                    }
                                }
                            },
                        ]
                    },
                    {
                        text: '寄件信息',
                        width: 900,
                        defaults: {
                            width: 150,
                            autoSizeColumn: true,
                            tdCls: 'vertical-middle',
                        },
                        columns: [
                            {
                                dataIndex: 'deliveryName',
                                text: '出货方式'
                            },
                            {
                                dataIndex: 'shippingMethod',
                                text: '实际出货方式'
                            },
                            {
                                dataIndex: 'shippingNo',
                                text: '邮递编号'
                            }, {
                                dataIndex: 'shippingMethod',
                                text: '实际出貨方式'
                            }, {
                                dataIndex: 'expectedShippingDate',
                                text: '预计送达日期',
                                sortable: true,
                                renderer: function (value, metaData, record) {
                                    if (value) {
                                        return Ext.Date.format(new Date(value), 'Y/m/d H:i');
                                    }
                                }
                            }, {
                                dataIndex: 'signDate',
                                text: '实际签收日期',
                                sortable: true,
                                renderer: function (value, metaData, record) {
                                    if (value) {
                                        return Ext.Date.format(new Date(value), 'Y/m/d H:i');
                                    }
                                }
                            },
                        ]
                    }
                ]
            },
            filterCfg: {
                minHeight: 120,
                items: [
                    {
                        xtype: 'textfield',
                        itemId: orderNumber,
                        name: orderNumber,
                        fieldLabel: '订单编号',
                        vtype: 'alphanum',
                        isLike: false,
                    },
                    {
                        xtype: 'combo',
                        itemId: 'status.id',
                        name: 'status.id',
                        fieldLabel: '订单状态',
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        isLike: false,
                        isNUmber: true,
                        store: {
                            xtype: 'store',
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 108,
                                    display: i18n.getKey('Received')
                                },
                                {
                                    value: 224098,
                                    display: i18n.getKey('Wait settlement')
                                },
                                {
                                    value: 109,
                                    display: i18n.getKey('Completed')
                                },
                                {
                                    value: 36585000,
                                    display: i18n.getKey('REFUNDED_STATUS')
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'datefield',
                        itemId: 'accountingDate',
                        name: 'accountingDate',
                        fieldLabel: '入账日期',
                        isLike: false,
                        editable: false,
                        style: 'margin-right:50px; margin-top : 0px;',
                        scope: true,
                        width: 360,
                        format: 'Y/m/d'
                    },
                    {
                        xtype: 'datefield',
                        itemId: 'expectedShippingDate',
                        name: 'expectedShippingDate',
                        fieldLabel: '预计送达日期',
                        isLike: false,
                        editable: false,
                        style: 'margin-right:50px; margin-top : 0px;',
                        scope: true,
                        width: 360,
                        format: 'Y/m/d'
                    },
                    {
                        xtype: 'datefield',
                        itemId: 'signDate',
                        name: 'signDate',
                        fieldLabel: '实际签收日期',
                        isLike: false,
                        editable: false,
                        style: 'margin-right:50px; margin-top : 0px;',
                        scope: true,
                        width: 360,
                        format: 'Y/m/d'
                    },
                    {
                        name: 'isTest',
                        xtype: 'combobox',
                        editable: false,
                        fieldLabel: i18n.getKey('isTest'),
                        itemId: 'isTest',
                        store: new Ext.data.Store({
                            fields: ['name', {
                                name: 'value',
                                type: 'boolean'
                            }],
                            data: [
                                {
                                    value: true,
                                    name: '是'
                                },
                                {
                                    value: false,
                                    name: '否'
                                }
                            ]
                        }),
                        displayField: 'name',
                        value: JSWebsiteIsTest() || !JSWebsiteIsStage(),
                        valueField: 'value'
                    },
                ]
            }
        };
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})