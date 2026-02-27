/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.Loader.syncRequire([
    'CGP.profitmanagement.view.CreatePartnerProfitCheck',
    'CGP.profitmanagement.store.CreatePartnerProfitCheckStore'
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'partner_profit_check',
            }
        ]
    })
})