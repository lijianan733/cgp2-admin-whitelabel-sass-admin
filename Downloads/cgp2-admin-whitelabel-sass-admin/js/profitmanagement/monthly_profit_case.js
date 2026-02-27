/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.Loader.syncRequire([
    'CGP.profitmanagement.view.CreateMonthlyProfitCase',
    'CGP.profitmanagement.store.CreateMonthlyProfitCaseStore'
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'monthly_profit_case',
            }
        ]
    })
})