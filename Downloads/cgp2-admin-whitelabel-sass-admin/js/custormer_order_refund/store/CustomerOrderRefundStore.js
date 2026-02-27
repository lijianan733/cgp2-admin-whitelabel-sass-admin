/**
 * @Description:
 * @author nan
  * @date 2025.05.22
 */
Ext.define('CGP.custormer_order_refund.store.CustomerOrderRefundStore', {
    extend: 'Ext.data.Store',
    requires: [
        'CGP.custormer_order_refund.model.CustomerOrderRefundModel'
    ],
    model: 'CGP.custormer_order_refund.model.CustomerOrderRefundModel',
    autoLoad: true,
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/customer/orders/refundRequests',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
});
