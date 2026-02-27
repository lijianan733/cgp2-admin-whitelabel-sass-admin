/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.orderItemsAddress',
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'orderItemsAddress',
                region: 'orderItemsAddress',
            },
        ]
    })
});
