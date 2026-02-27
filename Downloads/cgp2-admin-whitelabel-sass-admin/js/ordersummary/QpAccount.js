/**
 * @Description:
 * @author xiu
 * @date 2023/4/26
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.ordersummary.store.QpAccountStore');
    Ext.create('CGP.ordersummary.view.CreateAccount', {
        i18nblock: i18n.getKey('QP销售报表(Account)'),
        store: store,
        isOriginal: false,
        exportExcelUrl: 'api/reports/whitelabel/account/export'
    });
});
