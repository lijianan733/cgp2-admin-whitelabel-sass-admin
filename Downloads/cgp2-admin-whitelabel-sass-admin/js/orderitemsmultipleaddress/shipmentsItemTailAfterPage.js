/**
 * @author xiu
 * @date 2025/12/18
 */
Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.view.shipmentsItemTailAfterPage',
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'shipments_item_tail_after_page',
            },
        ]
    })
});
