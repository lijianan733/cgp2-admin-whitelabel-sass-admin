Ext.define('CGP.customerordermanagement.view.CreateQpsonOrderTotalComp', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.qpson_order_total',
    width: 650,
    cls: 'background-color-grey',
    autoHeight: true,
    hideHeaders: true,
    orderId: null,
    order: null,
    setStoreData: function (order, shippingCurrencyExchangeRates) {
        var me = this,
            currencyCode = order?.get('currencyCode'),
            modifiedCurrency = order?.get('modifiedCurrency'),
            defaultCurrency = modifiedCurrency || currencyCode,
            controller = Ext.create('CGP.order.controller.Order');

        if (shippingCurrencyExchangeRates.length) {
            var result = controller.getExchangeRateText(defaultCurrency, shippingCurrencyExchangeRates);
            me.store.proxy.data.unshift({
                title: JSCreateFont('#000000', true, '计价汇率:', 14),
                text: result,
                isExChangeRates: true
            })
            me.store.load();
        }
    },
    initComponent: function () {
        var me = this,
            order = me.order,
            taxCurrencyExchangeRates = order?.get('taxCurrencyExchangeRates'),
            shippingCurrencyExchangeRates = order?.get('shippingCurrencyExchangeRates'),
            orderId = me.orderId = me.orderId || order.get('id'),
            url = adminPath + `api/orders/${orderId}/orderTotals?page=1&start=0&limit=25&sort=[{"property":"sortOrder","direction":"ASC"}]`,
            controller = Ext.create('CGP.order.controller.Order'),
            getQueryData = controller.getQuery(url);

        me.title = i18n.getKey('orderTotal');
        me.store = Ext.create('CGP.order.store.OrderTotal', {
            fields: [
                'title',
                'text',
                {
                    name: 'sortOrder',
                    type: 'int'
                },
                {
                    name: 'isExChangeRates',
                    type: 'boolean'
                },
                {
                    name: 'value',
                    type: 'float'
                }
            ],
            proxy: {
                type: 'memory'
            },
            data: getQueryData
        });
        me.setStoreData(order, shippingCurrencyExchangeRates);

        me.columns = [
            {
                dataIndex: 'title',
                width: 160,
                text: i18n.getKey('title'),
                autoSizeColumn: true,
                renderer: function (value, metaData, record, rowIndex) {
                    var isExChangeRates = record.get('isExChangeRates');
                    if (value === 'deliveryNo') {
                        return i18n.getKey('deliveryNo');
                    }
                    if (isExChangeRates) { // 检查是否为第一行
                        metaData.style = 'height: 40px;line-height: 30px;border-bottom: 1px solid black;'; // 设置第一行背景色为灰色
                    }
                    return value;
                },
            },
            {
                xtype: 'atagcolumn',
                width: 500,
                dataIndex: 'text',
                autoSizeColumn: true,
                align: 'left;padding:0px;',
                style: 'backgroundColor:red;',
                getDisplayName: function (value, metaData, record, rowIndex) {
                    var me = this,
                        code = record.raw['code'],
                        isExChangeRates = record.get('isExChangeRates');

                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    if (isExChangeRates) { // 检查是否为第一行
                        metaData.style = 'height: 40px;line-height: 15px;border-bottom: 1px solid black;'; // 设置第一行背景色为灰色
                    }
                    if (code === 'ot_discount') {
                        return value + '  <a href="#" title="明细" style="color: blue">明细</a>';
                    } else if (code === 'ot_total') {
                        return value;
                    } else {
                        return value;
                    }
                },
                clickHandler: function (value, metaData, record) {
                    var code = record.raw['code'],
                        codeGather = {
                            ot_discount: function () {
                                var orderId = me.orderId;
                                var discountTotal = record.get('value');
                                var url = adminPath + 'api/orders/' + orderId + '/v2';
                                JSAjaxRequest(url, 'GET', false, false, null, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success) {
                                            var discounts = responseText.data.discounts; // 优惠活动信息
                                            var allTotalPrice = discounts.reduce(function (init, current) {
                                                return init + current.totalPrice;
                                            }, 0);
                                            allTotalPrice = Math.round(allTotalPrice * 100) / 100;
                                            if (allTotalPrice != discountTotal) {
                                                discounts.push({
                                                    'couponCode': '',
                                                    'name': '修改订单金额',
                                                    'price': new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: responseText.data.currency.code,
                                                        minimumFractionDigits: 2
                                                    }).format((discountTotal - allTotalPrice))
                                                });
                                            }
                                            var win = Ext.create('Ext.window.Window', {
                                                layout: 'fit',
                                                modal: true,
                                                constrain: true,
                                                width: 450,
                                                minHeight: 150,
                                                maxHeight: 450,
                                                title: i18n.getKey('明细'),
                                                items: [{
                                                    xtype: 'grid',
                                                    store: {
                                                        xtype: 'store',
                                                        fields: ['couponCode', 'name', 'price'],
                                                        data: discounts
                                                    },
                                                    features: [{
                                                        ftype: 'summary'
                                                    }],
                                                    columns: [
                                                        {
                                                            text: '优惠活动名',
                                                            dataIndex: 'name',
                                                            flex: 1,
                                                        },
                                                        {
                                                            text: '优惠券代码',
                                                            dataIndex: 'couponCode',
                                                        },
                                                        {
                                                            text: '优惠金额',
                                                            dataIndex: 'price',
                                                            summaryType: 'count',
                                                            flex: 1,
                                                            summaryRenderer: function () {
                                                                var total = me.store.findRecord('title', 'Total :');
                                                                var totalPrice = total.get('value');
                                                                var persent = (record.get('value') / (record.get('value') + totalPrice) * 100).toFixed(2) + '%';
                                                                return '总计:' + discountTotal + '(' + persent + ')';
                                                            }
                                                        },
                                                    ]
                                                }]
                                            });
                                            win.show();
                                        }
                                    }
                                });
                            },
                            ot_total: function () {
                                if (taxCurrencyExchangeRates.length) {
                                    controller.createChangeRateWin(taxCurrencyExchangeRates);
                                } else {
                                    JSShowNotification({
                                        type: 'info',
                                        title: '未获取到汇率信息!',
                                    });
                                }
                            }
                        };
                    codeGather[code]();
                },
            }
        ];

        me.callParent(arguments);

    }
})
