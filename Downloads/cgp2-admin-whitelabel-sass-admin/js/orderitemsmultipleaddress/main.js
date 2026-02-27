/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.store.OrderItemsMultipleAddressStore',
    'CGP.orderitemsmultipleaddress.controller.Controller',
    'CGP.orderitemsmultipleaddress.view.orderItemsMultipleAddress',
    'CGP.orderdetails.view.render.OrderLineItemRender'
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'multipleAddress',
                region: 'multipleaddress',
            },
        ]
    })
});
