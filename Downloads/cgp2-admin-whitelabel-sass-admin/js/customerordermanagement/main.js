/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.Loader.syncRequire([
    'CGP.customerordermanagement.store.CustomerordermanagementStore',
    'CGP.customerordermanagement.controller.Controller',
])
Ext.onReady(function () {
    Ext.create('CGP.customerordermanagement.view.CreateGridPage', {
        i18nblock: i18n.getKey('customerordermanagement'),
        block: 'customerordermanagement',
        editPage: 'edit.html',
    })
});
