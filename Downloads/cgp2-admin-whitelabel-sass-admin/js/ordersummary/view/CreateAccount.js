Ext.Loader.syncRequire([
    'CGP.orderrefund.store.RefundFromStore',
    'CGP.deliveryorder.store.ShippingMethod',
    'Ext.ux.grid.column.CurrencyColumn'
])
Ext.define('CGP.ordersummary.view.CreateAccount', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createAccount',
    store: null,
    isOriginal: null,
    i18nblock: null,
    exportExcelUrl: null,
    initComponent: function () {
        var me = this,
            orderNumber = me.isOriginal ? 'orderNo' : 'orderNumber',
            nameOrMethod = {
                orderNo: {
                    value: 'code',
                    name: 'deliveryName'
                },
                orderNumber: {
                    value: 'title',
                    name: 'deliveryMethod'
                }
            },
            deliveryValue = nameOrMethod[orderNumber].value,
            deliveryName = nameOrMethod[orderNumber].name;
        me.config = {
            i18nblock: me.i18nblock,
            block: 'ordersummary',
            //权限控制
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
                    autoSizeColumn: true,
                    sortable: false,
                    tdCls: 'vertical-middle',
                    renderer: function (value, metaData, record) {
                        return value;
                    }
                },
                columns: [
                    {
                        dataIndex: 'orderNo',
                        text: '订单编号'
                    },
                    {
                        dataIndex: 'referenceNo',
                        text: '其他单号'
                    },
                    {
                        dataIndex: 'baseCurrencyCode',
                        text: '本货币'
                    },
                    {
                        dataIndex: 'currencyCode',
                        text: '付款货币'
                    },
                    {
                        dataIndex: 'exchangeBaseNumber',
                        text: '本货币基数'
                    },

                    {
                        dataIndex: 'exchangeRate',
                        text: '汇率'
                    },
                    {
                        dataIndex: 'orderDate',
                        text: '付款日期',
                        width: 150,
                        sortable: true,
                        renderer: function (value, metaData, record) {
                            if (value) {
                                return Ext.Date.format(new Date(value), 'Y/m/d H:i');
                            }
                        }
                    },
                    /*   {
                           dataIndex: 'sysOrderDate',
                           text: '系统下单时间'
                       },
                       {
                           dataIndex: 'sysPayDate',
                           text: '系统付款时间'
                       },*/
                    {
                        dataIndex: 'deliveryDate',
                        text: '交收日期',
                        width: 150,
                        sortable: true,
                        renderer: function (value, metaData, record) {
                            if (value) {
                                return Ext.Date.format(new Date(value), 'Y/m/d H:i');
                            }
                        }
                    },
                    {
                        width: 250,
                        dataIndex: 'billAddress',
                        text: '账单地址'
                    },
                    {
                        width: 150,
                        dataIndex: 'userMail',
                        text: '用戶邮箱'
                    },
                    {
                        width: 150,
                        dataIndex: 'userName',
                        text: '用戶姓名'
                    },
                    {
                        width: 150,
                        dataIndex: 'receiverName',
                        text: '收货人'
                    },
                    {
                        dataIndex: 'paymentState',
                        text: '付款状态'
                    },
                    /*
                                    {
                                        dataIndex: 'paymentMethod',
                                        text: '付款方式'
                                    },*/
                    {
                        dataIndex: 'status',
                        text: '订单状态',
                        renderer: function (value, metaData, record) {
                            return i18n.getKey(value.name);
                        }
                    },
                    {
                        dataIndex: 'deliveryName',
                        text: '出货方式'
                    },
                    {
                        xtype: 'currencycolumn',
                        aimCurrencyCode: 'HKD',
                        dataIndex: 'totalCost',
                        text: '总成本(HKD)'
                    },
                    {
                        width: 150,
                        xtype: 'currencycolumn',
                        dataIndex: 'productsPrice',
                        text: '产品总售价'
                    },
                    {
                        dataIndex: 'productsWeight',
                        text: '重量(G)'
                    },
                    {
                        xtype: 'currencycolumn',
                        dataIndex: 'shippingPrice',
                        text: '运费'
                    },
                    {
                        xtype: 'currencycolumn',
                        dataIndex: 'paddingPrice',
                        text: '额外费用'
                    },
                    {
                        width: 150,
                        dataIndex: 'paddingDesc',
                        text: '额外费用说明'
                    },
                    {
                        xtype: 'currencycolumn',
                        dataIndex: 'tax',
                        text: '税金'
                    },
                    {
                        dataIndex: 'taxRate',
                        text: '税率'
                    },
                    {
                        dataIndex: 'rewardCredit',
                        text: '现金券'
                    },
                    {
                        dataIndex: 'couponCode',
                        text: '优惠券代码'
                    },
                    {
                        xtype: 'currencycolumn',
                        dataIndex: 'discountAmount',
                        text: '折扣'
                    },
                    {
                        dataIndex: 'orderType',
                        text: '订单类型'
                    },
                    //
                    {
                        xtype: 'currencycolumn',
                        width: 150,
                        dataIndex: 'totalPriceAfterDiscount',
                        text: '产品总售价扣除折扣'
                    },
                    {
                        xtype: 'currencycolumn',
                        width: 150,
                        dataIndex: 'bankTransferDiscount',
                        text: '银行转账优惠金额'
                    },
                    //
                    {
                        xtype: 'currencycolumn',
                        dataIndex: 'totalPrice',
                        text: '总价'
                    },
                    {
                        xtype: 'currencycolumn',
                        width: 150,
                        dataIndex: 'taxAmount',
                        text: '退款金额(退美国销售税)'
                    },
                    {
                        xtype: 'currencycolumn',
                        width: 150,
                        dataIndex: 'otherAmount',
                        text: '退款金额(退其他)'
                    },
                    {
                        dataIndex: 'refundSource',
                        text: '退款来源'
                    },
                    {
                        dataIndex: 'refundNumber',
                        text: '退款单号'
                    },
                    {
                        dataIndex: 'refundDate',
                        text: '退款时间',
                        sortable: true,
                        width: 150,
                        renderer: function (value, metaData, record) {
                            if (value) {
                                return Ext.Date.format(new Date(value), 'Y/m/d H:i');
                            }
                        }
                    },
                    {
                        xtype: 'currencycolumn',
                        dataIndex: 'netReceipt',
                        text: 'Net Receipt'
                    },
                    //
                    {
                        xtype: 'currencycolumn',
                        width: 150,
                        dataIndex: 'netReceiptQP',
                        text: 'Net ReceiptQP'
                    },

                    {
                        xtype: 'currencycolumn',
                        width: 150,
                        dataIndex: 'paidSalesTax',
                        text: '美国销售税金(已收取)'
                    },
                    {
                        dataIndex: 'accountingExchangeRate',
                        text: '会计汇率'
                    },
                    {
                        xtype: 'currencycolumn',
                        width: 160,
                        aimCurrencyCode: 'HKD',
                        dataIndex: 'netReceiptQPHKD',
                        text: 'Net Receipt(QP HKD)'
                    },
                    {
                        xtype: 'currencycolumn',
                        aimCurrencyCode: 'HKD',
                        dataIndex: 'taxHKD',
                        text: '税金(HKD)'
                    },
                    {
                        width: 250,
                        dataIndex: 'taxableSales',
                        text: 'Taxable sales(Sales tax exclued)'
                    },
                    {
                        dataIndex: 'shippingNo',
                        text: '邮递单号'
                    },
                    {
                        xtype: 'currencycolumn',
                        aimCurrencyCode: 'HKD',
                        dataIndex: 'shippingCost',
                        text: '实际运费(HKD)'
                    },
                    /*  {
                          dataIndex: 'redoShippingNo',
                          text: '(重做)郵遞單號'
                      },
                      {
                          dataIndex: 'redoShippingCost',
                          text: '(重做)實際運費(HKD)'
                      },*/
                    {
                        dataIndex: 'remark',
                        text: '备注'
                    },
                    {
                        width: 180,
                        dataIndex: 'shippingCountry',
                        text: '收货人国家/地区'
                    },
                    {
                        dataIndex: 'shippingState',
                        text: '收货人省/州'
                    },
                    {
                        dataIndex: 'shippingCity',
                        text: '收货人城市'
                    },
                    {
                        dataIndex: 'shippingPostCode',
                        text: '邮编'
                    },
                    {
                        dataIndex: 'isReturnedCustomer',
                        text: '是否曾购物'
                    },
                    {
                        dataIndex: 'registeredDate',
                        text: '注册时间',
                        sortable: true,
                        width: 150,
                        renderer: function (value, metaData, record) {
                            if (value) {
                                return Ext.Date.format(new Date(value), 'Y/m/d H:i');
                            }
                        }
                    },
                    {
                        dataIndex: 'edmDate',
                        text: 'EdmDate',
                        width: 150,
                        renderer: function (value, metaData, record) {
                            if (value) {
                                return Ext.Date.format(new Date(value), 'Y/m/d H:i');
                            }
                        }
                    },
                    {
                        dataIndex: 'source',
                        width: 150,
                        text: '來源'
                    },
                    /*{
                        dataIndex: 'paddingDesc',
                        text: '额外附加费用说明'
                    },
                    {
                        dataIndex: 'paidSalesTax',
                        text: '美國銷售稅金（已收取)'
                    },
                    {
                        dataIndex: 'payDate',
                        text: '付款日期'
                    },*/
                ]
            },
            // 查询输入框
            filterCfg: {
                minHeight: 120,
                items: [
                    {
                        xtype: 'textfield',
                        itemId: orderNumber,
                        name: orderNumber,
                        vtype: 'alphanum',
                        fieldLabel: '订单编号',
                        isLike: false,
                    }, {
                        xtype: 'textfield',
                        itemId: 'referenceNo',
                        name: 'referenceNo',
                        vtype: 'alphanum',
                        fieldLabel: '其他单号',
                        isLike: false,
                    }, {
                        xtype: 'combo',
                        itemId: 'paymentState',
                        name: 'paymentState',
                        fieldLabel: '付款状态',
                        isLike: false,
                        editable: false,
                        valueField: "value",
                        displayField: 'display',
                        store: {
                            xtype: 'store',
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: '已付款',
                                    display: '已付款'
                                },
                                {
                                    value: '未付款',
                                    display: '未付款'
                                },
                                {
                                    value: '已取消',
                                    display: '已取消'
                                }
                            ]
                        }

                    }, {
                        xtype: 'textfield',
                        itemId: 'userMail',
                        name: 'userMail',
                        fieldLabel: '用戶邮箱',
                        isLike: false,
                    }, {
                        xtype: 'combobox',
                        itemId: 'refundSource',
                        name: 'refundSource',
                        fieldLabel: '退款來源',
                        editable: false,
                        displayField: 'display',
                        valueField: 'value',
                        isLike: false,
                        haveReset: true,
                        store: Ext.create('CGP.orderrefund.store.RefundFromStore'),
                    },
                    {
                        xtype: 'combobox',
                        itemId: deliveryName,
                        name: deliveryName,
                        fieldLabel: '出货方式',
                        haveReset: true,
                        isLike: false,
                        displayField: 'code',
                        valueField: 'code',
                        editable: false,
                        store: Ext.create('CGP.deliveryorder.store.ShippingMethodStore'),
                    },
                    {
                        xtype: 'datefield',
                        itemId: 'orderDate',
                        name: 'orderDate',
                        fieldLabel: '付款日期',
                        isLike: false,
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