/**
 * @author xiu
 * @date 2023/9/1
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.SanctionInfo',
])
Ext.onReady(function () {
    Ext.create('CGP.orderstatusmodify.view.SanctionInfo');
})