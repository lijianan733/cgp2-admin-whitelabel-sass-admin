/**
 * @author xiu
 * @date 2025/4/22
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.CreateManufacturingBasePage',
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'manufacturing_base_page',
            }
        ]
    })
})