/**
 * @author xiu
 * @date 2025/1/22
 */
Ext.define('CGP.deliveryorder.store.ShippingMethodV2', {
    extend: 'Ext.data.Store',
    idProperty: 'code',
    fields: ['code', 'title'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/shipmentOrders/availableActualShippingMethods',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    pageSize: 25,
    autoLoad: true,
    remoteSort: true,
    constructor : function(config){
        var me = this;
        if(config?.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
