/**
 * Created by nan on 2019/9/7.
 * 下单测试数据:产品id
 * 17904767 sku 有定制的pmvt
 * 1928401 sku 无可定制
 * 生成 IS2112100001 IS开头的订单
 ， */
Ext.Loader.syncRequire([
    'CGP.order.view.cgpplaceorder.view.EditOrderLineItemPanel',
    'CGP.order.view.cgpplaceorder.view.BeginPage'
])
Ext.onReady(function () {
    var page = Ext.create("Ext.container.Viewport", {
        renderTo: Ext.getBody(),
        autoScroll: true,
        layout: 'fit',
        items: [{
            xtype: 'tabpanel',
            itemId: 'outTab',
            id: 'placeOrderOutTab',
            header: false,
            items: [
                {
                    xtype: 'beginpage'
                }
            ]
        }]
    });
});
