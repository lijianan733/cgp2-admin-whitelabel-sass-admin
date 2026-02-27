/**
 * @Description:
 * @author xiu
 * @date 2023/4/26
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.ordersummary.store.QpCutOffStore');
    Ext.create('CGP.ordersummary.view.CreateCutOff', {
        i18nblock: i18n.getKey('QP销售报表(Cut Off)'),
        store: store,
        isOriginal: false,
        exportExcelUrl: 'api/reports/whitelabel/cutoff/export'
    });
});
