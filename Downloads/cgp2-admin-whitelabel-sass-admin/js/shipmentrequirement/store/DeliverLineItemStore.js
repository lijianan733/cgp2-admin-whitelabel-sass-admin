Ext.define('CGP.shipmentrequirement.store.DeliverLineItemStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.shipmentrequirement.model.ShipmentRequireListModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/shipmentRequirements/v2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'id',
        direction: 'DESC'
    }],
    params : null,
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if(config && config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
