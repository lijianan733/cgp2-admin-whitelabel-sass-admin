/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.Loader.syncRequire([
    'CGP.profitmanagement.view.CreateEditProfitCheck',
    'CGP.profitmanagement.store.CreateEditProfitCheckStore'
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'edit_profit_check',
            }
        ]
    })
})