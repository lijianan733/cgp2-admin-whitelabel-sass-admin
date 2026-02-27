Ext.syncRequire([
    'CGP.ordersign.controller.Controller',
    'CGP.ordersign.view.batchsign.GridColumn',
    'CGP.ordersign.view.batchsign.TopToolbar',
])
Ext.onReady(function () {
    var results = [];
    var id = JSON.parse(JSGetQueryString('id'));
    /*id.forEach(items => {
        JSSetLoading(true);
        var url = adminPath + 'api/ordersV2' + `?limit=20&page=1&filter=[{"name":"_id","operator":"exactMatch","value":"${items}","type":"string"}]`;
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            JSSetLoading(false);
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                responseText.success && results.push(responseText.data.content[0]);
            }
        })
    })*/
    var url = adminPath + 'api/ordersV2' + `?limit=20&page=1&filter=[{"name":"includeIds","type": "string","value": "[${id}]"}]`;
    JSSetLoading(true);
    JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
        JSSetLoading(false);
        if (success) {
            var responseText = Ext.JSON.decode(response.responseText);
            responseText.success && (results = responseText.data.content);
        }
    })
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        id: 'batchSign',
        items: [{
            xtype: 'grid_column',
            tbar: {
                xtype: 'top_toolbar',
                itemId: 'topToolbar',
            },
            itemId: 'gridColumn',
            store: {
                xtype: 'store',
                fields: [
                    {
                        name: 'id',
                        type: 'string'
                    },
                    {
                        name: 'orderNumber',
                        type: 'string'
                    },
                    {
                        name: 'datePurchased',
                        type: 'string'
                    },
                    {
                        name: 'bindOrders',
                        type: 'object'
                    },
                    {
                        name: 'customerEmail',
                        type: 'string'
                    },
                    {
                        name: 'shippingMethod',
                        type: 'string'
                    },
                    {
                        name: 'shipmentInfo',
                        type: 'object'
                    },
                ],
                data: results
            },
        }]
    })
})