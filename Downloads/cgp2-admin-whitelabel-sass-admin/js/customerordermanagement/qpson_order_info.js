/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.Loader.syncRequire([
    'CGP.customerordermanagement.view.CreateQpsonOrderInfo',
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'qpson_order_info',
            }
        ],
    })
})