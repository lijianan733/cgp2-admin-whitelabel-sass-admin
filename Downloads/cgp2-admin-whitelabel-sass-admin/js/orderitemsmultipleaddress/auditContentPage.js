/**
 * @author xiu
 * @date 2025/12/18
 */
Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.view.auditContentPage',
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'audit_content_page',
            },
        ]
    })
});
