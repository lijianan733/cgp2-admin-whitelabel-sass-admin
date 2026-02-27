Ext.syncRequire([
    'CGP.ordersign.controller.Controller',
    'CGP.ordersign.view.orderInfo.OrderAmount',
    'CGP.ordersign.view.orderInfo.OrderForm',
    'CGP.ordersign.view.orderInfo.PaymentInfo',
    'CGP.ordersign.view.orderInfo.ReceiverInfo',
    'CGP.ordersign.view.orderInfo.TopToolbar',
])
Ext.onReady(function () {
    var result, url,
        id = JSGetQueryString('id'),
        bindOrderId = JSGetQueryString('bindOrderId'),
        orderNumber = JSGetQueryString('orderNumber'),
        controller = Ext.create('CGP.ordersign.controller.Controller');

    if (bindOrderId) {
        url = adminPath + 'api/partner/salesOrders/' + bindOrderId;
        result = controller.JSOrderInfoRequest(url, 'GET', null)['data'];
    }

    var viewPort = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        id: 'orderInfo',
        diySetValue: function (value) {
            var me = this,
                items = me.items.items;
            items.forEach(item => item.diySetValue(value));
        },
        items: [
            {
                xtype: 'panel',
                itemId: 'orderInfo',
                layout: 'vbox',
                autoScroll: true,
                border: false,
                defaults: {
                    margin: '5 20 10 40',
                    width: 750,
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                },
                diySetValue: function (value) {
                    var me = this,
                        items = me.items.items;
                    items.forEach(item => item.diySetValue ? item.diySetValue(value) : item.setValue(value));
                },
                tbar: [
                    {
                        xtype: 'top_toolbar',
                        itemId: 'topToolbar',
                        width: '100%',
                        padding: 0,
                        margin: 0,
                        orderId: id,
                        bindOrderId: bindOrderId,
                        queryResult: result,
                        orderNumber: orderNumber
                    },
                ],
                items: [
                    {
                        xtype: 'order_form',
                        itemId: 'orderForm'
                    },
                    {
                        xtype: 'payment_info',
                        itemId: 'paymentInfo',
                        title: i18n.getKey('payment'),
                    },
                    {
                        xtype: 'order_amount',
                        itemId: 'orderAmount',
                        queryResult: result,
                        width: 1000,
                        title: i18n.getKey('orderMoney'),
                    },
                    {
                        xtype: 'receiver_info',
                        itemId: 'receiverInfo',
                        width: 1000,
                        margin: '15 20 10 40',
                        title: i18n.getKey('receiveInfo'),
                        diySetValue: function (data) {
                            var me = this,
                                items = me.items.items;
                            console.log(data)
                            items.forEach(item => item.diySetValue ? item.diySetValue(data) : item.setValue(data));
                        },
                    },
                ]
            }
        ]
    })

    viewPort.diySetValue(result)
})
