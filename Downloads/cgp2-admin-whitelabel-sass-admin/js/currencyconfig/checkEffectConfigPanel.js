/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.Loader.syncRequire([
    'CGP.currencyconfig.store.CurrencyconfigStore',
    'CGP.currencyconfig.controller.Controller',
    'CGP.currencyconfig.view.CreateCheckEffectConfigPanel'
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: "fit",
        items: [
            {
                xtype: 'createCheckEffectConfigPanel'
            }
        ]
    })
});
