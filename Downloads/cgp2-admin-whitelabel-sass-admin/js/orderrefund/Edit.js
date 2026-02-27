/**
 * @Description: 状态有Refunded,Cancelled,PendingRefund
 * @author nan
 * @date 2022/12/5
 */
Ext.Loader.syncRequire([
    'CGP.orderrefund.view.DetailForm'
]);
Ext.onReady(function () {
    var controller = Ext.create('CGP.orderrefund.controller.Controller');
    var orderId = JSGetQueryString('orderId');
    var refundOrderType = JSGetQueryString('refundOrderType');
    console.log(refundOrderType)
    //货币信息
    var currencyStore = Ext.create('CGP.currency.store.Currency', {
        storeId: 'currencyStore',
        proxy: {
            type: 'memory',
        },
        data: controller.getCurrencyInfo()
    });
    var _id = JSGetQueryString('_id');
    //获取订单信息
    var orderInfo = controller.getOrderInfo(null, orderId);
    //获取订单付款信息
    var saleOrderInfo = controller.getSaleOrderInfo(orderId, refundOrderType, orderInfo);
    //货币标识
    var currencySymbol = controller.getCurrencyNote(currencyStore, saleOrderInfo);
    //该订单所有订单项
    var allOrderItems = controller.getOrderItems(orderId);
    //订单的所有退款申请
    var refundApplies = controller.getRefundApplies(orderId);
    //订单的可申请退款的申请
    var allowRefundItems = controller.getAllowRefundItems(orderId);
    //根据订单项和退货申请组成新的数据
    allOrderItems = controller.buildOrderItem(allOrderItems, saleOrderInfo.lineItems, allowRefundItems);
    //统计出可退款项信息
    var priceInfo = controller.buildPriceInfo(saleOrderInfo, refundApplies, currencySymbol);
    //判断是否能新建新的退货申请
    controller.isAllowCreate(_id, allowRefundItems, refundApplies, saleOrderInfo, orderInfo);
    //是否為內部partner的訂單,這裡先只允許為內部訂單
    /*var refundOrderType=orderInfo.partner.partnerType=='EXTERNAL'*/

    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'detailform',
                refundOrderType:refundOrderType,
                controller: controller,
                orderId: orderId,
                orderInfo: orderInfo,
                priceInfo: priceInfo,
                orderNo: saleOrderInfo.orderNumber,
                allowRefundItems: allowRefundItems,
                currencySymbol: currencySymbol,
                saleOrderInfo: saleOrderInfo,
                allOrderItems: allOrderItems,
                refundApplies: refundApplies
            }
        ]
    });

});