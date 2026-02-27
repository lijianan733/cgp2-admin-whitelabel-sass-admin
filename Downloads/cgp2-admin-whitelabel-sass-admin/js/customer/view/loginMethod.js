/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.Loader.syncRequire([
    'CGP.customer.view.loginMethodPage',
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'login_method',
            }
        ]
    })
})