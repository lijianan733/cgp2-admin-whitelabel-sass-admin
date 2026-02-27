/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.Loader.syncRequire([
    'CGP.currencyconfig.controller.Controller',
    'CGP.currencyconfig.view.CreateMainPanel'
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: "fit",
        items: [
            {
                xtype: 'createMainPanel'
            }
        ]
    })
});
