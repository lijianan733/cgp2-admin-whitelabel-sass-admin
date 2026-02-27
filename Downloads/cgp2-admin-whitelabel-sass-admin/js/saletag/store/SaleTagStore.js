Ext.define('CGP.saletag.store.SaleTagStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.saletag.model.SaleTagModel'],
    model: 'CGP.saletag.model.SaleTagModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/saletags',
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
    }
});
