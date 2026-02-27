Ext.define('Order.status.store.OrderProduceComponent', {
    extend: 'Ext.data.Store',
    model: 'Order.status.model.OrderProduceComponent',

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{orderId}/pendingProduceComponentInfos',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    pageSize: false,
    params : null,
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if(config.params){
            me.proxy.url = adminPath + 'api/orders/'+config.params.orderId+'/pendingProduceComponentInfos';
        }
        me.callParent(arguments);
    }
})