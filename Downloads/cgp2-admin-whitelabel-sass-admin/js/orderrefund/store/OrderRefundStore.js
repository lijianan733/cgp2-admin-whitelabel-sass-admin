/**
 * @Description:
 * @author nan
 * @date 2022/12/5
 */
Ext.define('CGP.orderrefund.store.OrderRefundStore', {
    extend: 'Ext.data.Store',
    requires: [
        'CGP.orderrefund.model.OrderRefundModel'
    ],
    model: 'CGP.orderrefund.model.OrderRefundModel',
    autoLoad: true,
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/refundRequests',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
});
