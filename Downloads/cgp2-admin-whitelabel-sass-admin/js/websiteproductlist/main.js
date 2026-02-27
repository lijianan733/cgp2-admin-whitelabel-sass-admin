/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.Loader.syncRequire([
    'CGP.websiteproductlist.store.WebsiteproductlistStore',
    'CGP.websiteproductlist.controller.Controller',
])
Ext.onReady(function () {
    var store = Ext.create('CGP.websiteproductlist.store.WebsiteproductlistStore');
    Ext.create('CGP.websiteproductlist.view.CreateGridPage', {
        i18nblock: i18n.getKey('websiteproductlist'),
        block: 'websiteproductlist',
        editPage: 'edit.html',
        store: store,
    })
});
