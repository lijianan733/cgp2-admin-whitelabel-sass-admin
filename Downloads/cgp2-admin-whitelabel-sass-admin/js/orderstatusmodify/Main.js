/**
 * @Description: 修改订单的状态，通过对应的action操作进行
 * @author nan
 * @date 2022/1/11
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.EditForm',
    'CGP.order.model.Order',
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var form = page.add({
        xtype: 'editform',
    });
})