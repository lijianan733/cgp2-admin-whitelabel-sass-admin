/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.Loader.syncRequire([
    'CGP.partner.view.partnerstorecheck.view.CreateGridPage',
    'CGP.partner.view.partnerstorecheck.store.PartnerStoreCheckStore'
])

Ext.onReady(function () {
    var store = Ext.create('CGP.partner.view.partnerstorecheck.store.PartnerStoreCheckStore');
    Ext.create('CGP.partner.view.partnerstorecheck.view.CreateGridPage', {
        i18nblock: i18n.getKey('partnerstorecheck'),
        block: 'partnerstorecheck',
        editPage: 'edit.html',
        store: store,
    })
});