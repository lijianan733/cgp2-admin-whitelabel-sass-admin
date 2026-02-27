/**
 * @Description: 状态有Refunded,Cancelled,PendingRefund
 * @author nan
 * @date 2025.05.22
 */
Ext.Loader.syncRequire([
    'CGP.custormer_order_refund.view.RefundDetailForm',
    'CGP.custormer_order_refund.config.Config'
]);
Ext.onReady(function () {
    var controller = Ext.create('CGP.custormer_order_refund.controller.Controller');
    var customerOrderId = JSGetQueryString('customerOrderId');
    var refundOrderType = JSGetQueryString('refundOrderType');
    //退款申请id
    var _id = JSGetQueryString('_id');
    //货币信息
    var currencyStore = Ext.create('CGP.currency.store.Currency', {
        storeId: 'currencyStore',
        proxy: {
            type: 'memory',
        },
        data: controller.getCurrencyInfo()
    });
    //获取customer订单信息
    var customerOrderInfo = controller.getCustomerOrderInfo(customerOrderId);
    //货币标识
    var currencySymbol = controller.getCurrencyNote(currencyStore, customerOrderInfo);
    //获取订单价格信息
    var priceInfo = controller.getPriceInfo(customerOrderId);
    //订单的可申请退款的订单项信息
    var allowRefundItemsInfo = controller.getAllowRefundItems(customerOrderId);
    //根据订单项和退货申请组成新的数据
    var allOrderItems = controller.getOrderItems(customerOrderId);
    //统计出可退款项信息
    var priceInfoStr = controller.buildPriceInfo(customerOrderInfo, priceInfo, currencySymbol);
    //判断是否能新建新的退货申请
    controller.isAllowCreate(_id, allowRefundItemsInfo, customerOrderInfo);
    //是否為內部partner的訂單,這裡先只允許為內部訂單
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'refund_detail_form',
                refundOrderType: refundOrderType,
                controller: controller,
                customerOrderId: customerOrderId,
                customerOrderInfo: customerOrderInfo,
                orderNo: customerOrderInfo._id,
                allowRefundItemsInfo: allowRefundItemsInfo,
                currencySymbol: currencySymbol,
                priceInfo: priceInfo,
                allOrderItems: allOrderItems,
                priceInfoStr: priceInfoStr,
            }
        ]
    });

});