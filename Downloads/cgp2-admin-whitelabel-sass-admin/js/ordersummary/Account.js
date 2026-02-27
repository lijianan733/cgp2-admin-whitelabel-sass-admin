/**
 * @Description:
 * @author nan
 * @date 2023/1/13
 */
/**
 * Created by nan on 2020/12/14
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.ordersummary.store.AccountStore');
    Ext.create('CGP.ordersummary.view.CreateAccount', {
        i18nblock: i18n.getKey('销售报表(Account)'),
        store: store,
        isOriginal: true,
        exportExcelUrl: 'api/reports/account/exportExcel'
    });
});
