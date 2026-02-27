Ext.define('CGP.order.view.order.OrderTotal', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ordertotal',
    width: 650,
    cls: 'background-color-grey',
    autoHeight: true,
    hideHeaders: true,
    orderId: null,
    order: null,
    priceComponents: null,//产品价格组成信息
    setStoreData: function (shippingCurrencyExchangeRates) {
        var me = this,
            order = me.order,
            paymentMethod = order?.get('paymentMethod'),
            currencyCode = order?.get('currencyCode'),
            modifiedCurrency = order?.get('modifiedCurrency'),
            defaultCurrency = modifiedCurrency || currencyCode,
            controller = Ext.create('CGP.order.controller.Order'),
            result = controller.getExchangeRateText(defaultCurrency, shippingCurrencyExchangeRates);

        if (paymentMethod === 'BankTransfer') {
            me.store.proxy.data.unshift({
                title: JSCreateFont('#000000', true, '计价汇率:', 14),
                text: result,
                isExChangeRates: true
            });
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
            getQueryData = controller.getQuery(url),
            orderUrl = adminPath + `api/orders/v2?page=1&start=0&limit=25&filter=[{"name":"_id","operator":"exactMatch","value":"${orderId}","type":"string"}]`,
            orderInfo = controller.getQuery(orderUrl),
            priceComponents = me.order.get('priceComponents') || orderInfo[0]?.priceComponents;
        
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
        me.setStoreData(shippingCurrencyExchangeRates);
        me.columns = [
            {
                dataIndex: 'title',
                width: 160,
                text: i18n.getKey('title'),
                autoSizeColumn: true,
                renderer: function (value, metaData, record, rowIndex) {
                    metaData.tdAttr = 'style="vertical-align: top;text-align: left;"';
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
                getDisplayName: function (value, metaData, record, rowIndex) {
                    var me = this,
                        code = record.raw['code'],
                        isExChangeRates = record.get('isExChangeRates');

                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    if (isExChangeRates) { // 汇率的特殊显示
                        metaData.style = 'height: 40px;line-height: 30px;border-bottom: 1px solid black;'; // 设置第一行背景色为灰色
                        return `${value}`;
                    } else {
                        metaData.style = 'text-align:left;'; // 设置第一行背景色为灰色
                        if (code === 'ot_discount') {
                            return `<div style="margin-left: 250px;">${value}  <a tag="ot_total" href="#" title="明细" style="color: blue;">明细</a></div>`;
                        } else if (code === 'ot_total') {
                            return `<div style="margin-left: 250px;">${value}</div>`;
                        } else if (code == 'ot_subtotal') {
                            if (priceComponents && priceComponents.length > 0) {
                                var url = path + 'ClientLibs/extjs/resources/custom-theme/images/grid/group-expand.png';
                                return `<div style="margin-left: 250px;">${value} <a tag="ot_total" class="x-grid-row-collapsed x-grid-row-expander" style="display: inline-block;;background:url(${url})"></div>`;
                            } else {
                                return `<div style="margin-left: 250px;">${value}</div>`;
                            }
                        } else {
                            return `<div style="margin-left: 250px;">${value}</div>`;
                        }
                    }
                },
                clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view, ela) {
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
                            },
                            ot_subtotal: function () {
                                var idStr = `price_info_${orderId}`;
                                var infoDiv = document.getElementById(idStr);


                                var infoObj = [];
                                priceComponents?.map(function (item) {
                                    infoObj.push({
                                        title: item.name,
                                        value: item.priceString
                                    });
                                });
                                var info = new Ext.XTemplate('<table style="width: inherit" >',
                                    '<tpl for=".">',
                                    '<tr class="x-form-item-input-row">',
                                    '<td class="x-field-label-cell" style="width: 390px">', '{title}:', '</td>',
                                    '<td style="white-space:normal;">',
                                    '<text data-qtip="{tips}">', '{value}', '</text>',
                                    '</td>',
                                    '</tr>',
                                    '</tpl>',
                                    '</table>').apply(infoObj);
                                var idStr = `price_info_${orderId}`;
                                //var str = `</a><div id="${idStr}" style="display: none;margin-left: 60px" >${info}</div>`;
                                var htmlStr = `<tr id="${idStr}"><td><div style="width: 620px;margin-left: 15px;border-width: 1px; border-style: solid; border-color: silver #d9d9d9 #d9d9d9;">${info}</div></td></tr>`;
                                if (ela.dom.style.background.indexOf('group-expand') != -1) {
                                    var url = path + 'ClientLibs/extjs/resources/custom-theme/images/grid/group-collapse.png';
                                    ela.dom.style.background = `url(${url})`;
                                    ela.up('tr').up('tr').dom.insertAdjacentHTML('afterend', htmlStr);

                                } else {
                                    var url = path + 'ClientLibs/extjs/resources/custom-theme/images/grid/group-expand.png';
                                    ela.dom.style.background = `url(${url})`;
                                    var el = document.getElementById(idStr);
                                    el.parentElement.removeChild(el);
                                }
                            }
                        };
                    codeGather[code]();
                    view.doComponentLayout();
                },
            }
        ];

        me.callParent(arguments);

    }
})
