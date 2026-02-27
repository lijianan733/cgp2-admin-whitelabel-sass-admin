/**
 *查看订单详情
 *修改订单状态status
 *order id通过url参数入
 *
 */

Ext.Loader.setConfig({
    paths: {
        'Order.status': path + 'js/order/actions/status'
    },
    disableCaching: false,
    enabled: true
});
Ext.onReady(function () {

    var controller = Ext.create('Order.status.controller.Status');
    window.controller = controller;

    var page = new Ext.container.Viewport({
        layout: 'border',
        items: [Ext.create('Order.status.view.Status', {
            orderId: controller.id
        })]
    });
});