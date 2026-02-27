Ext.define('Order.status.store.MachineModel', {
    extend: 'Ext.data.Store',
    model: 'Order.status.model.MachineModel',

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/printers',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params : null,
    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});