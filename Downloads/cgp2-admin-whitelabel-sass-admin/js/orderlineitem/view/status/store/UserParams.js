Ext.define('CGP.orderlineitem.view.status.store.UserParams', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderlineitem.view.status.model.UserParams',
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orderItems/{orderId}/userImpositionParams',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    params : null,
    constructor : function(config){
        var me = this;
        var orderItemId = config.orderItemId;
        this.proxy.url = adminPath + 'api/orderItems/'+orderItemId+'/userImpositionParams';
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});