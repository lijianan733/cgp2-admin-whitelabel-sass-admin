/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.Loader.syncRequire([
    'CGP.currencyconfig.store.CurrencyconfigStore',
    'CGP.currencyconfig.controller.Controller',
])
Ext.onReady(function () {
    var websiteId = JSGetQueryString('websiteId'),
        store = Ext.create('CGP.currencyconfig.store.CurrencyconfigStore', {
            params: {
                platformId: websiteId
            }
        });
    Ext.create('CGP.currencyconfig.view.CreateGridPage', {
        i18nblock: i18n.getKey('currencyconfig'),
        block: 'currencyconfig',
        editPage: 'edit.html',
        store: store,
    })
});
