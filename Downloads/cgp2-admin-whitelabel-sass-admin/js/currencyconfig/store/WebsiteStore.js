Ext.define("CGP.currencyconfig.store.WebsiteStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.currencyconfig.model.WebsiteModel',
    pageSize: 1000,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/platform/v2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});

