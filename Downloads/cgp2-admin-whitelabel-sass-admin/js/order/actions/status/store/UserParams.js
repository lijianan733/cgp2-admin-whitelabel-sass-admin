Ext.define('Order.status.store.UserParams', {
    extend: 'Ext.data.Store',
    model: 'Order.status.model.UserParams',
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{orderId}/userImpositionParams',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false,
    params : null,
    constructor : function(config){
        var me = this;
        var orderId = config.orderId;
        this.proxy.url = adminPath + 'api/orders/'+orderId+'/userImpositionParams';
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
