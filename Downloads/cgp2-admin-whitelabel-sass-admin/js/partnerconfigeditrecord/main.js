/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.Loader.syncRequire([
    'CGP.partnerconfigeditrecord.store.PartnerStore',
    'CGP.partnerconfigeditrecord.controller.Controller',
])
Ext.onReady(function () {
    var store = Ext.create('CGP.partnerconfigeditrecord.store.PartnerStore');
    Ext.create('CGP.partnerconfigeditrecord.view.CreateGridPage', {
        i18nblock: i18n.getKey('partnerconfigeditrecord'),
        block: 'partnerconfigeditrecord',
        editPage: 'edit.html',
        store: store,
    })
});
