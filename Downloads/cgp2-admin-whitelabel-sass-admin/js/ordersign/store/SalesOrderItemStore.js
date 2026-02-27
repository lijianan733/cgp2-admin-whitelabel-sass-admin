Ext.define('CGP.ordersign.store.SalesOrderItemStore', {
    extend: 'Ext.data.Store',
    require: ['CGP.ordersign.model.SalesOrderItemModel'],
    model: 'CGP.ordersign.model.SalesOrderItemModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/' + 33071766 + '/lineItemsV2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    remoteSort: true,
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
})