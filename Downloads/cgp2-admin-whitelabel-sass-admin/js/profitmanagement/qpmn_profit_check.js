/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.Loader.syncRequire([
    'CGP.profitmanagement.view.CreateQpmnProfitCheck',
    'CGP.profitmanagement.store.CreateQpmnProfitCheckStore'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.profitmanagement.store.CreateQpmnProfitCheckStore', {});
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'qpmn_profit_check',
                store: store,
            }
        ]
    })
})