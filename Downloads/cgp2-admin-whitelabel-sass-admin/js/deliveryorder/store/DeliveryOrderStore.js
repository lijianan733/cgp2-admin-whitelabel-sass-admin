Ext.define("CGP.deliveryorder.store.DeliveryOrderStore", {
    extend: 'Ext.data.Store',
    model: "CGP.deliveryorder.model.DeliveryOrderListModel",
    /**
     * @cfg {boolean} remoteSort
     * 是否在服务器端排序
     */
    remoteSort: false,
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize: 25,
    /**
     * @cfg {Ext.data.Proxy} proxy
     * store proxy
     */
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/shipmentOrders/v2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    /**
     * @cfg {boolean} autoLoad
     * 是否自动加载
     */
    autoLoad: true,
    sorters: [{
        property: 'createdDate',
        direction: 'DESC'
    }],
});
