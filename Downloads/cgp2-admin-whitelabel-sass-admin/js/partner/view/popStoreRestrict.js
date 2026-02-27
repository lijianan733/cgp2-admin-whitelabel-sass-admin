Ext.Loader.syncRequire([
    'CGP.partner.view.popStoreRestrict.popStoreRestrict',
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'pop_store_restrict',
            }
        ]
    })
})