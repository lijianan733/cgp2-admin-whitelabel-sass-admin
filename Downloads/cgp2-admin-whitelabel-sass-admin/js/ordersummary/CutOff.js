/**
 * @Description:
 * @author nan
 * @date 2023/1/13
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.ordersummary.store.CutOffStore');
    Ext.create('CGP.ordersummary.view.CreateCutOff', {
        i18nblock: i18n.getKey('销售报表(Cut Off)'),
        store: store,
        isOriginal: true,
        exportExcelUrl: 'api/reports/cutoff/exportExcel'
    });
});
