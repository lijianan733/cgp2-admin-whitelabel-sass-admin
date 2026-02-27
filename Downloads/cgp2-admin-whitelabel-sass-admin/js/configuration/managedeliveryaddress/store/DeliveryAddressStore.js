/**
 * Created by nan on 2018/4/18.
 */
Ext.syncRequire(['CGP.configuration.managedeliveryaddress.model.DeliveryAddressModel']);
Ext.define('CGP.configuration.managedeliveryaddress.store.DeliveryAddressStore', {
    extend:'Ext.data.Store',
    model: 'CGP.configuration.managedeliveryaddress.model.DeliveryAddressModel',
    autoLoad: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/receiveAddresses',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor:function(config){
        var me = this;
        if (config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments)
    }

});