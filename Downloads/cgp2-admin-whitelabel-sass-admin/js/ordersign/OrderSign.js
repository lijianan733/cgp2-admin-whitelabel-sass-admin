Ext.syncRequire([
    'CGP.ordersign.controller.Controller',
    'CGP.ordersign.view.ordersign.TopToolbar',
    'CGP.ordersign.view.ordersign.OrderInfo',
    'CGP.ordersign.view.ordersign.SalesOrderItem',
])

Ext.onReady(function () {
    var queryData,
        id = JSGetQueryString('id'),
        orderNumber = JSGetQueryString('orderNumber'),
        url = adminPath + 'api/ordersV2' + `?limit=20&page=1&filter=[{"name":"_id","operator":"exactMatch","value":"${id}","type":"string"}]`;
    JSSetLoading(true);
    JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
        JSSetLoading(false);
        if (success) {
            var responseText = Ext.JSON.decode(response.responseText);
            responseText.success && (queryData = responseText.data.content[0])
        }
    })
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'panel',
                itemId: 'orderSign',
                layout: 'vbox',
                autoScroll: true,
                border: false,
                id: 'orderSign',
                items: [
                    {
                        xtype: 'top_toolbar',
                        itemId: 'topToolbar',
                        orderId: id,
                    },
                    {
                        xtype: 'order_info',
                        itemId: 'orderInfo',
                        queryData: queryData,
                    },
                    {
                        xtype: 'sales_order_item',
                        itemId: 'SalesOrderItem',
                        orderId: id,
                        orderNumber: orderNumber,
                        title: i18n.getKey('销售订单项')
                    }
                ]
            }
        ]
    })
})
