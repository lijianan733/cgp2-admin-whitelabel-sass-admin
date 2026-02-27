/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.Loader.syncRequire([
    'CGP.orderinghistoryrecord.store.OrderinghistoryrecordStore',
    'CGP.orderinghistoryrecord.controller.Controller',
])
Ext.onReady(function () {
    var store = Ext.create('CGP.orderinghistoryrecord.store.OrderinghistoryrecordStore');
    Ext.create('CGP.orderinghistoryrecord.view.CreateGridPage', {
        i18nblock: i18n.getKey('orderinghistoryrecord'),
        block: 'orderinghistoryrecord',
        editPage: 'edit.html',
        store: store,
    })
});
