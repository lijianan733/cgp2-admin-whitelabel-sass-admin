/**
 * @Description:订单列表接口的store
 * @author nan
 * @date 2024/6/14
 */
Ext.define('CGP.orderv2.store.OrderListStore', {
    requires: 'CGP.orderv2.model.OrderListModel',
    extend: 'Ext.data.Store',
    model: 'CGP.orderv2.model.OrderListModel',
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/v2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'datePurchased',
        direction: 'DESC'
    }]
});