/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.Loader.syncRequire([
    'CGP.currencyconfig.model.CurrencyconfigModel',
    'CGP.currencyconfig.controller.Controller',
])
Ext.onReady(function () {
    Ext.create('CGP.currencyconfig.view.CreateEditPage', {
        block: 'currencyconfig',
        gridPage: 'main.html',
    })
});
