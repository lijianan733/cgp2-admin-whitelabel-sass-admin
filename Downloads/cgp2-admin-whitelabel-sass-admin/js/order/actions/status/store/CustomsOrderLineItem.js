Ext.define('Order.status.store.CustomsOrderLineItem', {
    extend: 'Ext.data.Store',
    model: 'Order.status.model.CustomsOrderLineItem',

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{id}/customsElements',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    pageSize: false,
    params : null,
    autoLoad: false,
    constructor: function (config) {
        var me = this;
        if(config.params){
            me.proxy.url = adminPath + 'api/orders/'+config.params.id+'/customsElements';
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})